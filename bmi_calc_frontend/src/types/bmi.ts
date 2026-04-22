import { z } from "zod";

export const MetricBMICalculateRequestSchema = z.object({
  unit_system: z.literal("metric"),
  height_cm: z.number().positive(),
  weight_kg: z.number().positive(),
});

export const ImperialBMICalculateRequestSchema = z.object({
  unit_system: z.literal("imperial"),
  height_ft: z.number().positive(),
  height_in: z.number().nonnegative(),
  weight_lb: z.number().positive(),
});

export const BMICalculateRequestSchema = z.union([
  MetricBMICalculateRequestSchema,
  ImperialBMICalculateRequestSchema,
]);

export type MetricBMICalculateRequest = z.infer<
  typeof MetricBMICalculateRequestSchema
>;

export type ImperialBMICalculateRequest = z.infer<
  typeof ImperialBMICalculateRequestSchema
>;

export type BMICalculateRequest = z.infer<typeof BMICalculateRequestSchema>;

export const BMICalculateResponseSchema = z.object({
  bmi: z.number(),
  classification: z.string(),
});

export type BMICalculateResponse = z.infer<
  typeof BMICalculateResponseSchema
>;