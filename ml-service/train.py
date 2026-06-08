from __future__ import annotations

import argparse
import inspect
import json
import random
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

MISSING_DEPENDENCY: Optional[ModuleNotFoundError] = None

try:
    import numpy as np
    from datasets import Dataset, concatenate_datasets, load_dataset
    from sklearn.metrics import accuracy_score, precision_recall_fscore_support
    from sklearn.model_selection import train_test_split
    from transformers import (
        AutoModelForSequenceClassification,
        AutoTokenizer,
        DataCollatorWithPadding,
        Trainer,
        TrainingArguments,
    )
except ModuleNotFoundError as exc:
    MISSING_DEPENDENCY = exc


SERVICE_DIR = Path(__file__).resolve().parent
DEFAULT_MODEL_DIR = SERVICE_DIR
DEFAULT_OUTPUT_DIR = SERVICE_DIR / "models" / "mental-bert-diploma"

ID2LABEL = {0: "no_distress", 1: "distress"}
LABEL2ID = {"no_distress": 0, "distress": 1}

NEGATIVE_LABELS = {
    "",
    "0",
    "false",
    "normal",
    "control",
    "none",
    "non suicide",
    "non suicidal",
    "non-suicide",
    "no suicide",
    "no suicidal",
    "no depression",
    "not depressed",
    "non depression",
}

POSITIVE_LABELS = {
    "1",
    "true",
    "suicide",
    "suicidal",
    "suicidal ideation",
    "depression",
    "depressed",
    "anxiety",
    "distress",
    "stress",
    "addiction",
    "eating disorder",
    "eating_disorder",
    "alert ongoing",
    "confirm sha ongoing",
    "confirm suicide ongoing",
}


@dataclass(frozen=True)
class DatasetSpec:
    name: str
    repo_id: str
    text_columns: Sequence[str]
    label_columns: Sequence[str]
    split: str = "train"
    data_files: Optional[Dict[str, str]] = None
    positive_only: bool = False


DEFAULT_DATASETS: List[DatasetSpec] = [
    DatasetSpec(
        name="suicide_prediction_phr",
        repo_id="rlandismd/suicide_prediction_dataset_phr",
        text_columns=("text",),
        label_columns=("label",),
    ),
    DatasetSpec(
        name="depression_detection",
        repo_id="thePixel42/depression-detection",
        text_columns=("text",),
        label_columns=("label",),
    ),
    DatasetSpec(
        name="mental_health_4class",
        repo_id="ourafla/Mental-Health_Text-Classification_Dataset",
        data_files={"train": "mental_heath_unbanlanced.csv"},
        text_columns=("text",),
        label_columns=("status",),
    ),
    DatasetSpec(
        name="mental_health_posts_positive",
        repo_id="Noobie314/mental-health-posts-dataset",
        data_files={"train": "trainingData/final_sampled_dataset.csv"},
        text_columns=("posts", "text"),
        label_columns=("main_label", "label"),
        positive_only=True,
    ),
]

