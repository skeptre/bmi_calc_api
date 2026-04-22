import pytest

from app.services.bmi_service import (
    calculate_metric_bmi,
    calculate_imperial_bmi,
    classify_bmi,
    calculate_bmi,
)
from app.schemas.bmi import MetricBMICalculateRequest, ImperialBMICalculateRequest


def test_calculate_metric_bmi():
    bmi = calculate_metric_bmi(180, 75)
    assert round(bmi, 2) == round(75 / ((180 / 100) ** 2), 2)


def test_calculate_metric_bmi_zero_height():
    with pytest.raises(ValueError):
        calculate_metric_bmi(0, 70)


def test_calculate_imperial_bmi():
    bmi = calculate_imperial_bmi(5, 7, 154)  # 5ft 7in = 67 inches
    assert round(bmi, 2) == round((154 / (67 ** 2)) * 703, 2)


def test_calculate_imperial_zero_height():
    with pytest.raises(ValueError):
        calculate_imperial_bmi(0, 0, 150)


def test_classify_bmi():
    assert classify_bmi(17.0) == "Underweight"
    assert classify_bmi(22.0) == "Normal weight"
    assert classify_bmi(27.0) == "Overweight"
    assert classify_bmi(31.0) == "Obese"


def test_calculate_bmi_metric_request():
    req = MetricBMICalculateRequest(unit_system="metric", height_cm=170, weight_kg=70)
    res = calculate_bmi(req)
    assert isinstance(res.bmi, float)
    assert isinstance(res.classification, str)


def test_calculate_bmi_imperial_request():
    req = ImperialBMICalculateRequest(
        unit_system="imperial", height_ft=5, height_in=7, weight_lb=154
    )
    res = calculate_bmi(req)
    assert isinstance(res.bmi, float)
    assert isinstance(res.classification, str)
