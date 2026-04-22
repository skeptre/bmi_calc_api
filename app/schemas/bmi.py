from typing import Literal, Union

from pydantic import BaseModel, Field


class MetricBMICalculateRequest(BaseModel):
    unit_system: Literal["metric"]
    height_cm: float = Field(gt=0, description="Height in centimeters")
    weight_kg: float = Field(gt=0, description="Weight in kilograms")


class ImperialBMICalculateRequest(BaseModel):
    unit_system: Literal["imperial"]
    height_ft: float = Field(gt=0, description="Height in feet")
    weight_lb: float = Field(gt=0, description="Weight in pounds")
    height_in: float = Field(ge=0, description="Height in inches")


class BMICalculateResponse(BaseModel):
    bmi: float
    classification: str


BMICalculateRequest = Union[MetricBMICalculateRequest, ImperialBMICalculateRequest]
