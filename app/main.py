from fastapi import FastAPI, HTTPException
from app.schemas.bmi import BMICalculateRequest, BMICalculateResponse
from app.services.bmi_service import calculate_bmi

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "BMI API is running!"}


@app.post("/bmi/calculate", response_model=BMICalculateResponse)
def calculate_bmi_route(data: BMICalculateRequest):
    try:
        result = calculate_bmi(data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))