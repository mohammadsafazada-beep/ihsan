"use client";

import { useQuery } from "@tanstack/react-query";
import type { NextSuggestion } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

export function useNextSuggestion(
  programId: string | undefined,
  workoutDayId: string | undefined,
  exerciseId: string | undefined,
) {
  const api = useAuthedApi();
  return useQuery({
    queryKey: ["next-suggestion", programId, workoutDayId, exerciseId],
    queryFn: () =>
      api<NextSuggestion>(
        `/programs/${programId}/days/${workoutDayId}/next-suggestion?exerciseId=${exerciseId}`,
      ),
    enabled: Boolean(programId && workoutDayId && exerciseId),
  });
}
