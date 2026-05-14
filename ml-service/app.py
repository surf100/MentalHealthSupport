import json
import os
import re
from functools import lru_cache
from typing import Any, Dict, List
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


def read_env(*names: str, default: str) -> str:
    for name in names:
        value = os.getenv(name)
        if value is not None and value != "":
            return value
    return default


DEFAULT_HUGGINGFACE_MODEL_ID = "slimshady07/Mental_BERT"
DEFAULT_OPENAI_MODEL_ID = "gpt-5.4-nano"
DEFAULT_GEMINI_MODEL_ID = "gemini-2.5-flash"

MAX_LENGTH = int(read_env("MENTALBERT_MAX_LENGTH", default="256"))
HF_TOKEN = read_env("HF_TOKEN", default="")

RISK_SCORE_MULTIPLIER = float(
    read_env("MENTALBERT_RISK_SCORE_MULTIPLIER", default="1.5")
)
MODERATE_RISK_THRESHOLD = int(read_env("MENTALBERT_MODERATE_THRESHOLD", default="20"))
HIGH_RISK_THRESHOLD = int(read_env("MENTALBERT_HIGH_THRESHOLD", default="45"))
CRITICAL_RISK_THRESHOLD = int(read_env("MENTALBERT_CRITICAL_THRESHOLD", default="75"))
CRISIS_PHRASE_SCORE_FLOOR = int(
    read_env("MENTALBERT_CRISIS_PHRASE_SCORE_FLOOR", default="85")
)

ANALYZER_PROVIDER = read_env(
    "AI_MODERATION_PROVIDER",
    "RISK_ANALYZER_PROVIDER",
    default="auto",
).strip().lower()
OPENAI_API_KEY = read_env("OPENAI_API_KEY", default="").strip()
OPENAI_BASE_URL = read_env(
    "OPENAI_BASE_URL",
    default="https://api.openai.com/v1",
).rstrip("/")
OPENAI_MODEL_ID = read_env("OPENAI_MODEL", default=DEFAULT_OPENAI_MODEL_ID)
OPENAI_TIMEOUT_SECONDS = float(read_env("OPENAI_TIMEOUT_SECONDS", default="45"))
GEMINI_API_KEY = read_env("GEMINI_API_KEY", "GOOGLE_API_KEY", default="").strip()
GEMINI_BASE_URL = read_env(
    "GEMINI_BASE_URL",
    default="https://generativelanguage.googleapis.com/v1beta",
).rstrip("/")
GEMINI_MODEL_ID = read_env("GEMINI_MODEL", default=DEFAULT_GEMINI_MODEL_ID)
GEMINI_TIMEOUT_SECONDS = float(read_env("GEMINI_TIMEOUT_SECONDS", default="45"))
SUMMARY_CHARACTER_LIMIT = 500
LABEL_LIMIT = 5

CRISIS_PHRASE_WEIGHTS = {
    "kill myself": 100,
    "end my life": 100,
    "want to die": 95,
    "don't want to live": 95,
    "do not want to live": 95,
    "suicide": 100,
    "suicidal": 95,
    "hurt myself": CRISIS_PHRASE_SCORE_FLOOR,
    "self harm": CRISIS_PHRASE_SCORE_FLOOR,
    "self-harm": CRISIS_PHRASE_SCORE_FLOOR,
    "harm myself": CRISIS_PHRASE_SCORE_FLOOR,
}

RISK_CLASSIFIER_INSTRUCTIONS = """You are a campus safety and mental-health moderation classifier.
Assess student-written reports and forum posts for human review triage.

Important guidance:
- Use context and implied meaning, not just keywords.
- Lower the score for ordinary frustration, sarcasm, quotes, song lyrics, jokes, figurative language, or descriptions about someone else when there is no direct danger.
- Raise the score for sustained hopelessness, bullying, abuse, panic, threats, self-harm, suicidal intent, or urgent safety concerns.
- This is moderation triage, not diagnosis.
- Use 1 to 5 short snake_case labels for the strongest signals.
- Keep the summary concise, factual, and suitable for a moderator dashboard.
- Return only JSON that matches the provided schema.
"""

