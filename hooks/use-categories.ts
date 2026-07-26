"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Category, LeafCategory } from "@/types";
import type { CategoryInput } from "@/lib/schemas";

/* ----------------------------- Reads ----------------------------- */

/** GET /categories */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>("/categories");
      return data.data;
    },
  });
}

/** GET /categories/leaf-formatted — flat leaf list for product forms. */
export function useLeafCategories() {
  return useQuery({
    queryKey: queryKeys.categories.leafFormatted(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<LeafCategory[]>>(
        "/categories/leaf-formatted",
      );
      return data.data;
    },
  });
}

/** GET /categories/:id */
export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category>>(
        `/categories/${id}`,
      );
      return data.data;
    },
    enabled: !!id,
  });
}

/* ---------------------------- Writes ----------------------------- */

/** POST /categories */
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CategoryInput) => {
      const { data } = await api.post<ApiResponse<Category>>(
        "/categories",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

/** PATCH /categories/:id */
export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CategoryInput>) => {
      const { data } = await api.patch<ApiResponse<Category>>(
        `/categories/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

/** DELETE /categories/:id */
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
