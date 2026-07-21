"use client";

import { useQuery } from "@tanstack/react-query";
import type { FoodSearchResult } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

export function useFoodSearch(query: string) {
  const api = useAuthedApi();
  const trimmed = query.trim();
  return useQuery({
    queryKey: ["food-search", trimmed],
    queryFn: () => api<FoodSearchResult[]>(`/ingredients/search?query=${encodeURIComponent(trimmed)}`),
    enabled: trimmed.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
