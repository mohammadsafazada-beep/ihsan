import { z } from "zod";

/** Calendar date, no time/timezone — "the day this happened". */
export const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const dateRangeQuerySchema = z.object({
  from: calendarDateSchema.optional(),
  to: calendarDateSchema.optional(),
});
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
