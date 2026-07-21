"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateGoalInput, Goal } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const GOALS_KEY = ["goals"] as const;

export function useGoals() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: GOALS_KEY,
    queryFn: () => api<Goal[]>("/goals"),
  });
}

export function useCreateGoal() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGoalInput) =>
      api<Goal>("/goals", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });
}
