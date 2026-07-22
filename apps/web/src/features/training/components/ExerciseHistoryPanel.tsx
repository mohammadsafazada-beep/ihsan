"use client";

import { useExerciseHistory } from "../api/exercise-history.api";

export function ExerciseHistoryPanel({ exerciseId, exerciseName }: { exerciseId: string; exerciseName: string }) {
  const { data: history, isLoading } = useExerciseHistory(exerciseId, true);

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface-raised p-3">
      <p className="text-caption text-text-tertiary">{exerciseName} history</p>
      {isLoading ? (
        <p className="text-text-secondary">Loading history...</p>
      ) : !history || history.length === 0 ? (
        <p className="text-text-secondary">No sets logged for this exercise yet.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {history.map((entry, index) => (
            <li key={`${entry.workoutSessionId}-${entry.setNumber}-${index}`} className="text-caption text-text-secondary">
              {entry.date} · Set {entry.setNumber} · {entry.reps} reps @ {entry.weightKg}kg
              {entry.isWarmup ? " · warmup" : ""}
              {entry.rpe ? ` · RPE ${entry.rpe}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
