"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIngredientSchema, type CreateIngredientInput } from "@ihsan/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateIngredient } from "../api/ingredients.api";
import { FoodSearchCombobox } from "./FoodSearchCombobox";

export function IngredientForm() {
  const createIngredient = useCreateIngredient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateIngredientInput>({
    resolver: zodResolver(createIngredientSchema),
    defaultValues: { name: "", caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((values) => createIngredient.mutate(values, { onSuccess: () => reset() }))}
    >
      <FoodSearchCombobox
        onSelect={(result) => {
          setValue("name", result.name);
          setValue("caloriesPer100g", result.caloriesPer100g);
          setValue("proteinPer100g", result.proteinPer100g);
          setValue("carbsPer100g", result.carbsPer100g);
          setValue("fatPer100g", result.fatPer100g);
        }}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ingredient-name">Name</Label>
        <Input id="ingredient-name" placeholder="Chicken breast" {...register("name")} />
        {errors.name && <p className="text-caption text-danger">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="calories">Calories / 100g</Label>
          <Input
            id="calories"
            type="number"
            step="0.1"
            {...register("caloriesPer100g", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="protein">Protein / 100g</Label>
          <Input
            id="protein"
            type="number"
            step="0.1"
            {...register("proteinPer100g", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="carbs">Carbs / 100g</Label>
          <Input
            id="carbs"
            type="number"
            step="0.1"
            {...register("carbsPer100g", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fat">Fat / 100g</Label>
          <Input id="fat" type="number" step="0.1" {...register("fatPer100g", { valueAsNumber: true })} />
        </div>
      </div>

      <Button type="submit" disabled={createIngredient.isPending} className="self-start">
        {createIngredient.isPending ? "Adding..." : "Add ingredient"}
      </Button>
    </form>
  );
}
