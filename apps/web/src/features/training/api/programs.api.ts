"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateProgramInput, Program } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const PROGRAMS_KEY = ["programs"] as const;

export function usePrograms() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: PROGRAMS_KEY,
    queryFn: () => api<Program[]>("/programs"),
  });
}

export function useCreateProgram() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProgramInput) =>
      api<Program>("/programs", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROGRAMS_KEY }),
  });
}

export function useActivateProgram() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programId: string) => api<Program>(`/programs/${programId}/activate`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROGRAMS_KEY }),
  });
}
