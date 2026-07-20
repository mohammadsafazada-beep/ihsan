import { z } from "zod";
import { calendarDateSchema } from "../common/date.schema";

export const createSessionSchema = z.object({
  date: calendarDateSchema,
  programId: z.string().optional(),
  workoutDayId: z.string().optional(),
  notes: z.string().max(2000).optional(),
});
export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const updateSessionSchema = z.object({
  completedAt: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: calendarDateSchema,
  programId: z.string().nullable(),
  workoutDayId: z.string().nullable(),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type Session = z.infer<typeof sessionSchema>;
