"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";
import { apiFetch } from "./api-client";

export function useAuthedApi() {
  const { getToken } = useAuth();

  return useCallback(
    async function authedFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
      const token = await getToken();
      return apiFetch<T>(path, { ...options, token });
    },
    [getToken],
  );
}
