import { z } from "zod";
import { calendarDateSchema } from "../common/date.schema";

export const createHabitSchema = z.object({
  name: z.string().min(1).max(120),
});
export type CreateHabitInput = z.infer<typeof createHabitSchema>;

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;

export const logHabitSchema = z.object({
  date: calendarDateSchema,
  completed: z.boolean().default(true),
});
export type LogHabitInput = z.infer<typeof logHabitSchema>;

export const habitSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  completedToday: z.boolean(),
  currentStreak: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});
export type Habit = z.infer<typeof habitSchema>;
