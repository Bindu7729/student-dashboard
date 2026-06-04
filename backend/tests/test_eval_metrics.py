from app.services.eval_metrics import compute_binary_classification_metrics


def test_compute_binary_classification_metrics_standard():
    y_true = [1, 1, 0, 0, 1, 0]
    y_pred = [1, 0, 0, 0, 1, 1]

    metrics = compute_binary_classification_metrics(y_true, y_pred)
    assert metrics["tp"] == 2
    assert metrics["fp"] == 1
    assert metrics["tn"] == 2
    assert metrics["fn"] == 1
    assert metrics["accuracy"] == round(4 / 6, 4)
    assert metrics["precision"] == round(2 / 3, 4)
    assert metrics["recall"] == round(2 / 3, 4)
    assert metrics["f1"] == round(2 / 3, 4)


def test_compute_binary_classification_metrics_empty():
    metrics = compute_binary_classification_metrics([], [])
    assert metrics["accuracy"] == 0.0
    assert metrics["f1"] == 0.0
