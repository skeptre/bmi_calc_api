import type { BMICalculateRequest, BMICalculateResponse } from "../types/bmi";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function calculateBMI(payload: BMICalculateRequest): Promise<BMICalculateResponse> {
  const response = await fetch(`${API_BASE_URL}/bmi/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.detail ?? errorBody?.error ?? "Failed to calculate BMI";
    throw new Error(message);
  }

  return (await response.json()) as BMICalculateResponse;
}
