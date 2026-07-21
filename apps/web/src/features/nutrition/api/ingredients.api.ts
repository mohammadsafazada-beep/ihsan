"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateIngredientInput, Ingredient } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const INGREDIENTS_KEY = ["ingredients"] as const;

export function useIngredients() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: INGREDIENTS_KEY,
    queryFn: () => api<Ingredient[]>("/ingredients"),
  });
}

export function useCreateIngredient() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateIngredientInput) =>
      api<Ingredient>("/ingredients", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INGREDIENTS_KEY }),
  });
}

export function useDeleteIngredient() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ deleted: boolean }>(`/ingredients/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INGREDIENTS_KEY }),
  });
}
