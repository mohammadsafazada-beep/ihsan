"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MealType } from "@ihsan/contracts";
import { useIngredients } from "../api/ingredients.api";
import { useRecipes } from "../api/recipes.api";
import { useLogMeal } from "../api/meals.api";

const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export function LogMealForm({ date }: { date: string }) {
  const { data: recipes } = useRecipes();
  const { data: ingredients } = useIngredients();
  const logMeal = useLogMeal(date);

  const [mealType, setMealType] = useState<MealType>("BREAKFAST");
  const [sourceKind, setSourceKind] = useState<"recipe" | "ingredient">("recipe");
  const [foodId, setFoodId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const foodOptions = sourceKind === "recipe" ? recipes : ingredients;
  const quantityLabel = sourceKind === "recipe" ? "Servings" : "Grams";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!foodId || !quantity) return;

    logMeal.mutate(
      {
        date,
        mealType,
        items: [
          {
            quantity: Number(quantity),
            ...(sourceKind === "recipe" ? { recipeId: foodId } : { ingredientId: foodId }),
          },
        ],
      },
      {
        onSuccess: () => {
          setFoodId("");
          setQuantity("");
        },
      },
    );
  }

  return (
    <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label>Meal</Label>
        <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEAL_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>From</Label>
        <Select
          value={sourceKind}
          onValueChange={(v) => {
            setSourceKind(v as "recipe" | "ingredient");
            setFoodId("");
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recipe">Recipe</SelectItem>
            <SelectItem value="ingredient">Ingredient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{sourceKind === "recipe" ? "Recipe" : "Ingredient"}</Label>
        <Select value={foodId} onValueChange={setFoodId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            {foodOptions?.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{quantityLabel}</Label>
        <Input
          type="number"
          min={0}
          step="0.1"
          className="w-24"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={logMeal.isPending || !foodId || !quantity}>
        {logMeal.isPending ? "Logging..." : "Log meal"}
      </Button>
    </form>
  );
}
