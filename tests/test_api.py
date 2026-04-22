from fastapi.testclient import TestClient
from app.main import app
from typing import TypedDict


class BMIRequestDict(TypedDict, total=False):
    unit_system: str
    height_cm: float
    height_ft: float
    height_in: float
    weight_kg: float
    weight_lb: float


client = TestClient(app)


def test_post_metric_bmi():
    payload: BMIRequestDict = {"unit_system": "metric", "height_cm": 180, "weight_kg": 75}
    r = client.post("/bmi/calculate", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "bmi" in data and "classification" in data


def test_post_imperial_bmi():
    payload: BMIRequestDict = {"unit_system": "imperial", "height_ft": 5, "height_in": 7, "weight_lb": 154}
    r = client.post("/bmi/calculate", json=payload)
    assert r.status_code == 200


def test_post_invalid_metric_payload():
    # height_cm = 0 violates the pydantic gt=0 constraint -> 422
    payload: BMIRequestDict = {"unit_system": "metric", "height_cm": 0, "weight_kg": 70}
    r = client.post("/bmi/calculate", json=payload)
    assert r.status_code == 422
