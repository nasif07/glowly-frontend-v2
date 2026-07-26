"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Brand } from "@/types";
import type { BrandInput } from "@/lib/schemas";

/* ----------------------------- Reads ----------------------------- */

/** GET /brands */
export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands.list(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Brand[]>>("/brands");
      return data.data;
    },
  });
}

/** GET /brands/:id */
export function useBrand(id: string) {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Brand>>(`/brands/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

/* ---------------------------- Writes ----------------------------- */

/** POST /brands */
export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BrandInput) => {
      const { data } = await api.post<ApiResponse<Brand>>("/brands", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}

/** PATCH /brands/:id */
export function useUpdateBrand(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<BrandInput>) => {
      const { data } = await api.patch<ApiResponse<Brand>>(
        `/brands/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}

/** DELETE /brands/:id */
export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/brands/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}
