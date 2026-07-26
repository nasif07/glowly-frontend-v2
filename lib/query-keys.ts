import type { ProductsQuery } from "@/types";

/**
 * Centralised, hierarchical query-key factory.
 *
 * Keys nest so you can invalidate broadly or narrowly:
 *   queryKeys.products.all            → every product query
 *   queryKeys.products.lists()        → all product lists
 *   queryKeys.products.detail(id)     → one product
 */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (params: ProductsQuery = {}) =>
      [...queryKeys.products.lists(), params] as const,
    featured: () => [...queryKeys.products.all, "featured"] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: () => [...queryKeys.categories.lists()] as const,
    leafFormatted: () =>
      [...queryKeys.categories.all, "leaf-formatted"] as const,
    detail: (id: string) => [...queryKeys.categories.all, "detail", id] as const,
  },
  brands: {
    all: ["brands"] as const,
    lists: () => [...queryKeys.brands.all, "list"] as const,
    list: () => [...queryKeys.brands.lists()] as const,
    detail: (id: string) => [...queryKeys.brands.all, "detail", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: () => [...queryKeys.orders.lists()] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
    track: (phone: string) => [...queryKeys.orders.all, "track", phone] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: () => [...queryKeys.users.lists()] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
  auth: {
    all: ["auth"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
  },
  steadfast: {
    all: ["steadfast"] as const,
    balance: () => [...queryKeys.steadfast.all, "balance"] as const,
    track: (identifier: {
      consignmentId?: string;
      invoice?: string;
      trackingCode?: string;
    }) => [...queryKeys.steadfast.all, "track", identifier] as const,
    returnRequests: {
      all: () => [...queryKeys.steadfast.all, "return-requests"] as const,
      list: (params: { page?: number; per_page?: number } = {}) =>
        [...queryKeys.steadfast.returnRequests.all(), "list", params] as const,
      detail: (id: string | number) =>
        [...queryKeys.steadfast.returnRequests.all(), "detail", id] as const,
    },
    payments: {
      all: () => [...queryKeys.steadfast.all, "payments"] as const,
      list: (params: { page?: number; per_page?: number } = {}) =>
        [...queryKeys.steadfast.payments.all(), "list", params] as const,
      detail: (id: string | number) =>
        [...queryKeys.steadfast.payments.all(), "detail", id] as const,
    },
    policeStations: () =>
      [...queryKeys.steadfast.all, "police-stations"] as const,
  },
} as const;
