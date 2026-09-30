"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse } from "@/types";
import type { SkinTypeMedia, SkinTypeMediaInput } from "@/types/skin-type";

/** GET /skin-types — media + copy for the homepage skin type tiles. */
export function useSkinTypeMedia() {
  return useQuery({
    queryKey: queryKeys.skinTypes.list(),
    queryFn: async () => {
      const { data } =
        await api.get<ApiResponse<SkinTypeMedia[]>>("/skin-types");
      return data.data;
    },
  });
}

/** PATCH /skin-types/:skinType — set one tile's media / copy (admin). */
export function useUpdateSkinTypeMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      skinType,
      payload,
    }: {
      skinType: SkinTypeMedia["skinType"];
      payload: SkinTypeMediaInput;
    }) => {
      const { data } = await api.patch<ApiResponse<SkinTypeMedia>>(
        `/skin-types/${skinType}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.skinTypes.all }),
  });
}
