from pydantic import BaseModel, Field
from typing import Literal, Optional

class BMICalculateRequest(BaseModel):
    unit_system: Literal["metric", "imperial"]
    
    height_cm: Optional[float] = Field(default=None, gt= 0, description="Height in centimeters (required if unit_system is 'metric')")
    weight_kg: Optional[float] = Field(default=None, gt= 0, description="Weight in kilograms (required if unit_system is 'metric')")    

    height_ft: Optional[float] = Field(default=None, gt= 0, description="Height in feet (required if unit_system is 'imperial')")
    weight_lb: Optional[float] = Field(default=None, gt= 0, description="Weight in pounds (required if unit_system is 'imperial')")
    height_in: Optional[float] = Field(default=None, gt= 0, description="Height in inches (required if unit_system is 'imperial')")

class BMICalculateResponse(BaseModel):
    bmi: float
    classification: str