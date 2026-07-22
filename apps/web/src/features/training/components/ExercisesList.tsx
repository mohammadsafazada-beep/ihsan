"use client";

import { useState } from "react";
import { useExercises } from "../api/exercises.api";
import { ExerciseHistoryPanel } from "./ExerciseHistoryPanel";

export function ExercisesList() {
  const { data: exercises, isLoading } = useExercises();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) return <p className="text-text-secondary">Loading exercises...</p>;
  if (!exercises || exercises.length === 0) {
    return <p className="text-text-secondary">No exercises yet.</p>;
  }

  const byMuscleGroup = new Map<string, typeof exercises>();
  for (const exercise of exercises) {
    const group = byMuscleGroup.get(exercise.muscleGroup) ?? [];
    group.push(exercise);
    byMuscleGroup.set(exercise.muscleGroup, group);
  }

  const expandedExercise = exercises.find((e) => e.id === expandedId);

  return (
    <div className="flex flex-col gap-4">
      {Array.from(byMuscleGroup.entries()).map(([group, list]) => (
        <div key={group} className="flex flex-col gap-1.5">
          <span className="text-micro text-text-tertiary">{group.toUpperCase()}</span>
          <div className="flex flex-wrap gap-2">
            {list.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => setExpandedId(expandedId === exercise.id ? null : exercise.id)}
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-caption text-text-secondary hover:bg-accent"
              >
                {exercise.name}
                {exercise.equipment && <span className="text-text-tertiary"> · {exercise.equipment}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
      {expandedExercise && (
        <ExerciseHistoryPanel exerciseId={expandedExercise.id} exerciseName={expandedExercise.name} />
      )}
    </div>
  );
}
