import { z } from "zod";
import { macrosSchema } from "./nutrition/recipe.schema";
import { mealSchema } from "./nutrition/meal.schema";
import { habitSchema } from "./habits/habit.schema";
import { workoutDaySchema } from "./training/program.schema";

export const dashboardSchema = z.object({
  today: z.object({
    date: z.string(),
    workoutDay: workoutDaySchema.nullable(),
    meals: z.array(mealSchema),
    habits: z.array(habitSchema),
  }),
  nutrition: z.object({
    caloriesRemaining: z.number(),
    proteinRemainingGrams: z.number(),
    consumed: macrosSchema,
    target: macrosSchema,
  }),
  weight: z.object({
    current: z.number().nullable(),
    goal: z.number().nullable(),
    unit: z.enum(["KG", "LB"]),
    projectedGoalDate: z.string().nullable(),
  }),
  weeklyProgress: z.object({
    workoutsCompleted: z.number(),
    workoutsPlanned: z.number(),
    avgCalories: z.number().nullable(),
    habitCompletionPercent: z.number(),
  }),
});
export type Dashboard = z.infer<typeof dashboardSchema>;
