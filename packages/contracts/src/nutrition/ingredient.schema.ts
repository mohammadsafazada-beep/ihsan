import { z } from "zod";

export const createIngredientSchema = z.object({
  name: z.string().min(1).max(120),
  caloriesPer100g: z.number().nonnegative(),
  proteinPer100g: z.number().nonnegative(),
  carbsPer100g: z.number().nonnegative(),
  fatPer100g: z.number().nonnegative(),
});
export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;

export const updateIngredientSchema = createIngredientSchema.partial();
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;

export const ingredientSchema = createIngredientSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
});
export type Ingredient = z.infer<typeof ingredientSchema>;
