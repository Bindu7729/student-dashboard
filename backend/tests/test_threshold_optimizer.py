from app.services.threshold_optimizer import find_optimal_classification_threshold


def test_find_optimal_classification_threshold_finds_peak_f1():
    y_true = [1, 1, 1, 0, 0, 0]
    y_scores = [0.85, 0.72, 0.60, 0.40, 0.20, 0.15]

    res = find_optimal_classification_threshold(y_true, y_scores)
    assert res["best_f1"] == 1.0
    assert 0.40 < res["optimal_threshold"] <= 0.60


def test_find_optimal_classification_threshold_empty():
    res = find_optimal_classification_threshold([], [])
    assert res["optimal_threshold"] == 0.5
    assert res["best_f1"] == 0.0
