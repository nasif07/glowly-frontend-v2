"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse } from "@/types";
import type { StoreSettings } from "@/types/settings";
import type { StoreSettingsInput } from "@/lib/schemas";

/**
 * Fallback used until `/settings` resolves, and if the request fails. It
 * matches the backend model defaults, so a checkout rendered during the fetch
 * shows the advance panel rather than flickering into cash-on-delivery.
 */
export const DEFAULT_STORE_SETTINGS: Pick<
  StoreSettings,
  "advanceRequired" | "advanceAmount"
> = {
  advanceRequired: true,
  advanceAmount: 200,
};

/** GET /settings — store payment policy (public; checkout renders from it). */
export function useStoreSettings() {
  return useQuery({
    queryKey: queryKeys.settings.store(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<StoreSettings>>("/settings");
      return data.data;
    },
    // Rarely changes and every checkout needs it — don't refetch on each mount.
    staleTime: 5 * 60 * 1000,
  });
}

/** PATCH /settings — change the payment policy (admin). */
export function useUpdateStoreSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: StoreSettingsInput) => {
      const { data } = await api.patch<ApiResponse<StoreSettings>>(
        "/settings",
        payload,
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.settings.all }),
  });
}
