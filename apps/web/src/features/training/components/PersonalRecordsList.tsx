"use client";

import { usePersonalRecords } from "../api/personal-records.api";

const TYPE_LABELS: Record<string, string> = {
  MAX_WEIGHT: "Max weight",
  ESTIMATED_1RM: "Est. 1RM",
  MAX_VOLUME_SESSION: "Max session volume",
};

export function PersonalRecordsList() {
  const { data: records, isLoading } = usePersonalRecords();

  if (isLoading) return <p className="text-text-secondary">Loading records...</p>;
  if (!records || records.length === 0) {
    return <p className="text-text-secondary">No personal records yet — log some sets to start tracking them.</p>;
  }

  const byExercise = new Map<string, typeof records>();
  for (const record of records) {
    const group = byExercise.get(record.exerciseName) ?? [];
    group.push(record);
    byExercise.set(record.exerciseName, group);
  }

  return (
    <ul className="flex flex-col gap-2">
      {Array.from(byExercise.entries()).map(([exerciseName, exerciseRecords]) => (
        <li key={exerciseName} className="rounded-md border border-border bg-surface px-3 py-2">
          <p className="text-body font-medium">{exerciseName}</p>
          <p className="text-caption text-text-secondary">
            {exerciseRecords
              .map((record) => {
                const unit = record.type === "MAX_VOLUME_SESSION" ? "kg total" : "kg";
                return `${TYPE_LABELS[record.type] ?? record.type}: ${record.value}${unit}`;
              })
              .join(" · ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
