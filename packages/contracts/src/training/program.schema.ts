import { z } from "zod";

const prescribedExerciseInputSchema = z.object({
  exerciseId: z.string(),
  order: z.number().int().nonnegative(),
  targetSets: z.number().int().positive(),
  targetRepsMin: z.number().int().positive(),
  targetRepsMax: z.number().int().positive(),
  restSeconds: z.number().int().positive().optional(),
});

const workoutDayInputSchema = z.object({
  name: z.string().min(1).max(120),
  dayOrder: z.number().int().nonnegative(),
  exercises: z.array(prescribedExerciseInputSchema).min(1),
});

export const createProgramSchema = z.object({
  name: z.string().min(1).max(120),
  days: z.array(workoutDayInputSchema).min(1),
});
export type CreateProgramInput = z.infer<typeof createProgramSchema>;

export const updateProgramSchema = createProgramSchema.partial();
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;

export const workoutDaySchema = workoutDayInputSchema.extend({
  id: z.string(),
  exercises: z.array(
    prescribedExerciseInputSchema.extend({ id: z.string(), exerciseName: z.string() }),
  ),
});
export type WorkoutDay = z.infer<typeof workoutDaySchema>;

export const programSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  days: z.array(workoutDaySchema),
  createdAt: z.string().datetime(),
});
export type Program = z.infer<typeof programSchema>;

export const nextSuggestionSchema = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(),
  suggestedWeightKg: z.number().nullable(),
  reason: z.string(),
});
export type NextSuggestion = z.infer<typeof nextSuggestionSchema>;
