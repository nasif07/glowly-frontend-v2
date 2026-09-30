"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type {
  ApiResponse,
  Consultation,
  ConsultationListMeta,
  ConsultationStatus,
  ConsultationSummary,
  ConsultationsQuery,
} from "@/types";
import type { SubmitConsultationPayload } from "@/lib/schemas";

/* ----------------------------- Public ---------------------------- */

/** POST /consultations — the customer sends the form. */
export function useSubmitConsultation() {
  return useMutation({
    mutationFn: async (payload: SubmitConsultationPayload) => {
      const { data } = await api.post<
        ApiResponse<{ consultationId: string | null }>
      >("/consultations", payload);
      return data.data;
    },
  });
}

/* ------------------------------ Admin ---------------------------- */

/** GET /consultations — paginated on the server, with per-status counts. */
export function useConsultations(params: ConsultationsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.consultations.list(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ConsultationSummary[]>>(
        "/consultations",
        { params },
      );
      return {
        data: data.data,
        meta: data.meta as unknown as ConsultationListMeta,
      };
    },
    // Keep the table in place while the next page or filter loads.
    placeholderData: keepPreviousData,
  });
}

/**
 * GET /consultations/:id. Photo links expire after ~10 minutes, so refetch
 * a little before that while the page stays open.
 */
export function useConsultation(id: string) {
  return useQuery({
    queryKey: queryKeys.consultations.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Consultation>>(
        `/consultations/${id}`,
      );
      return data.data;
    },
    enabled: !!id,
    refetchInterval: 8 * 60 * 1000,
  });
}

/** Every write returns the updated consultation; refresh lists and seed the detail. */
function useConsultationWrite<TVars>(
  id: string,
  request: (vars: TVars) => Promise<Consultation>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: (consultation) => {
      qc.setQueryData(queryKeys.consultations.detail(id), consultation);
      qc.invalidateQueries({ queryKey: queryKeys.consultations.lists() });
    },
  });
}

/** PATCH /consultations/:id/status */
export function useUpdateConsultationStatus(id: string) {
  return useConsultationWrite(id, async (status: ConsultationStatus) => {
    const { data } = await api.patch<ApiResponse<Consultation>>(
      `/consultations/${id}/status`,
      { status },
    );
    return data.data;
  });
}

/** POST /consultations/:id/notes */
export function useAddConsultationNote(id: string) {
  return useConsultationWrite(id, async (body: string) => {
    const { data } = await api.post<ApiResponse<Consultation>>(
      `/consultations/${id}/notes`,
      { body },
    );
    return data.data;
  });
}

/** DELETE /consultations/:id — the record and its photos. */
export function useDeleteConsultation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/consultations/${id}`);
      return id;
    },
    onSuccess: (id) => {
      qc.removeQueries({ queryKey: queryKeys.consultations.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.consultations.lists() });
    },
  });
}
