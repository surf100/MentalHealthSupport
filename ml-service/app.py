import os
from functools import lru_cache
from typing import List

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer


DEFAULT_MODEL_ID = "slimshady07/Mental_BERT"
MAX_LENGTH = int(os.getenv("MENTALBERT_MAX_LENGTH", "256"))
HF_TOKEN = os.getenv("HF_TOKEN")

app = FastAPI(title="MentalBERT Risk Service", version="1.0.0")


class AnalyzeRequest(BaseModel):
    title: str
    content: str
    category: str


class LabelScore(BaseModel):
    label: str
    score: float


class AnalyzeResponse(BaseModel):
    sentimentScore: float
    riskScore: int
    riskLevel: str
    flaggedForReview: bool
    summary: str
    modelId: str
    labels: List[LabelScore]


@lru_cache(maxsize=1)
def load_pipeline():
    model_id = os.getenv("MENTALBERT_MODEL_ID", DEFAULT_MODEL_ID)
    tokenizer = AutoTokenizer.from_pretrained(model_id, token=HF_TOKEN)
    model = AutoModelForSequenceClassification.from_pretrained(model_id, token=HF_TOKEN)
    model.eval()
    return model_id, tokenizer, model


def normalize_label(label: str) -> str:
    return label.lower().replace(" ", "_").replace("-", "_")


def score_weight_for_label(label: str) -> float:
    normalized = normalize_label(label)

    weighted_keywords = {
        "suicide": 1.0,
        "self_harm": 1.0,
        "selfharm": 1.0,
        "crisis": 0.95,
        "severe": 0.9,
        "distress": 0.85,
        "depression": 0.7,
        "depressed": 0.7,
        "trauma": 0.65,
        "ptsd": 0.65,
        "abuse": 0.8,
        "violence": 0.85,
        "panic": 0.55,
        "anxiety": 0.5,
        "stress": 0.35,
        "adhd": 0.2,
        "bipolar": 0.4,
    }

    non_risk_keywords = [
        "no_",
        "non_",
        "neutral",
        "other",
        "control",
        "normal",
        "safe",
        "not_",
        "none",
    ]

    if normalized in {"label_0", "negative"}:
        return 0.0
    if normalized in {"label_1", "positive"}:
        return 1.0
    if any(keyword in normalized for keyword in non_risk_keywords):
        return 0.0

    best_weight = 0.0
    for keyword, weight in weighted_keywords.items():
        if keyword in normalized:
            best_weight = max(best_weight, weight)

    return best_weight


def derive_risk_probability(labels: List[LabelScore]) -> float:
    weighted_sum = 0.0
    total_weight = 0.0

    for item in labels:
        weight = score_weight_for_label(item.label)
        probability = item.score
        weighted_sum += probability * weight
        total_weight += probability

    if total_weight <= 0:
        return 0.0

    return max(0.0, min(1.0, weighted_sum / total_weight))


def risk_level_for_score(risk_score: int) -> str:
    if risk_score >= 85:
        return "CRITICAL"
    if risk_score >= 60:
        return "HIGH"
    if risk_score >= 30:
        return "MODERATE"
    return "LOW"


def build_summary(labels: List[LabelScore], risk_score: int, model_id: str) -> str:
    top_items = labels[:2]
    signals = ", ".join(
        f"{item.label} {item.score:.2f}"
        for item in top_items
    )
    return f"{model_id} top signals: {signals}. Computed risk score {risk_score}/100."


@app.get("/health")
def health():
    try:
        model_id, _, _ = load_pipeline()
        return {"status": "ok", "modelId": model_id}
    except Exception as exc:
        return {
            "status": "error",
            "modelId": os.getenv("MENTALBERT_MODEL_ID", DEFAULT_MODEL_ID),
            "error": str(exc),
        }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        model_id, tokenizer, model = load_pipeline()
        text = f"Category: {request.category}\nTitle: {request.title}\nContent: {request.content}"

        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=MAX_LENGTH,
        )

        with torch.no_grad():
            logits = model(**inputs).logits
            probabilities = torch.softmax(logits, dim=-1)[0].tolist()

        labels: List[LabelScore] = []
        id_to_label = getattr(model.config, "id2label", {}) or {}
        for index, probability in enumerate(probabilities):
            label = id_to_label.get(index, f"LABEL_{index}")
            labels.append(LabelScore(label=label, score=round(float(probability), 6)))

        labels.sort(key=lambda item: item.score, reverse=True)

        risk_probability = derive_risk_probability(labels)
        risk_score = int(round(risk_probability * 100))
        risk_level = risk_level_for_score(risk_score)
        flagged_for_review = risk_level in {"HIGH", "CRITICAL"}
        sentiment_score = round(1.0 - (2.0 * risk_probability), 4)

        return AnalyzeResponse(
            sentimentScore=max(-1.0, min(1.0, sentiment_score)),
            riskScore=risk_score,
            riskLevel=risk_level,
            flaggedForReview=flagged_for_review,
            summary=build_summary(labels, risk_score, model_id),
            modelId=model_id,
            labels=labels,
        )
    except Exception as exc:
        detail = str(exc)
        if "gated" in detail.lower() or "access" in detail.lower() or "401" in detail:
            detail = (
                "Failed to load the MentalBERT checkpoint. "
                "This model may require accepting Hugging Face access conditions and/or setting HF_TOKEN. "
                f"Original error: {exc}"
            )
        raise HTTPException(status_code=503, detail=detail) from exc
