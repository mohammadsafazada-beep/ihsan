"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SetNutritionTargetInput } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

interface NutritionTargetRecord extends SetNutritionTargetInput {
  id: string;
}

const TARGETS_KEY = ["nutrition-targets"] as const;

export function useNutritionTargets() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: TARGETS_KEY,
    queryFn: () => api<NutritionTargetRecord[]>("/nutrition/targets"),
  });
}

export function useSetNutritionTarget() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SetNutritionTargetInput) =>
      api<NutritionTargetRecord>("/nutrition/targets", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARGETS_KEY });
      queryClient.invalidateQueries({ queryKey: ["nutrition-summary"] });
    },
  });
}
