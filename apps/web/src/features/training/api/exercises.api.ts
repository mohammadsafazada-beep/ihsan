"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateExerciseInput, Exercise } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const EXERCISES_KEY = ["exercises"] as const;

export function useExercises() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: EXERCISES_KEY,
    queryFn: () => api<Exercise[]>("/exercises"),
  });
}

export function useCreateExercise() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExerciseInput) =>
      api<Exercise>("/exercises", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXERCISES_KEY }),
  });
}
