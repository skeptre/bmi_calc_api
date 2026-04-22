from app.schemas.bmi import (
    BMICalculateRequest,
    BMICalculateResponse,
)


def classify_bmi(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight"
    if bmi < 25:
        return "Normal weight"
    if bmi < 30:
        return "Overweight"
    return "Obese"


def calculate_metric_bmi(height_cm: float, weight_kg: float) -> float:
    height_m = height_cm / 100
    if height_m <= 0:
        raise ValueError("Height must be greater than zero")
    return weight_kg / (height_m**2)


def calculate_imperial_bmi(height_ft: float, height_in: float, weight_lb: float) -> float:
    total_inches = (height_ft * 12) + height_in
    if total_inches <= 0:
        raise ValueError("Height must be greater than zero")
    return (weight_lb / (total_inches**2)) * 703


def calculate_bmi(data: BMICalculateRequest) -> BMICalculateResponse:
    if data.unit_system == "metric":
        bmi = calculate_metric_bmi(data.height_cm, data.weight_kg)
    elif data.unit_system == "imperial":
        bmi = calculate_imperial_bmi(data.height_ft, data.height_in, data.weight_lb)
    else:
        raise ValueError("Invalid unit system")

    bmi = round(bmi, 2)
    classsification = classify_bmi(bmi)

    return BMICalculateResponse(bmi=bmi, classification=classsification)
