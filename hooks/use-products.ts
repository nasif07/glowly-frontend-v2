"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductsQuery,
} from "@/types";
import type { ProductInput } from "@/lib/schemas";

/** What the admin form sends: the form values, with "No brand" as null. */
export type ProductPayload = Omit<ProductInput, "brand"> & {
  brand: string | null;
};

/** The largest page `/products` will serve — it clamps anything above this. */
const PRODUCTS_PAGE_SIZE = 100;

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
 * Every product, as one list.
 *
 * `/products` caps `limit` at 100 server-side, so asking for a bigger number
 * silently returns only the first 100 — which is what the inventory page was
 * doing. Walk the pages instead and concatenate. The dashboard searches,
 * filters and sorts across the whole catalogue in the browser, so it genuinely
 * needs all of it rather than one server page.
 *
 * Admin only: reads `/products/admin/all`, which includes hidden (and
 * deleted) products — the public list leaves those out, so the inventory
 * used to lose any product the moment it was hidden.
 */
export function useAllProducts(
  filters: Omit<ProductsQuery, "page" | "limit"> = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.products.allList(filters),
    enabled: options?.enabled,
    queryFn: async () => {
      const items: Product[] = [];
      let page = 1;
      let totalPage = 1;

      do {
        const { data } = await api.get<PaginatedResponse<Product>>(
          "/products/admin/all",
          { params: { ...filters, limit: PRODUCTS_PAGE_SIZE, page } },
        );
        items.push(...(data.data ?? []));
        totalPage = data.meta?.totalPage ?? 1;
        page += 1;
      } while (page <= totalPage);

      return items;
    },
  });
}

/**
 * GET /products — infinite/append pagination for the shop listing. Pages on
 * the API's `hasMore`; guessing from a full page asked for one empty page
 * whenever the total was a multiple of the page size.
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
      const hasMore =
        lastPage.meta?.hasMore ?? (lastPage.data ?? []).length === limit;
      return hasMore ? allPages.length + 1 : undefined;
    },
  });
}

/** GET /products/featured */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: async () => {
      const { data } =
        await api.get<ApiResponse<Product[]>>("/products/featured");
      return data.data;
    },
  });
}

/** GET /products/new-arrivals — active products ticked "New Arrival", newest first (max 10). */
export function useNewArrivalProducts() {
  return useQuery({
    queryKey: queryKeys.products.newArrivals(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product[]>>(
        "/products/new-arrivals",
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
    mutationFn: async (payload: ProductPayload) => {
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
    mutationFn: async (payload: Partial<ProductPayload>) => {
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
