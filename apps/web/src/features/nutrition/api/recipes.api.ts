"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateRecipeInput, Recipe } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const RECIPES_KEY = ["recipes"] as const;

export function useRecipes() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: RECIPES_KEY,
    queryFn: () => api<Recipe[]>("/recipes"),
  });
}

export function useCreateRecipe() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRecipeInput) =>
      api<Recipe>("/recipes", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RECIPES_KEY }),
  });
}

export function useDeleteRecipe() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ deleted: boolean }>(`/recipes/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RECIPES_KEY }),
  });
}
