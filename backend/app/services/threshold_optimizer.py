"""
Classification Decision Threshold Optimizer for Student Dropout Predictions.
"""
from typing import List, Dict, Any
from app.services.eval_metrics import compute_binary_classification_metrics


def find_optimal_classification_threshold(y_true: List[int], y_scores: List[float], steps: int = 20) -> Dict[str, Any]:
    if not y_true or not y_scores or len(y_true) != len(y_scores):
        return {"optimal_threshold": 0.5, "best_f1": 0.0}

    best_threshold = 0.5
    best_f1 = -1.0

    for i in range(1, steps):
        t = round(i / steps, 2)
        y_pred = [1 if score >= t else 0 for score in y_scores]
        metrics = compute_binary_classification_metrics(y_true, y_pred)
        if metrics["f1"] > best_f1:
            best_f1 = metrics["f1"]
            best_threshold = t

    return {
        "optimal_threshold": best_threshold,
        "best_f1": best_f1
    }