OPTIONAL_DATASETS: Dict[str, DatasetSpec] = {
    "cradle_dialogue": DatasetSpec(
        name="cradle_dialogue",
        repo_id="SungJoo/Cradle-Dialogue",
        text_columns=("text",),
        label_columns=("labels",),
    )
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Fine-tune the local Mental_BERT checkpoint for binary mental-health "
            "distress/risk classification using public Hugging Face datasets."
        )
    )
    parser.add_argument("--model-dir", type=Path, default=DEFAULT_MODEL_DIR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--include-cradle-dialogue", action="store_true")
    parser.add_argument("--max-samples-per-source", type=int, default=75000)
    parser.add_argument("--max-samples-per-label", type=int, default=120000)
    parser.add_argument("--min-words", type=int, default=4)
    parser.add_argument("--max-chars", type=int, default=12000)
    parser.add_argument("--validation-size", type=float, default=0.1)
    parser.add_argument("--test-size", type=float, default=0.1)
    parser.add_argument("--max-length", type=int, default=256)
    parser.add_argument("--epochs", type=float, default=2.0)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--eval-batch-size", type=int, default=16)
    parser.add_argument("--gradient-accumulation-steps", type=int, default=2)
    parser.add_argument("--learning-rate", type=float, default=2e-5)
    parser.add_argument("--weight-decay", type=float, default=0.01)
    parser.add_argument("--warmup-ratio", type=float, default=0.06)
    parser.add_argument("--logging-steps", type=int, default=50)
    parser.add_argument("--eval-steps", type=int, default=500)
    parser.add_argument("--save-steps", type=int, default=500)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--fp16", action="store_true")
    parser.add_argument("--balance-classes", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--skip-failed-sources", action=argparse.BooleanOptionalAction, default=True)
    return parser.parse_args()


def normalize_label_text(value: Any) -> str:
    text = str(value).strip().lower()
    text = text.replace("_", " ").replace("-", " ")
    text = re.sub(r"\s+", " ", text)
    return text


def to_binary_label(raw_label: Any, positive_only: bool) -> Optional[int]:
    if raw_label is None:
        return 1 if positive_only else None
    if isinstance(raw_label, bool):
        return int(raw_label)
    if isinstance(raw_label, (int, np.integer)):
        return 1 if int(raw_label) == 1 else 0 if int(raw_label) == 0 else None
    if isinstance(raw_label, float):
        return 1 if raw_label == 1.0 else 0 if raw_label == 0.0 else None

    label = normalize_label_text(raw_label)
    if label in NEGATIVE_LABELS:
        return 0
    if label in POSITIVE_LABELS:
        return 1
    if label.startswith("no ") or label.startswith("non "):
        return 0
    if "suicid" in label or "depress" in label or "anxiety" in label:
        return 1
    if "alert" in label or "confirm" in label or "crisis" in label:
        return 1
    if positive_only:
        return 1
    return None


def first_existing(row: Dict[str, Any], columns: Sequence[str]) -> Any:
    for column in columns:
        if column in row and row[column] is not None:
            return row[column]
    return None


def clean_text(value: Any) -> str:
    text = "" if value is None else str(value)
    return re.sub(r"\s+", " ", text).strip()


def source_to_dataset(
    spec: DatasetSpec,
    args: argparse.Namespace,
) -> Dataset:
    print(f"Loading {spec.name} from {spec.repo_id}")
    raw = load_dataset(
        spec.repo_id,
        data_files=spec.data_files,
        split=spec.split,
    )
    if args.max_samples_per_source and len(raw) > args.max_samples_per_source:
        raw = raw.shuffle(seed=args.seed).select(range(args.max_samples_per_source))

    texts: List[str] = []
    labels: List[int] = []
    sources: List[str] = []
    skipped = 0

    for row in raw:
        text = clean_text(first_existing(row, spec.text_columns))
        label = to_binary_label(first_existing(row, spec.label_columns), spec.positive_only)
        if label is None:
            skipped += 1
            continue
        if len(text.split()) < args.min_words or len(text) > args.max_chars:
            skipped += 1
            continue
        texts.append(text)
        labels.append(label)
        sources.append(spec.name)

    print(
        f"  kept {len(texts):,} rows from {spec.name}; skipped {skipped:,}; "
        f"positive={sum(labels):,}, negative={len(labels) - sum(labels):,}"
    )
    if not texts:
        raise RuntimeError(f"No usable rows loaded from {spec.name}")
    return Dataset.from_dict({"text": texts, "label": labels, "source": sources})


def load_training_corpus(args: argparse.Namespace) -> Dataset:
    specs = list(DEFAULT_DATASETS)
    if args.include_cradle_dialogue:
        specs.append(OPTIONAL_DATASETS["cradle_dialogue"])

    loaded: List[Dataset] = []
    failures: List[str] = []
    for spec in specs:
        try:
            loaded.append(source_to_dataset(spec, args))
        except Exception as exc:
            message = f"{spec.name}: {exc}"
            if not args.skip_failed_sources:
                raise RuntimeError(message) from exc
            print(f"Skipping failed source: {message}")
            failures.append(message)

    if not loaded:
        raise RuntimeError("No datasets could be loaded.")

    combined = concatenate_datasets(loaded).shuffle(seed=args.seed)
    combined = deduplicate(combined)
    combined = balance_dataset(combined, args)
    print_dataset_summary(combined, "combined")
    if failures:
        print("Failed sources were skipped:")
        for failure in failures:
            print(f"  - {failure}")
    return combined


def deduplicate(dataset: Dataset) -> Dataset:
    seen = set()
    keep_indices: List[int] = []
    for index, text in enumerate(dataset["text"]):
        key = re.sub(r"\s+", " ", text.lower()).strip()
        if key in seen:
            continue
        seen.add(key)
        keep_indices.append(index)
    removed = len(dataset) - len(keep_indices)
    if removed:
        print(f"Removed {removed:,} duplicate texts")
    return dataset.select(keep_indices)


def balance_dataset(dataset: Dataset, args: argparse.Namespace) -> Dataset:
    label_to_indices = {0: [], 1: []}
    for index, label in enumerate(dataset["label"]):
        label_to_indices[int(label)].append(index)

    if not all(label_to_indices.values()):
        raise RuntimeError("Both negative and positive classes are required for training.")

    rng = random.Random(args.seed)
    selected: List[int] = []
    if args.balance_classes:
        target = min(len(indices) for indices in label_to_indices.values())
        if args.max_samples_per_label:
            target = min(target, args.max_samples_per_label)
        for indices in label_to_indices.values():
            selected.extend(rng.sample(indices, target))
    else:
        for indices in label_to_indices.values():
            if args.max_samples_per_label and len(indices) > args.max_samples_per_label:
                selected.extend(rng.sample(indices, args.max_samples_per_label))
            else:
                selected.extend(indices)

    rng.shuffle(selected)
    return dataset.select(selected)


def split_dataset(dataset: Dataset, args: argparse.Namespace) -> Dict[str, Dataset]:
    indices = list(range(len(dataset)))
    labels = dataset["label"]
    heldout_size = args.validation_size + args.test_size
    if heldout_size <= 0 or heldout_size >= 1:
        raise ValueError("validation-size + test-size must be between 0 and 1.")

    train_idx, heldout_idx = train_test_split(
        indices,
        test_size=heldout_size,
        random_state=args.seed,
        stratify=labels,
    )

    if args.test_size > 0:
        relative_test_size = args.test_size / heldout_size
        validation_idx, test_idx = train_test_split(
            heldout_idx,
            test_size=relative_test_size,
            random_state=args.seed,
            stratify=[labels[index] for index in heldout_idx],
        )
    else:
        validation_idx = heldout_idx
        test_idx = []

    split = {
        "train": dataset.select(train_idx),
        "validation": dataset.select(validation_idx),
    }
    if test_idx:
        split["test"] = dataset.select(test_idx)

    for name, subset in split.items():
        print_dataset_summary(subset, name)
    return split


def print_dataset_summary(dataset: Dataset, name: str) -> None:
    labels = [int(label) for label in dataset["label"]]
    positives = sum(labels)
    negatives = len(labels) - positives
    print(f"{name}: {len(dataset):,} rows; positive={positives:,}; negative={negatives:,}")


def tokenize_splits(
    splits: Dict[str, Dataset],
    tokenizer: AutoTokenizer,
    max_length: int,
) -> Dict[str, Dataset]:
    def tokenize_batch(batch: Dict[str, List[Any]]) -> Dict[str, Any]:
        tokenized = tokenizer(
            batch["text"],
            truncation=True,
            max_length=max_length,
        )
        tokenized["labels"] = batch["label"]
        return tokenized

    tokenized = {}
    for name, dataset in splits.items():
        tokenized[name] = dataset.map(
            tokenize_batch,
            batched=True,
            remove_columns=dataset.column_names,
            desc=f"Tokenizing {name}",
        )
    return tokenized


def compute_metrics(eval_pred: Any) -> Dict[str, float]:
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels,
        predictions,
        average="binary",
        zero_division=0,
    )
    _, _, macro_f1, _ = precision_recall_fscore_support(
        labels,
        predictions,
        average="macro",
        zero_division=0,
    )
    return {
        "accuracy": float(accuracy_score(labels, predictions)),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "macro_f1": float(macro_f1),
    }


def build_training_args(args: argparse.Namespace) -> TrainingArguments:
    kwargs: Dict[str, Any] = {
        "output_dir": str(args.output_dir),
        "learning_rate": args.learning_rate,
        "per_device_train_batch_size": args.batch_size,
        "per_device_eval_batch_size": args.eval_batch_size,
        "gradient_accumulation_steps": args.gradient_accumulation_steps,
        "num_train_epochs": args.epochs,
        "weight_decay": args.weight_decay,
        "warmup_ratio": args.warmup_ratio,
        "logging_steps": args.logging_steps,
        "save_steps": args.save_steps,
        "eval_steps": args.eval_steps,
        "save_total_limit": 2,
        "load_best_model_at_end": True,
        "metric_for_best_model": "f1",
        "greater_is_better": True,
        "report_to": "none",
        "seed": args.seed,
        "fp16": args.fp16,
    }

    signature = inspect.signature(TrainingArguments.__init__)
    if "eval_strategy" in signature.parameters:
        kwargs["eval_strategy"] = "steps"
    else:
        kwargs["evaluation_strategy"] = "steps"
    kwargs["save_strategy"] = "steps"
    return TrainingArguments(**kwargs)


def write_report(
    args: argparse.Namespace,
    split_sizes: Dict[str, int],
    eval_metrics: Dict[str, float],
    test_metrics: Optional[Dict[str, float]],
) -> None:
    args.output_dir.mkdir(parents=True, exist_ok=True)
    report = {
        "model_dir": str(args.model_dir.resolve()),
        "output_dir": str(args.output_dir.resolve()),
        "labels": ID2LABEL,
        "split_sizes": split_sizes,
        "eval_metrics": eval_metrics,
        "test_metrics": test_metrics,
        "default_sources": [spec.repo_id for spec in DEFAULT_DATASETS],
        "included_cradle_dialogue": args.include_cradle_dialogue,
    }
    report_path = args.output_dir / "training_report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Wrote training report to {report_path}")


