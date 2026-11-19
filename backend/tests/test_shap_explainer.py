"""
Unit tests for SHAP Explainability Service.
"""

import pytest
import numpy as np
import pandas as pd
from unittest.mock import MagicMock, patch

from app.services.shap_explainer import SHAPExplainer
from app.schemas import SHAPFactor


class TestSHAPFormatting:
    def test_format_feature_name_snake_case(self):
        assert SHAPExplainer._format_feature_name("attendance_rate") == "Attendance Rate"
        assert SHAPExplainer._format_feature_name("assignment_completion") == "Assignment Completion"

    def test_format_feature_name_custom_acronyms(self):
        assert SHAPExplainer._format_feature_name("gpa_score") == "GPA Score"
        assert SHAPExplainer._format_feature_name("lms_activity_count") == "LMS Activity Count"
        assert SHAPExplainer._format_feature_name("student_api_rate") == "Student API Rate"


class TestSHAPExplainerBasics:
    def test_uninitialized_explainer_behavior(self):
        explainer = SHAPExplainer(model=None)
        assert explainer.explainer is None

        # explain() returns empty list safely
        X = pd.DataFrame({"attendance": [85.0]})
        factors = explainer.explain(X)
        assert factors == []

        # get_global_feature_importance returns empty dict
        importance = explainer.get_global_feature_importance()
        assert importance == {}

    def test_global_feature_importance_with_mock_model(self):
        mock_model = MagicMock(spec=['feature_importances_', 'feature_names_in_'])
        mock_model.feature_importances_ = np.array([0.5, 0.3, 0.2])
        mock_model.feature_names_in_ = np.array(["gpa_trend", "attendance_rate", "lms_logins"])

        explainer = SHAPExplainer(model=mock_model)
        importance = explainer.get_global_feature_importance()

        assert "GPA Trend" in importance
        assert "Attendance Rate" in importance
        assert "LMS Logins" in importance
        assert importance["GPA Trend"] == 0.5
        assert importance["Attendance Rate"] == 0.3
        assert importance["LMS Logins"] == 0.2


class TestSHAPExplainPredictions:
    def test_explain_generates_sorted_shap_factors(self):
        mock_model = MagicMock(spec=['feature_importances_', 'feature_names_in_'])
        explainer = SHAPExplainer(model=mock_model)

        # Mock TreeExplainer instance
        mock_tree_explainer = MagicMock()
        # Single output with 3 feature impacts: attendance (0.8), gpa (-0.4), logins (0.1)
        mock_tree_explainer.shap_values.return_value = np.array([[0.8, -0.4, 0.1]])
        explainer.explainer = mock_tree_explainer

        X = pd.DataFrame({
            "attendance_rate": [70.0],
            "gpa_score": [3.2],
            "lms_logins": [15]
        })

        factors = explainer.explain(X, top_n=2)

        assert len(factors) == 2
        assert isinstance(factors[0], SHAPFactor)

        # Top 1 by absolute impact should be Attendance Rate (0.8)
        assert factors[0].feature == "Attendance Rate"
        assert factors[0].impact == 0.8
        assert factors[0].direction == "positive"

        # Top 2 by absolute impact should be GPA Score (-0.4)
        assert factors[1].feature == "GPA Score"
        assert factors[1].impact == 0.4
        assert factors[1].direction == "negative"
