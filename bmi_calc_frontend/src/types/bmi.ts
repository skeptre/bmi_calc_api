export type MetricBMICalculateRequest = {
    unit_system: "metric";
    height_cm: number;
    weight_kg: number;
};

export type ImperialBMICalculateRequest = {
    unit_system: "imperial";
    height_ft: number;
    height_in: number;
    weight_lb: number;
};

export type BMICalculateRequest = MetricBMICalculateRequest | ImperialBMICalculateRequest;

export type BMICalculateResponse = {
    bmi: number;
    classification: string;
};