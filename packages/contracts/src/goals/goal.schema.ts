import { z } from "zod";
import { calendarDateSchema } from "../common/date.schema";

export const goalTypeSchema = z.enum(["WEIGHT", "BODY_FAT_PERCENT"]);
export type GoalType = z.infer<typeof goalTypeSchema>;

export const goalStatusSchema = z.enum(["ACTIVE", "ACHIEVED", "ABANDONED"]);
export type GoalStatus = z.infer<typeof goalStatusSchema>;

export const createGoalSchema = z.object({
  type: goalTypeSchema,
  startValue: z.number(),
  targetValue: z.number(),
  startDate: calendarDateSchema,
  targetDate: calendarDateSchema.optional(),
});
export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = z.object({
  targetValue: z.number().optional(),
  targetDate: calendarDateSchema.optional(),
  status: goalStatusSchema.optional(),
});
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export const goalSchema = createGoalSchema.extend({
  id: z.string(),
  userId: z.string(),
  status: goalStatusSchema,
  createdAt: z.string().datetime(),
});
export type Goal = z.infer<typeof goalSchema>;