app = FastAPI(title="AI Moderation Risk Service", version="2.0.0")


class AnalyzeRequest(BaseModel):
    title: str
    content: str
    category: str


class LabelScore(BaseModel):
    label: str = Field(..., min_length=1, max_length=64)
    score: float = Field(..., ge=0.0, le=1.0)

    class Config:
        extra = "forbid"


class StructuredRiskAssessment(BaseModel):
    riskScore: int = Field(..., ge=0, le=100)
    summary: str = Field(..., min_length=1, max_length=320)
    labels: List[LabelScore] = Field(default_factory=list)

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


OPENAI_RISK_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "required": ["riskScore", "summary", "labels"],
    "properties": {
        "riskScore": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
        },
        "summary": {
            "type": "string",
            "minLength": 1,
            "maxLength": 320,
        },
        "labels": {
            "type": "array",
            "maxItems": LABEL_LIMIT,
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["label", "score"],
                "properties": {
                    "label": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 64,
                    },
                    "score": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 1,
                    },
                },
            },
        },
    },
}

GEMINI_RISK_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "riskScore": {
            "type": "integer",
            "description": "Urgency score from 0 to 100 for moderator triage.",
        },
        "summary": {
            "type": "string",
            "description": "Brief factual explanation for moderators.",
        },
        "labels": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "label": {
                        "type": "string",
                        "description": "Short snake_case signal label.",
                    },
                    "score": {
                        "type": "number",
                        "description": "Confidence from 0 to 1.",
                    },
                },
                "required": ["label", "score"],
            },
        },
    },
    "required": ["riskScore", "summary", "labels"],
}


def parse_model_from_json(model_class: Any, raw_json: str) -> BaseModel:
    if hasattr(model_class, "model_validate_json"):
        return model_class.model_validate_json(raw_json)
    return model_class.parse_raw(raw_json)


def active_provider() -> str:
    if ANALYZER_PROVIDER in {"", "auto"}:
        if GEMINI_API_KEY:
            return "gemini"
        if OPENAI_API_KEY:
            return "openai"
        return "huggingface"
    if ANALYZER_PROVIDER not in {"openai", "gemini", "huggingface"}:
        raise RuntimeError(
            "Unsupported AI_MODERATION_PROVIDER. Use 'auto', 'gemini', 'openai', or 'huggingface'."
        )
    if ANALYZER_PROVIDER == "openai" and not OPENAI_API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY is required when AI_MODERATION_PROVIDER is set to 'openai'."
        )
    if ANALYZER_PROVIDER == "gemini" and not GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY or GOOGLE_API_KEY is required when AI_MODERATION_PROVIDER is set to 'gemini'."
        )
    return ANALYZER_PROVIDER


@lru_cache(maxsize=1)
def load_huggingface_pipeline():
    try:
        import torch  # type: ignore
        from transformers import AutoModelForSequenceClassification, AutoTokenizer  # type: ignore
    except ImportError as exc:
        raise RuntimeError(
            "Local Hugging Face dependencies are missing. Install torch and transformers "
            "or switch AI_MODERATION_PROVIDER to 'gemini' or 'openai'."
        ) from exc

    model_id = read_env("MENTALBERT_MODEL_ID", default=DEFAULT_HUGGINGFACE_MODEL_ID)
    tokenizer = AutoTokenizer.from_pretrained(model_id, token=HF_TOKEN or None)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_id,
        token=HF_TOKEN or None,
    )
    model.eval()
    return model_id, tokenizer, model, torch


def normalize_label(label: str) -> str:
    return label.lower().replace(" ", "_").replace("-", "_")


