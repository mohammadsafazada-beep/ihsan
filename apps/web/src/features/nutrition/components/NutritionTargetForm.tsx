"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayDateString } from "@/lib/utils";
import { useNutritionTargets, useSetNutritionTarget } from "../api/nutrition-targets.api";

export function NutritionTargetForm() {
  const { data: targets } = useNutritionTargets();
  const setTarget = useSetNutritionTarget();
  const [showForm, setShowForm] = useState(false);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const currentTarget = targets?.[0];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!calories || !protein || !carbs || !fat) return;
    setTarget.mutate(
      {
        calories: Number(calories),
        proteinGrams: Number(protein),
        carbsGrams: Number(carbs),
        fatGrams: Number(fat),
        effectiveFrom: todayDateString(),
      },
      { onSuccess: () => setShowForm(false) },
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {currentTarget ? (
          <p className="text-text-secondary">
            Current target: {currentTarget.calories} kcal · {currentTarget.proteinGrams}g protein ·{" "}
            {currentTarget.carbsGrams}g carbs · {currentTarget.fatGrams}g fat
          </p>
        ) : (
          <p className="text-text-secondary">No nutrition target set yet.</p>
        )}
        <Button type="button" variant="outline" size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : currentTarget ? "Update target" : "Set target"}
        </Button>
      </div>

      {showForm && (
        <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label>Calories</Label>
            <Input type="number" className="w-28" value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Protein (g)</Label>
            <Input type="number" className="w-28" value={protein} onChange={(e) => setProtein(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Carbs (g)</Label>
            <Input type="number" className="w-28" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Fat (g)</Label>
            <Input type="number" className="w-28" value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
          <Button type="submit" disabled={setTarget.isPending}>
            {setTarget.isPending ? "Saving..." : "Save target"}
          </Button>
        </form>
      )}
    </div>
  );
}
