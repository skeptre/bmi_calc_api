import { useMemo, useState } from "react";
import { calculateBMI } from "./api/bmi";
import type {
  BMICalculateResponse,
  ImperialBMICalculateRequest,
  MetricBMICalculateRequest,
} from "./types/bmi";
import "./index.css";

type UnitSystem = "metric" | "imperial";

function getClassificationTone(classification: string): string {
  const normalized = classification.toLowerCase();

  if (normalized.includes("normal")) {
    return "result-card result-card--good";
  }

  if (normalized.includes("underweight")) {
    return "result-card result-card--info";
  }

  return "result-card result-card--warn";
}

export default function App() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLb, setWeightLb] = useState("");

  const [result, setResult] = useState<BMICalculateResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resultCardClassName = useMemo(() => {
    if (!result) {
      return "result-card";
    }

    return getClassificationTone(result.classification);
  }, [result]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      if (unitSystem === "metric") {
        const payload: MetricBMICalculateRequest = {
          unit_system: "metric",
          height_cm: Number(heightCm),
          weight_kg: Number(weightKg),
        };

        const data = await calculateBMI(payload);
        setResult(data);
      } else {
        const payload: ImperialBMICalculateRequest = {
          unit_system: "imperial",
          height_ft: Number(heightFt),
          height_in: Number(heightIn),
          weight_lb: Number(weightLb),
        };

        const data = await calculateBMI(payload);
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Minimal BMI Calculator</p>
          <h1>Check your BMI with a clean full-stack app.</h1>
          <p className="hero-text">
            Enter your measurements, send them to the FastAPI backend, and get a
            validated BMI result back instantly.
          </p>
        </div>

        <div className="hero-badge-grid">
          <div className="hero-badge">
            <span>Metric</span>
            <strong>cm / kg</strong>
          </div>
          <div className="hero-badge">
            <span>Imperial</span>
            <strong>ft / in / lb</strong>
          </div>
        </div>
      </section>

      <section className="app-grid">
        <div className="panel glass-panel">
          <div className="panel-header">
            <h2>Your measurements</h2>
            <p>Choose a unit system and fill in the form below.</p>
          </div>

          <form className="bmi-form" onSubmit={handleSubmit}>
            <div className="unit-toggle" role="tablist" aria-label="Unit system">
              <button
                type="button"
                className={unitSystem === "metric" ? "toggle-chip active" : "toggle-chip"}
                onClick={() => setUnitSystem("metric")}
              >
                Metric
              </button>
              <button
                type="button"
                className={unitSystem === "imperial" ? "toggle-chip active" : "toggle-chip"}
                onClick={() => setUnitSystem("imperial")}
              >
                Imperial
              </button>
            </div>

            {unitSystem === "metric" ? (
              <div className="field-grid">
                <label className="field">
                  <span>Height (cm)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    placeholder="e.g. 175"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    required
                  />
                </label>

                <label className="field">
                  <span>Weight (kg)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    placeholder="e.g. 72"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    required
                  />
                </label>
              </div>
            ) : (
              <div className="field-grid field-grid--triple">
                <label className="field">
                  <span>Height (ft)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="e.g. 5"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    required
                  />
                </label>

                <label className="field">
                  <span>Height (in)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="e.g. 11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    required
                  />
                </label>

                <label className="field">
                  <span>Weight (lb)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    placeholder="e.g. 165"
                    value={weightLb}
                    onChange={(e) => setWeightLb(e.target.value)}
                    required
                  />
                </label>
              </div>
            )}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Calculating..." : "Calculate BMI"}
            </button>
          </form>
        </div>

        <aside className="panel glass-panel result-panel">
          <div className="panel-header">
            <h2>Result</h2>
            <p>Your backend response will appear here.</p>
          </div>

          {error ? (
            <div className="error-card" role="alert">
              <strong>Could not calculate BMI</strong>
              <p>{error}</p>
            </div>
          ) : result ? (
            <div className={resultCardClassName}>
              <p className="result-label">BMI Score</p>
              <h3>{result.bmi}</h3>
              <p className="result-classification">{result.classification}</p>
            </div>
          ) : (
            <div className="empty-state">
              <p>Submit the form to see your BMI and health classification.</p>
            </div>
          )}

          <div className="info-card">
            <h3>How this app works</h3>
            <ul>
              <li>React collects the form input.</li>
              <li>The frontend sends a typed request to FastAPI.</li>
              <li>The backend validates and calculates your BMI.</li>
              <li>The response is validated again in the frontend.</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}