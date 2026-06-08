import os
import re
from functools import lru_cache
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


DEFAULT_MODEL_DIR = Path(__file__).resolve().parent
configured_model_dir = os.getenv("MENTALBERT_MODEL_DIR", "").strip()
configured_model_path = Path(configured_model_dir).expanduser() if configured_model_dir else None
LOCAL_MODEL_DIR = (
    configured_model_path.resolve()
    if configured_model_path and configured_model_path.is_absolute()
    else (DEFAULT_MODEL_DIR / configured_model_path).resolve()
    if configured_model_path
    else DEFAULT_MODEL_DIR
)
LOCAL_MODEL_ID = "local:slimshady07/Mental_BERT"
MAX_LENGTH = 256

MODERATE_RISK_THRESHOLD = 20
HIGH_RISK_THRESHOLD = 45
CRITICAL_RISK_THRESHOLD = 75
LABEL_LIMIT = 5

app = FastAPI(title="Local Mental BERT Risk Service", version="3.0.0")


class AnalyzeRequest(BaseModel):
    title: str
    content: str
    category: str


class LabelScore(BaseModel):
    label: str = Field(..., min_length=1, max_length=64)
    score: float = Field(..., ge=0.0, le=1.0)

    class Config:
        extra = "forbid"


class AnalyzeResponse(BaseModel):
    sentimentScore: float
    riskScore: int
    riskLevel: str
    flaggedForReview: bool
    summary: str
    modelId: str
    labels: List[LabelScore]


def normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def cleanup_label(label: str) -> str:
    normalized = label.lower().replace(" ", "_").replace("-", "_")
    normalized = re.sub(r"[^a-z0-9_]+", "_", normalized)
    normalized = re.sub(r"_+", "_", normalized).strip("_")
    return normalized or "unknown"


def risk_level_for_score(risk_score: int) -> str:
    if risk_score >= CRITICAL_RISK_THRESHOLD:
        return "CRITICAL"
    if risk_score >= HIGH_RISK_THRESHOLD:
        return "HIGH"
    if risk_score >= MODERATE_RISK_THRESHOLD:
        return "MODERATE"
    return "LOW"


def model_file_exists() -> bool:
    return (LOCAL_MODEL_DIR / "model.safetensors").exists() or (
        LOCAL_MODEL_DIR / "pytorch_model.bin"
    ).exists()


@lru_cache(maxsize=1)
def load_local_model():
    if not (LOCAL_MODEL_DIR / "config.json").exists():
        raise RuntimeError(f"Missing local model config in {LOCAL_MODEL_DIR}")
    if not model_file_exists():
        raise RuntimeError(f"Missing local model weights in {LOCAL_MODEL_DIR}")

    try:
        import torch  # type: ignore
        from transformers import AutoModelForSequenceClassification, AutoTokenizer  # type: ignore
    except ImportError as exc:
        raise RuntimeError(
            "Local model dependencies are missing. Install requirements from "
            "ml-service/requirements.txt."
        ) from exc

    tokenizer = AutoTokenizer.from_pretrained(
        LOCAL_MODEL_DIR,
        local_files_only=True,
    )
    model = AutoModelForSequenceClassification.from_pretrained(
        LOCAL_MODEL_DIR,
        local_files_only=True,
    )
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()
    return tokenizer, model, torch, device


def label_for_index(model, index: int) -> str:
    id_to_label = getattr(model.config, "id2label", {}) or {}
    label = id_to_label.get(index, f"LABEL_{index}")

    if label == "LABEL_0":
        return "no_distress"
    if label == "LABEL_1":
        return "distress"
    return cleanup_label(str(label))


def build_input_text(request: AnalyzeRequest) -> str:
    return normalize_whitespace(
        f"Category: {request.category}\nTitle: {request.title}\nContent: {request.content}"
    )


def classify_with_local_model(request: AnalyzeRequest) -> tuple[float, List[LabelScore]]:
    tokenizer, model, torch, device = load_local_model()
    inputs = tokenizer(
        build_input_text(request),
        return_tensors="pt",
        truncation=True,
        max_length=MAX_LENGTH,
    )
    inputs = {key: value.to(device) for key, value in inputs.items()}

    with torch.no_grad():
        logits = model(**inputs).logits

    if logits.shape[-1] == 1:
        risk_probability = float(torch.sigmoid(logits)[0][0].item())
        labels = [
            LabelScore(label="no_distress", score=round(1.0 - risk_probability, 6)),
            LabelScore(label="distress", score=round(risk_probability, 6)),
        ]
    else:
        probabilities = torch.softmax(logits, dim=-1)[0].tolist()
        labels = [
            LabelScore(label=label_for_index(model, index), score=round(float(score), 6))
            for index, score in enumerate(probabilities)
        ]
        risk_probability = float(probabilities[1] if len(probabilities) > 1 else probabilities[0])

    labels.sort(key=lambda item: item.score, reverse=True)
    return max(0.0, min(1.0, risk_probability)), labels[:LABEL_LIMIT]


def build_summary(risk_score: int, risk_level: str, labels: List[LabelScore]) -> str:
    if labels:
        top_label = labels[0]
        return (
            f"Local Mental_BERT classified this as {risk_level.lower()} risk "
            f"with top signal {top_label.label} at {top_label.score:.2f}."
        )
    return f"Local Mental_BERT classified this as {risk_level.lower()} risk."


@app.get("/health")
def health():
    try:
        _, model, torch, device = load_local_model()
        return {
            "status": "ok",
            "provider": "local",
            "modelId": LOCAL_MODEL_ID,
            "modelPath": str(LOCAL_MODEL_DIR),
            "device": str(device),
            "numLabels": int(getattr(model.config, "num_labels", 0)),
            "torchVersion": torch.__version__,
        }
    except Exception as exc:
        return {
            "status": "error",
            "provider": "local",
            "modelId": LOCAL_MODEL_ID,
            "modelPath": str(LOCAL_MODEL_DIR),
            "error": str(exc),
        }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        risk_probability, labels = classify_with_local_model(request)
        risk_score = int(round(risk_probability * 100))
        risk_level = risk_level_for_score(risk_score)
        sentiment_score = round(1.0 - (2.0 * risk_probability), 4)

        return AnalyzeResponse(
            sentimentScore=max(-1.0, min(1.0, sentiment_score)),
            riskScore=max(0, min(100, risk_score)),
            riskLevel=risk_level,
            flaggedForReview=risk_level in {"HIGH", "CRITICAL"},
            summary=build_summary(risk_score, risk_level, labels),
            modelId=LOCAL_MODEL_ID,
            labels=labels,
        )
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
