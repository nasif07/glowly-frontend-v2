"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Order } from "@/types";
import type { CreateOrderInput, UpdateOrderStatusInput } from "@/lib/schemas";

/* ----------------------------- Reads ----------------------------- */

/** GET /orders — admin order list. */
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order[]>>("/orders");
      return data.data;
    },
  });
}

/** GET /orders/:id */
export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

/**
 * GET /orders/track?phone= — public order tracking.
 * The endpoint may return a single order or an array; normalise to an array.
 */
export function useTrackOrder(phone: string, enabled = false) {
  return useQuery({
    queryKey: queryKeys.orders.track(phone),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order[] | Order>>(
        "/orders/track",
        { params: { phone } },
      );
      return Array.isArray(data.data) ? data.data : [data.data];
    },
    enabled: enabled && !!phone,
  });
}

/* ---------------------------- Writes ----------------------------- */

/** POST /orders — place an order (checkout). */
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrderInput) => {
      const { data } = await api.post<ApiResponse<Order>>("/orders", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}

/** PATCH /orders/:id/status */
export function useUpdateOrderStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateOrderStatusInput) => {
      const { data } = await api.patch<ApiResponse<Order>>(
        `/orders/${id}/status`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}

/**
 * POST /orders/:id/steadfast — send this order to Steadfast as a courier
 * consignment, auto-filled server-side from the order's own shipping details.
 */
export function useSendOrderToSteadfast(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<Order>>(
        `/orders/${id}/steadfast`,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}
