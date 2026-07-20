import { z } from "zod";
import { calendarDateSchema } from "../common/date.schema";

export const logWeightSchema = z.object({
  date: calendarDateSchema,
  weightKg: z.number().positive(),
});
export type LogWeightInput = z.infer<typeof logWeightSchema>;

export const weightEntrySchema = logWeightSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
});
export type WeightEntry = z.infer<typeof weightEntrySchema>;
