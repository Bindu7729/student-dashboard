from app.services.risk_explainer_utils import rank_top_risk_contributors


def test_rank_top_risk_contributors_sorts_by_magnitude():
    features = {
        "unexcused_absences": 5.0,
        "gpa_drop": 0.8,
        "failed_midterms": 2.0
    }
    weights = {
        "unexcused_absences": 2.5,
        "gpa_drop": 5.0,
        "failed_midterms": 8.0
    }

    top = rank_top_risk_contributors(features, weights, top_n=2)
    assert len(top) == 2
    assert top[0][0] == "failed_midterms"  # 2.0 * 8.0 = 16.0
    assert top[1][0] == "unexcused_absences"  # 5.0 * 2.5 = 12.5
