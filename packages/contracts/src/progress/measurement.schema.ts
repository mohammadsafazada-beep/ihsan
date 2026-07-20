import { z } from "zod";
import { calendarDateSchema } from "../common/date.schema";

export const logMeasurementSchema = z.object({
  date: calendarDateSchema,
  waistCm: z.number().positive().optional(),
  neckCm: z.number().positive().optional(),
  hipsCm: z.number().positive().optional(),
  chestCm: z.number().positive().optional(),
  armCm: z.number().positive().optional(),
  thighCm: z.number().positive().optional(),
  notes: z.string().max(1000).optional(),
});
export type LogMeasurementInput = z.infer<typeof logMeasurementSchema>;

export const measurementSchema = logMeasurementSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
});
export type Measurement = z.infer<typeof measurementSchema>;

export const bodyCompositionSchema = z.object({
  date: calendarDateSchema,
  estimatedBodyFatPercent: z.number().nullable(),
  estimatedLeanMassKg: z.number().nullable(),
});
export type BodyComposition = z.infer<typeof bodyCompositionSchema>;
