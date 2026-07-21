"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApplyMealTemplateInput, Meal, MealTemplate, SaveMealAsTemplateInput } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const TEMPLATES_KEY = ["meal-templates"] as const;

export function useMealTemplates() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: TEMPLATES_KEY,
    queryFn: () => api<MealTemplate[]>("/meal-templates"),
  });
}

export function useApplyMealTemplate(date: string) {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, input }: { templateId: string; input: ApplyMealTemplateInput }) =>
      api<Meal[]>(`/meal-templates/${templateId}/apply`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals", date] });
      queryClient.invalidateQueries({ queryKey: ["nutrition-summary", date] });
    },
  });
}

export function useSaveMealAsTemplate() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mealId, input }: { mealId: string; input: SaveMealAsTemplateInput }) =>
      api<MealTemplate>(`/meals/${mealId}/save-as-template`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY }),
  });
}