def cleanup_label(label: str) -> str:
    normalized = normalize_label(label)
    normalized = re.sub(r"[^a-z0-9_]+", "_", normalized)
    normalized = re.sub(r"_+", "_", normalized).strip("_")
    return normalized or "general_distress"


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
    if risk_score >= CRITICAL_RISK_THRESHOLD:
        return "CRITICAL"
    if risk_score >= HIGH_RISK_THRESHOLD:
        return "HIGH"
    if risk_score >= MODERATE_RISK_THRESHOLD:
        return "MODERATE"
    return "LOW"


def calibrate_risk_score(raw_score: int) -> int:
    adjusted = int(round(raw_score * RISK_SCORE_MULTIPLIER))
    return max(0, min(100, adjusted))


def crisis_score_floor_for_text(text: str) -> tuple[int, List[str]]:
    normalized = text.lower()
    matched_phrases = [phrase for phrase in CRISIS_PHRASE_WEIGHTS if phrase in normalized]

    if not matched_phrases:
        return 0, []

    score_floor = max(CRISIS_PHRASE_WEIGHTS[phrase] for phrase in matched_phrases)
    return score_floor, matched_phrases


def normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def truncate_text(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    trimmed = text[: max(0, limit - 3)].rstrip()
    return trimmed + "..."


def normalize_labels(labels: List[LabelScore], matched_phrases: List[str]) -> List[LabelScore]:
    normalized: List[LabelScore] = []
    seen_labels = set()

    for item in labels:
        cleaned_label = cleanup_label(item.label)
        if cleaned_label in seen_labels:
            continue
        seen_labels.add(cleaned_label)
        normalized.append(
            LabelScore(
                label=cleaned_label,
                score=round(max(0.0, min(1.0, float(item.score))), 4),
            )
        )

    if matched_phrases and "explicit_crisis_language" not in seen_labels:
        normalized.insert(0, LabelScore(label="explicit_crisis_language", score=1.0))

    normalized.sort(key=lambda item: item.score, reverse=True)
    return normalized[:LABEL_LIMIT]


def build_huggingface_summary(labels: List[LabelScore]) -> str:
    if labels:
        top_signals = ", ".join(
            f"{cleanup_label(item.label)} {item.score:.2f}"
            for item in labels[:2]
        )
        return f"Top moderation signals: {top_signals}"
    return "Limited classifier confidence; using fallback moderation heuristics"


def finalize_summary(summary: str, risk_score: int, matched_phrases: List[str]) -> str:
    parts: List[str] = []
    cleaned_summary = normalize_whitespace(summary).rstrip(".")
    if cleaned_summary:
        parts.append(cleaned_summary)
    if matched_phrases:
        parts.append(
            "Explicit crisis language detected: " + ", ".join(matched_phrases)
        )
    parts.append(f"Triage score {risk_score}/100")
    return truncate_text(". ".join(parts) + ".", SUMMARY_CHARACTER_LIMIT)


def extract_openai_output_text(response_body: Dict[str, Any]) -> str:
    output_text = response_body.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    collected: List[str] = []

    for item in response_body.get("output", []):
        if item.get("type") != "message":
            continue

        for content in item.get("content", []):
            content_type = content.get("type")
            if content_type == "output_text":
                text = content.get("text", "")
                if text:
                    collected.append(text)
            if content_type == "refusal":
                raise RuntimeError(
                    "The provider refused to classify this report for moderation."
                )

    joined = "\n".join(part.strip() for part in collected if part.strip()).strip()
    if joined:
        return joined

    error = response_body.get("error")
    if isinstance(error, dict) and error.get("message"):
        raise RuntimeError(str(error["message"]))

    raise RuntimeError("The provider returned no structured text output.")


def build_classification_prompt(request: AnalyzeRequest) -> str:
    return (
        f"{RISK_CLASSIFIER_INSTRUCTIONS}\n\n"
        "Classify this campus mental-health moderation submission.\n\n"
        f"Category: {request.category}\n"
        f"Title: {request.title}\n"
        f"Content: {request.content}\n"
    )


def analyze_with_openai(request: AnalyzeRequest) -> tuple[str, int, str, List[LabelScore]]:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    payload = {
        "model": OPENAI_MODEL_ID,
        "instructions": RISK_CLASSIFIER_INSTRUCTIONS,
        "input": build_classification_prompt(request),
        "max_output_tokens": 300,
        "text": {
            "format": {
                "type": "json_schema",
                "name": "moderation_risk_assessment",
                "strict": True,
                "schema": OPENAI_RISK_SCHEMA,
            }
        },
    }

    encoded_payload = json.dumps(payload).encode("utf-8")
    http_request = Request(
        f"{OPENAI_BASE_URL}/responses",
        data=encoded_payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )

    try:
        with urlopen(http_request, timeout=OPENAI_TIMEOUT_SECONDS) as response:
            raw_body = response.read().decode("utf-8")
    except HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"OpenAI Responses API returned HTTP {exc.code}: {error_body}"
        ) from exc
    except URLError as exc:
        raise RuntimeError(f"Could not reach the OpenAI Responses API: {exc}") from exc

    response_body = json.loads(raw_body)
    structured_text = extract_openai_output_text(response_body)
    assessment = parse_model_from_json(StructuredRiskAssessment, structured_text)
    labels = normalize_labels(list(assessment.labels), matched_phrases=[])
    risk_score = max(0, min(100, int(assessment.riskScore)))
    summary = truncate_text(normalize_whitespace(assessment.summary), 320)
    return OPENAI_MODEL_ID, risk_score, summary, labels


