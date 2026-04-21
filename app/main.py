from fastapi import FastAPI
from app.api.routes.bmi import router as bmi_router

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "BMI API is running!"}


app.include_router(bmi_router))