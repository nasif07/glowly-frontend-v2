"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type {
  ApiResponse,
  SteadfastBalanceResponse,
  SteadfastBulkOrderResult,
  SteadfastOrderResponse,
  SteadfastPayment,
  SteadfastPaymentDetail,
  SteadfastPoliceStation,
  SteadfastReturnRequest,
  SteadfastStatusResponse,
  SteadfastTrackIdentifier,
} from "@/types";
import type {
  CreateSteadfastBulkOrderInput,
  CreateSteadfastOrderInput,
  CreateSteadfastReturnRequestInput,
} from "@/lib/schemas";

/** Pagination params shared by list endpoints. */
interface PaginationParams {
  page?: number;
  per_page?: number;
}

/* ----------------------------- Balance ----------------------------- */

/** GET /steadfast/balance */
export function useSteadfastBalance() {
  return useQuery({
    queryKey: queryKeys.steadfast.balance(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SteadfastBalanceResponse>>(
        "/steadfast/balance",
      );
      return data.data;
    },
  });
}

/* ------------------------------ Orders ------------------------------ */

/** POST /steadfast/orders — create a single courier order. */
export function useCreateSteadfastOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSteadfastOrderInput) => {
      const { data } = await api.post<ApiResponse<SteadfastOrderResponse>>(
        "/steadfast/orders",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.steadfast.balance() });
    },
  });
}

/** POST /steadfast/orders/bulk — create up to 500 orders in one call. */
export function useCreateSteadfastBulkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSteadfastBulkOrderInput) => {
      const { data } = await api.post<ApiResponse<SteadfastBulkOrderResult[]>>(
        "/steadfast/orders/bulk",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.steadfast.balance() });
    },
  });
}

/* ------------------------------ Tracking ----------------------------- */

/**
 * GET /steadfast/track?consignmentId=|invoice=|trackingCode= — looks up
 * delivery status using whichever identifier is provided. Manual
 * (refetch-driven) like `useTrackOrder`, since it's search-triggered.
 */
export function useTrackSteadfastOrder(
  identifier: SteadfastTrackIdentifier,
  enabled = false,
) {
  const hasIdentifier = Boolean(
    identifier.consignmentId || identifier.invoice || identifier.trackingCode,
  );

  return useQuery({
    queryKey: queryKeys.steadfast.track(identifier),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SteadfastStatusResponse>>(
        "/steadfast/track",
        { params: identifier },
      );
      return data.data;
    },
    enabled: enabled && hasIdentifier,
  });
}

/* --------------------------- Return requests -------------------------- */

/** GET /steadfast/return-requests */
export function useSteadfastReturnRequests(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.steadfast.returnRequests.list(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SteadfastReturnRequest[]>>(
        "/steadfast/return-requests",
        { params },
      );
      return data;
    },
  });
}

/** GET /steadfast/return-requests/:id */
export function useSteadfastReturnRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.steadfast.returnRequests.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SteadfastReturnRequest>>(
        `/steadfast/return-requests/${id}`,
      );
      return data.data;
    },
    enabled: !!id,
  });
}

/** POST /steadfast/return-requests */
export function useCreateSteadfastReturnRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSteadfastReturnRequestInput) => {
      const { data } = await api.post<ApiResponse<SteadfastReturnRequest>>(
        "/steadfast/return-requests",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.steadfast.returnRequests.all(),
      });
    },
  });
}

/* ------------------------------ Payments ------------------------------ */

/** GET /steadfast/payments */
export function useSteadfastPayments(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.steadfast.payments.list(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SteadfastPayment[]>>(
        "/steadfast/payments",
        { params },
      );
      return data;
    },
  });
}

/** GET /steadfast/payments/:paymentId */
export function useSteadfastPayment(paymentId: string) {
  return useQuery({
    queryKey: queryKeys.steadfast.payments.detail(paymentId),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SteadfastPaymentDetail>>(
        `/steadfast/payments/${paymentId}`,
      );
      return data.data;
    },
    enabled: !!paymentId,
  });
}

/* -------------------------- Police stations -------------------------- */

/** GET /steadfast/police-stations */
export function useSteadfastPoliceStations() {
  return useQuery({
    queryKey: queryKeys.steadfast.policeStations(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SteadfastPoliceStation[]>>(
        "/steadfast/police-stations",
      );
      return data.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // reference data — practically static
  });
}