def extract_gemini_output_text(response_body: Dict[str, Any]) -> str:
    candidates = response_body.get("candidates", [])
    if not isinstance(candidates, list) or not candidates:
        prompt_feedback = response_body.get("promptFeedback")
        if isinstance(prompt_feedback, dict) and prompt_feedback.get("blockReason"):
            raise RuntimeError(
                f"Gemini blocked the request: {prompt_feedback.get('blockReason')}"
            )
        raise RuntimeError("Gemini returned no candidates.")

    first_candidate = candidates[0]
    finish_reason = first_candidate.get("finishReason")
    if finish_reason and finish_reason not in {"STOP", "MAX_TOKENS"}:
        raise RuntimeError(f"Gemini did not complete normally: {finish_reason}")

    content = first_candidate.get("content", {})
    for part in content.get("parts", []):
        text = part.get("text")
        if isinstance(text, str) and text.strip():
            return text.strip()

    raise RuntimeError("Gemini returned no structured text output.")


def analyze_with_gemini(request: AnalyzeRequest) -> tuple[str, int, str, List[LabelScore]]:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY or GOOGLE_API_KEY is not configured.")

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": build_classification_prompt(request),
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
            "responseJsonSchema": GEMINI_RISK_SCHEMA,
        },
    }

    encoded_payload = json.dumps(payload).encode("utf-8")
    request_url = f"{GEMINI_BASE_URL}/models/{GEMINI_MODEL_ID}:generateContent"
    http_request = Request(
        request_url,
        data=encoded_payload,
        method="POST",
        headers={
            "x-goog-api-key": GEMINI_API_KEY,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )

    try:
        with urlopen(http_request, timeout=GEMINI_TIMEOUT_SECONDS) as response:
            raw_body = response.read().decode("utf-8")
    except HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"Gemini API returned HTTP {exc.code}: {error_body}"
        ) from exc
    except URLError as exc:
        raise RuntimeError(f"Could not reach the Gemini API: {exc}") from exc

    response_body = json.loads(raw_body)
    structured_text = extract_gemini_output_text(response_body)
    assessment = parse_model_from_json(StructuredRiskAssessment, structured_text)
    labels = normalize_labels(list(assessment.labels), matched_phrases=[])
    risk_score = max(0, min(100, int(assessment.riskScore)))
    summary = truncate_text(normalize_whitespace(assessment.summary), 320)
    return GEMINI_MODEL_ID, risk_score, summary, labels


