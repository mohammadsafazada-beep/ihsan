import { z } from "zod";

export const logSetSchema = z.object({
  exerciseId: z.string(),
  setNumber: z.number().int().positive(),
  reps: z.number().int().positive(),
  weightKg: z.number().nonnegative(),
  rpe: z.number().min(1).max(10).optional(),
  isWarmup: z.boolean().default(false),
});
export type LogSetInput = z.infer<typeof logSetSchema>;

export const updateSetSchema = logSetSchema.partial();
export type UpdateSetInput = z.infer<typeof updateSetSchema>;

export const setLogSchema = logSetSchema.extend({
  id: z.string(),
  workoutSessionId: z.string(),
  createdAt: z.string().datetime(),
});
export type SetLog = z.infer<typeof setLogSchema>;

export const prTypeSchema = z.enum(["MAX_WEIGHT", "ESTIMATED_1RM", "MAX_VOLUME_SESSION"]);
export type PrType = z.infer<typeof prTypeSchema>;

export const personalRecordSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  type: prTypeSchema,
  value: z.number(),
  achievedAt: z.string().datetime(),
});
export type PersonalRecord = z.infer<typeof personalRecordSchema>;
