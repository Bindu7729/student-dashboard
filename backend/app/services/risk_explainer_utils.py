"""
Risk Explainer Feature Importance Utilities.
"""
from typing import Dict, List, Tuple


def rank_top_risk_contributors(feature_values: Dict[str, float], weights: Dict[str, float], top_n: int = 3) -> List[Tuple[str, float]]:
    """
    Ranks features by absolute weighted contribution to risk score.
    """
    contributions = []
    for feat, val in feature_values.items():
        weight = weights.get(feat, 0.0)
        impact = round(val * weight, 4)
        contributions.append((feat, impact))

    contributions.sort(key=lambda x: abs(x[1]), reverse=True)
    return contributions[:top_n]
