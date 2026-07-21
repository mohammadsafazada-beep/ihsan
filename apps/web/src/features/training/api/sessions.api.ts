"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateSessionInput, LogSetInput, Session, SetLog } from "@ihsan/contracts";
import { useAuthedApi } from "@/lib/use-authed-api";

const sessionsKey = (date: string) => ["sessions", date] as const;

export function useSessionsForDate(date: string) {
  const api = useAuthedApi();
  return useQuery({
    queryKey: sessionsKey(date),
    queryFn: () => api<Session[]>(`/sessions?from=${date}&to=${date}`),
  });
}

export function useCreateSession(date: string) {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSessionInput) =>
      api<Session>("/sessions", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionsKey(date) }),
  });
}

export function useLogSet(date: string) {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, input }: { sessionId: string; input: LogSetInput }) =>
      api<SetLog>(`/sessions/${sessionId}/sets`, { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionsKey(date) }),
  });
}

export function useDeleteSet(date: string) {
  const api = useAuthedApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (setId: string) => api<{ deleted: boolean }>(`/sets/${setId}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionsKey(date) }),
  });
}
