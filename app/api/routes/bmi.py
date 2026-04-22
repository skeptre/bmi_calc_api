from fastapi import APIRouter, HTTPException

from app.schemas.bmi import BMICalculateRequest, BMICalculateResponse
from app.services.bmi_service import calculate_bmi

router = APIRouter(prefix="/bmi", tags=["BMI"])


@router.post("/calculate", response_model=BMICalculateResponse)
def calculate_bmi_route(data: BMICalculateRequest):
    try:
        return calculate_bmi(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
