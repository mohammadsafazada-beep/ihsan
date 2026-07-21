"use client";

import { Button } from "@/components/ui/button";
import { useDeleteMeal, useMeals } from "../api/meals.api";
import { SaveAsTemplateButton } from "./SaveAsTemplateButton";

export function MealsList({ date }: { date: string }) {
  const { data: meals, isLoading } = useMeals(date);
  const deleteMeal = useDeleteMeal(date);

  if (isLoading) return <p className="text-text-secondary">Loading meals...</p>;
  if (!meals || meals.length === 0) {
    return <p className="text-text-secondary">No meals logged yet today.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {meals.map((meal) => (
        <li
          key={meal.id}
          className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
        >
          <div>
            <p className="text-body font-medium">
              {meal.mealType}
              <span className="text-text-tertiary">
                {" "}
                · {meal.items.map((item) => item.label).join(", ")}
              </span>
            </p>
            <p className="text-caption text-text-secondary">
              {meal.macrosTotal.calories} kcal · {meal.macrosTotal.proteinGrams}g protein ·{" "}
              {meal.macrosTotal.carbsGrams}g carbs · {meal.macrosTotal.fatGrams}g fat
            </p>
          </div>
          <div className="flex items-center gap-1">
            <SaveAsTemplateButton
              mealId={meal.id}
              defaultName={meal.items.map((item) => item.label).join(" + ")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={deleteMeal.isPending}
              onClick={() => deleteMeal.mutate(meal.id)}
            >
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
