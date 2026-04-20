from app.schemas.bmi import BMICalculateRequest, BMICalculateResponse


def classify_bmi(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight"
    if bmi < 25:
        return "Normal weight"
    if bmi < 30:
        return "Overweight"
    return "Obese"


def calculate_bmi(data: BMICalculateRequest) -> BMICalculateResponse:
    if data.unit_system == "metric":
        if data.height_cm is None or data.weight_kg is None:
            raise ValueError("height_cm and weight_kg are required for metric units")

        height_m = data.height_cm / 100
        bmi = data.weight_kg / (height_m ** 2)

    else:
        if data.height_ft is None or data.height_in is None or data.weight_lb is None:
            raise ValueError("height_ft, height_in, and weight_lb are required for imperial units")

        total_inches = (data.height_ft * 12) + data.height_in
        bmi = (data.weight_lb / (total_inches ** 2)) * 703

    bmi = round(bmi, 2)
    classification = classify_bmi(bmi)

    return BMICalculateResponse(
        bmi=bmi,
        classification=classification,
    )