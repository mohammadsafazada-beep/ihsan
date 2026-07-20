import { z } from "zod";
import { calendarDateSchema } from "../common/date.schema";

export const setNutritionTargetSchema = z.object({
  calories: z.number().int().positive(),
  proteinGrams: z.number().int().nonnegative(),
  carbsGrams: z.number().int().nonnegative(),
  fatGrams: z.number().int().nonnegative(),
  effectiveFrom: calendarDateSchema,
});
export type SetNutritionTargetInput = z.infer<typeof setNutritionTargetSchema>;

export const nutritionSummarySchema = z.object({
  date: calendarDateSchema,
  target: z.object({
    calories: z.number(),
    proteinGrams: z.number(),
    carbsGrams: z.number(),
    fatGrams: z.number(),
  }),
  consumed: z.object({
    calories: z.number(),
    proteinGrams: z.number(),
    carbsGrams: z.number(),
    fatGrams: z.number(),
  }),
  remaining: z.object({
    calories: z.number(),
    proteinGrams: z.number(),
    carbsGrams: z.number(),
    fatGrams: z.number(),
  }),
});
export type NutritionSummary = z.infer<typeof nutritionSummarySchema>;