def main() -> None:
    args = parse_args()
    if MISSING_DEPENDENCY is not None:
        raise SystemExit(
            "Missing training dependency. Run `pip install -r requirements.txt` "
            f"from the ml-service folder first. Original error: {MISSING_DEPENDENCY}"
        )

    args.model_dir = args.model_dir.resolve()
    args.output_dir = args.output_dir.resolve()

    random.seed(args.seed)
    np.random.seed(args.seed)

    corpus = load_training_corpus(args)
    splits = split_dataset(corpus, args)

    tokenizer = AutoTokenizer.from_pretrained(args.model_dir, local_files_only=True)
    model = AutoModelForSequenceClassification.from_pretrained(
        args.model_dir,
        num_labels=2,
        id2label=ID2LABEL,
        label2id=LABEL2ID,
        ignore_mismatched_sizes=True,
        local_files_only=True,
    )
    model.config.id2label = ID2LABEL
    model.config.label2id = LABEL2ID

    tokenized = tokenize_splits(splits, tokenizer, args.max_length)
    trainer = Trainer(
        model=model,
        args=build_training_args(args),
        train_dataset=tokenized["train"],
        eval_dataset=tokenized["validation"],
        tokenizer=tokenizer,
        data_collator=DataCollatorWithPadding(tokenizer),
        compute_metrics=compute_metrics,
    )

    trainer.train()
    eval_metrics = trainer.evaluate(tokenized["validation"])
    test_metrics = trainer.evaluate(tokenized["test"], metric_key_prefix="test") if "test" in tokenized else None

    trainer.save_model(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)
    write_report(
        args=args,
        split_sizes={name: len(dataset) for name, dataset in splits.items()},
        eval_metrics={key: float(value) for key, value in eval_metrics.items()},
        test_metrics={key: float(value) for key, value in test_metrics.items()} if test_metrics else None,
    )

    print(f"Training complete. Fine-tuned model saved to {args.output_dir}")


if __name__ == "__main__":
    main()
