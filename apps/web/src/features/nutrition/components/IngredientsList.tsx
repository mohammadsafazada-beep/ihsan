"use client";

import { Button } from "@/components/ui/button";
import { useDeleteIngredient, useIngredients } from "../api/ingredients.api";

export function IngredientsList() {
  const { data: ingredients, isLoading } = useIngredients();
  const deleteIngredient = useDeleteIngredient();

  if (isLoading) return <p className="text-text-secondary">Loading ingredients...</p>;
  if (!ingredients || ingredients.length === 0) {
    return <p className="text-text-secondary">No ingredients yet — add your first one above.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {ingredients.map((ingredient) => (
        <li
          key={ingredient.id}
          className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
        >
          <div>
            <p className="text-body font-medium">{ingredient.name}</p>
            <p className="text-caption text-text-secondary">
              {ingredient.caloriesPer100g} kcal · {ingredient.proteinPer100g}g protein ·{" "}
              {ingredient.carbsPer100g}g carbs · {ingredient.fatPer100g}g fat (per 100g)
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={deleteIngredient.isPending}
            onClick={() => deleteIngredient.mutate(ingredient.id)}
          >
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
}
