import { z } from "zod";

export const weightUnitSchema = z.enum(["KG", "LB"]);
export type WeightUnit = z.infer<typeof weightUnitSchema>;

export const sexSchema = z.enum(["MALE", "FEMALE"]);
export type Sex = z.infer<typeof sexSchema>;

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  heightCm: z.number().positive().optional(),
  sex: sexSchema.optional(),
  weightUnit: weightUnitSchema.optional(),
});
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;

export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  heightCm: z.number().nullable(),
  sex: sexSchema.nullable(),
  weightUnit: weightUnitSchema,
});
export type User = z.infer<typeof userSchema>;
