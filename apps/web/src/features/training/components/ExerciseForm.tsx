"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateExercise } from "../api/exercises.api";

export function ExerciseForm() {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [equipment, setEquipment] = useState("");
  const createExercise = useCreateExercise();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !muscleGroup.trim()) return;
    createExercise.mutate(
      { name: name.trim(), muscleGroup: muscleGroup.trim(), equipment: equipment.trim() || undefined },
      {
        onSuccess: () => {
          setName("");
          setMuscleGroup("");
          setEquipment("");
        },
      },
    );
  }

  return (
    <form className="flex flex-wrap items-end gap-2" onSubmit={handleSubmit}>
      <Input
        placeholder="Exercise name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="Muscle group"
        value={muscleGroup}
        onChange={(e) => setMuscleGroup(e.target.value)}
        className="w-40"
      />
      <Input
        placeholder="Equipment (optional)"
        value={equipment}
        onChange={(e) => setEquipment(e.target.value)}
        className="w-40"
      />
      <Button type="submit" disabled={createExercise.isPending || !name.trim() || !muscleGroup.trim()}>
        {createExercise.isPending ? "Adding..." : "Add exercise"}
      </Button>
    </form>
  );
}
