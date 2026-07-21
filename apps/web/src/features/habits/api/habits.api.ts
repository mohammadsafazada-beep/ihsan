"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateHabitInput, Habit, LogHabitInput } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const HABITS_KEY = ["habits"] as const;

export function useHabits() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: HABITS_KEY,
    queryFn: () => api<Habit[]>("/habits"),
  });
}

export function useCreateHabit() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHabitInput) =>
      api<Habit>("/habits", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY }),
  });
}

export function useLogHabit() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, input }: { habitId: string; input: LogHabitInput }) =>
      api<{ logged: boolean }>(`/habits/${habitId}/logs`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY }),
  });
}
