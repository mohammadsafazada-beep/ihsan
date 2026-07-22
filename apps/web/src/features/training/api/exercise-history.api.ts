"use client";

import { useQuery } from "@tanstack/react-query";
import type { ExerciseHistoryEntry } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

export function useExerciseHistory(exerciseId: string, enabled: boolean) {
  const api = useAuthedApi();
  return useQuery({
    queryKey: ["exercise-history", exerciseId],
    queryFn: () => api<ExerciseHistoryEntry[]>(`/exercises/${exerciseId}/history`),
    enabled,
  });
}
