import { z } from "zod";

export const createExerciseSchema = z.object({
  name: z.string().min(1).max(120),
  muscleGroup: z.string().min(1).max(60),
  equipment: z.string().max(60).optional(),
});
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;

export const exerciseSchema = createExerciseSchema.extend({
  id: z.string(),
  userId: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type Exercise = z.infer<typeof exerciseSchema>;
