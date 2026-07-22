"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApplyPlanRequest, ApplyPlanResult, PlanIntake, ProposedPlan } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

export function useGeneratePlan() {
  const api = useAuthedApi();
  return useMutation({
    mutationFn: (input: PlanIntake) =>
      api<ProposedPlan>("/plan-wizard/generate", { method: "POST", body: JSON.stringify(input) }),
  });
}

export function useApplyPlan() {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ApplyPlanRequest) =>
      api<ApplyPlanResult>("/plan-wizard/apply", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["nutrition-targets"] });
      queryClient.invalidateQueries({ queryKey: ["nutrition-summary"] });
      queryClient.invalidateQueries({ queryKey: ["meal-templates"] });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
