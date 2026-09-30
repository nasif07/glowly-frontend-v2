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
  "advanceRequired" | "advanceAmount" | "deliveryChargeEnabled" | "deliveryCharge"
> = {
  advanceRequired: true,
  advanceAmount: 200,
  deliveryChargeEnabled: true,
  deliveryCharge: 120,
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

/**
 * Whether the API enforces stock (STOCK_ENFORCEMENT). False until /settings
 * has loaded, or if it fails — the same as the shop behaved before the flag.
 */
export function useStockEnforcement() {
  const { data } = useStoreSettings();
  return data?.stockEnforcement === true;
}

/**
 * The delivery charge (৳) every order pays: 0 while it's switched off in the
 * store settings. The API derives the same figure itself when the order is
 * placed, so this only drives what cart and checkout display and submit.
 */
export function useDeliveryCharge() {
  const { data } = useStoreSettings();
  const enabled =
    data?.deliveryChargeEnabled ?? DEFAULT_STORE_SETTINGS.deliveryChargeEnabled;
  if (!enabled) return 0;
  return data?.deliveryCharge ?? DEFAULT_STORE_SETTINGS.deliveryCharge;
}