def analyze_with_huggingface(
    request: AnalyzeRequest,
) -> tuple[str, int, str, List[LabelScore]]:
    model_id, tokenizer, model, torch = load_huggingface_pipeline()
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
    raw_risk_score = int(round(risk_probability * 100))
    risk_score = calibrate_risk_score(raw_risk_score)
    summary = build_huggingface_summary(labels)
    return model_id, risk_score, summary, normalize_labels(labels, matched_phrases=[])


def analyze_submission(
    request: AnalyzeRequest,
) -> tuple[str, int, str, List[LabelScore], List[str]]:
    provider = active_provider()
    combined_text = f"{request.title}\n{request.content}"
    crisis_score_floor, matched_phrases = crisis_score_floor_for_text(combined_text)

    if provider == "gemini":
        model_id, risk_score, base_summary, labels = analyze_with_gemini(request)
    elif provider == "openai":
        model_id, risk_score, base_summary, labels = analyze_with_openai(request)
    else:
        model_id, risk_score, base_summary, labels = analyze_with_huggingface(request)

    adjusted_risk_score = max(risk_score, crisis_score_floor)
    adjusted_summary = finalize_summary(base_summary, adjusted_risk_score, matched_phrases)
    adjusted_labels = normalize_labels(labels, matched_phrases)
    return model_id, adjusted_risk_score, adjusted_summary, adjusted_labels, matched_phrases


@app.get("/health")
def health():
    try:
        provider = active_provider()
        if provider == "gemini":
            if not GEMINI_API_KEY:
                raise RuntimeError("GEMINI_API_KEY or GOOGLE_API_KEY is not configured.")
            return {
                "status": "ok",
                "provider": provider,
                "modelId": GEMINI_MODEL_ID,
            }
        if provider == "openai":
            if not OPENAI_API_KEY:
                raise RuntimeError("OPENAI_API_KEY is not configured.")
            return {
                "status": "ok",
                "provider": provider,
                "modelId": OPENAI_MODEL_ID,
            }

        model_id, _, _, _ = load_huggingface_pipeline()
        return {
            "status": "ok",
            "provider": provider,
            "modelId": model_id,
        }
    except Exception as exc:
        if GEMINI_API_KEY:
            provider = "gemini"
        elif OPENAI_API_KEY:
            provider = "openai"
        else:
            provider = "huggingface"
        fallback_model_id = (
            GEMINI_MODEL_ID if provider == "gemini" else (
                OPENAI_MODEL_ID if provider == "openai" else read_env(
                    "MENTALBERT_MODEL_ID",
                    default=DEFAULT_HUGGINGFACE_MODEL_ID,
                )
            )
        )
        return {
            "status": "error",
            "provider": provider,
            "modelId": fallback_model_id,
            "error": str(exc),
        }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        model_id, risk_score, summary, labels, _ = analyze_submission(request)
        risk_level = risk_level_for_score(risk_score)
        flagged_for_review = risk_level in {"HIGH", "CRITICAL"}
        effective_risk_probability = risk_score / 100.0
        sentiment_score = round(1.0 - (2.0 * effective_risk_probability), 4)

        return AnalyzeResponse(
            sentimentScore=max(-1.0, min(1.0, sentiment_score)),
            riskScore=risk_score,
            riskLevel=risk_level,
            flaggedForReview=flagged_for_review,
            summary=summary,
            modelId=model_id,
            labels=labels,
        )
    except Exception as exc:
        detail = str(exc)
        if "gated" in detail.lower() or "access" in detail.lower() or "401" in detail:
            detail = (
                "Failed to load the configured moderation model. "
                "For Hugging Face checkpoints, accept the model access conditions and/or set HF_TOKEN. "
                f"Original error: {exc}"
            )
        raise HTTPException(status_code=503, detail=detail) from exc
