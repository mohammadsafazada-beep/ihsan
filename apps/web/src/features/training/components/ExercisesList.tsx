"use client";

import { useExercises } from "../api/exercises.api";

export function ExercisesList() {
  const { data: exercises, isLoading } = useExercises();

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

  return (
    <div className="flex flex-col gap-4">
      {Array.from(byMuscleGroup.entries()).map(([group, list]) => (
        <div key={group} className="flex flex-col gap-1.5">
          <span className="text-micro text-text-tertiary">{group.toUpperCase()}</span>
          <div className="flex flex-wrap gap-2">
            {list.map((exercise) => (
              <span
                key={exercise.id}
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-caption text-text-secondary"
              >
                {exercise.name}
                {exercise.equipment && <span className="text-text-tertiary"> · {exercise.equipment}</span>}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
