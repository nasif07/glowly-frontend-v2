"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, PaginatedResponse, Product, ProductsQuery } from "@/types";
import type { ProductInput } from "@/lib/schemas";

/* ----------------------------- Reads ----------------------------- */

/** GET /products — paginated list (returns the envelope for `data` + `meta`). */
export function useProducts(
  params: ProductsQuery = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Product>>("/products", {
        params,
      });
      return data;
    },
    enabled: options?.enabled,
  });
}

/**
 * GET /products — infinite/append pagination for the shop listing.
 * `getNextPageParam` mirrors the original `hasMore = data.length === limit`.
 */
export function useInfiniteProducts(
  filters: Omit<ProductsQuery, "page" | "limit"> = {},
  limit = 9,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list({ ...filters, limit }),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<Product>>("/products", {
        params: { ...filters, limit, page: pageParam },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const items = lastPage.data ?? [];
      return items.length === limit ? allPages.length + 1 : undefined;
    },
  });
}

/** GET /products/featured */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product[]>>(
        "/products/featured",
      );
      return data.data;
    },
  });
}

/** GET /products/:id */
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

/* ---------------------------- Writes ----------------------------- */

/** POST /products */
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProductInput) => {
      const { data } = await api.post<ApiResponse<Product>>(
        "/products",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

/** PUT /products/:id */
export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ProductInput>) => {
      const { data } = await api.put<ApiResponse<Product>>(
        `/products/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

/** DELETE /products/:id */
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}
