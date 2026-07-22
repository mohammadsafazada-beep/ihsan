"use client";

import { useQuery } from "@tanstack/react-query";
import type { PersonalRecord } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

export function usePersonalRecords() {
  const api = useAuthedApi();
  return useQuery({
    queryKey: ["personal-records"],
    queryFn: () => api<PersonalRecord[]>("/personal-records"),
  });
}
