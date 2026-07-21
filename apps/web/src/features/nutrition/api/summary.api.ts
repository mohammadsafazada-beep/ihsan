"use client";

import { useQuery } from "@tanstack/react-query";
import type { NutritionSummary } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

export function useNutritionSummary(date: string) {
  const api = useAuthedApi();
  return useQuery({
    queryKey: ["nutrition-summary", date],
    queryFn: () => api<NutritionSummary>(`/nutrition/summary?date=${date}`),
  });
}
