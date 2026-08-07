"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse } from "@/types";
import type { HeroBanner } from "@/types/hero";
import type { HeroBannerInput, HeroSlideInput } from "@/lib/schemas";

/* ------------------------------- Reads -------------------------------- */

/** GET /hero — published banner + active slides (public storefront). */
export function useHero() {
  return useQuery({
    queryKey: queryKeys.hero.public(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<HeroBanner | null>>("/hero");
      return data.data;
    },
  });
}

/** GET /hero/manage — full banner + all slides (admin dashboard). */
export function useHeroManage() {
  return useQuery({
    queryKey: queryKeys.hero.manage(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<HeroBanner>>("/hero/manage");
      return data.data;
    },
  });
}

/* ------------------------------- Writes ------------------------------- */

function useHeroInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.hero.all });
}

/** PATCH /hero — banner copy / published flag. */
export function useUpdateBanner() {
  const invalidate = useHeroInvalidate();
  return useMutation({
    mutationFn: async (payload: HeroBannerInput) => {
      const { data } = await api.patch<ApiResponse<HeroBanner>>("/hero", payload);
      return data.data;
    },
    onSuccess: invalidate,
  });
}

/** POST /hero/slides — add a slide. */
export function useAddSlide() {
  const invalidate = useHeroInvalidate();
  return useMutation({
    mutationFn: async (payload: HeroSlideInput) => {
      const { data } = await api.post<ApiResponse<HeroBanner>>(
        "/hero/slides",
        payload,
      );
      return data.data;
    },
    onSuccess: invalidate,
  });
}

/** PATCH /hero/slides/:id — update a slide. */
export function useUpdateSlide() {
  const invalidate = useHeroInvalidate();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<HeroSlideInput>;
    }) => {
      const { data } = await api.patch<ApiResponse<HeroBanner>>(
        `/hero/slides/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: invalidate,
  });
}

/** DELETE /hero/slides/:id — remove a slide. */
export function useDeleteSlide() {
  const invalidate = useHeroInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<HeroBanner>>(
        `/hero/slides/${id}`,
      );
      return data.data;
    },
    onSuccess: invalidate,
  });
}

/** PATCH /hero/slides/reorder — persist a new slide order. */
export function useReorderSlides() {
  const invalidate = useHeroInvalidate();
  return useMutation({
    mutationFn: async (order: string[]) => {
      const { data } = await api.patch<ApiResponse<HeroBanner>>(
        "/hero/slides/reorder",
        { order },
      );
      return data.data;
    },
    onSuccess: invalidate,
  });
}
