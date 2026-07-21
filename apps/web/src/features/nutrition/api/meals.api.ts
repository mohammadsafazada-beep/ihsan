"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMealInput, Meal } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const mealsKey = (date: string) => ["meals", date] as const;
const summaryKey = (date: string) => ["nutrition-summary", date] as const;

export function useMeals(date: string) {
  const api = useAuthedApi();
  return useQuery({
    queryKey: mealsKey(date),
    queryFn: () => api<Meal[]>(`/meals?date=${date}`),
  });
}

export function useLogMeal(date: string) {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMealInput) =>
      api<Meal>("/meals", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsKey(date) });
      queryClient.invalidateQueries({ queryKey: summaryKey(date) });
    },
  });
}

export function useDeleteMeal(date: string) {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ deleted: boolean }>(`/meals/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsKey(date) });
      queryClient.invalidateQueries({ queryKey: summaryKey(date) });
    },
  });
}
