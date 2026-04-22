from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.bmi import router as bmi_router

app = FastAPI(
    title="BMI API", description="API for calculating Body Mass Index (BMI)", version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "BMI API is running!"}


app.include_router(bmi_router)
