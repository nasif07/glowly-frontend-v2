"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  createSteadfastReturnRequestSchema,
  type CreateSteadfastReturnRequestInput,
} from "@/lib/schemas";
import {
  useCreateSteadfastReturnRequest,
  useSteadfastReturnRequests,
} from "@/hooks/use-steadfast";
import { getErrorMessage } from "@/lib/api-error";
import { Input } from "@/components/ui/input";
import { GlowButton } from "@/components/forms/glow-button";
import { ReturnStatusBadge } from "./status-badge";

const fieldInput =
  "h-auto rounded-xl border border-[#D4BFAA] bg-[#FCFAF8] px-4 py-2.5 text-sm text-[#4B2E2B] shadow-none focus-visible:border-[#6B4A3D] focus-visible:ring-4 focus-visible:ring-[#6B4A3D]/5";

const PER_PAGE = 10;

export function ReturnRequestsPanel() {
  const [page, setPage] = useState(1);
  const createReturnRequest = useCreateSteadfastReturnRequest();
  const { data, isLoading } = useSteadfastReturnRequests({
    page,
    per_page: PER_PAGE,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSteadfastReturnRequestInput>({
    resolver: zodResolver(createSteadfastReturnRequestSchema),
    defaultValues: { consignment_id: "", invoice: "", tracking_code: "", reason: "" },
  });

  const onSubmit = (values: CreateSteadfastReturnRequestInput) => {
    createReturnRequest.mutate(values, {
      onSuccess: () => {
        toast.success("Return request created");
        reset();
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Failed to create return request")),
    });
  };

  const requests = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl border border-[#300332]/10 bg-[#F9F1E7] p-2.5">
            <RotateCcw className="h-5 w-5 text-[#300332]" />
          </div>
          <h2 className="text-lg font-bold text-[#2D1B14]">Create Return Request</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#4B2E2B]">
              Consignment ID
            </label>
            <Input
              {...register("consignment_id")}
              placeholder="Optional if invoice/tracking code given"
              className={fieldInput}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#4B2E2B]">
              Invoice
            </label>
            <Input
              {...register("invoice")}
              placeholder="Optional if consignment ID given"
              className={fieldInput}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#4B2E2B]">
              Tracking Code
            </label>
            <Input
              {...register("tracking_code")}
              placeholder="Optional"
              className={fieldInput}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#4B2E2B]">
              Reason
            </label>
            <Input
              {...register("reason")}
              placeholder="Optional"
              className={fieldInput}
            />
          </div>

          {errors.consignment_id && (
            <p className="text-xs text-red-500 md:col-span-2">
              {errors.consignment_id.message}
            </p>
          )}

          <div className="md:col-span-2">
            <GlowButton
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#4B2E2B] py-3.5 text-xs font-bold tracking-[2px] text-white uppercase shadow-lg shadow-[#4B2E2B]/20 hover:bg-[#321E1B]"
            >
              {isSubmitting ? "Submitting..." : "Create Return Request"}
            </GlowButton>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm md:p-8">
        <h3 className="mb-4 text-sm font-bold tracking-wide text-[#4B2E2B] uppercase">
          Return Requests
        </h3>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F3EEEA]" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <p className="text-sm text-[#8C6A5E]">No return requests yet.</p>
        ) : (
          <div className="space-y-2">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E8D8C3] bg-[#FDF8F3] px-4 py-3"
              >
                <div className="text-sm text-[#4B2E2B]">
                  <span className="font-semibold">
                    #{r.id} {r.invoice ? `— ${r.invoice}` : ""}
                  </span>
                  {r.reason && (
                    <span className="ml-2 text-xs text-[#8C6A5E]">{r.reason}</span>
                  )}
                </div>
                <ReturnStatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 rounded-full border border-[#D4BFAA] px-3 py-1.5 text-xs font-semibold text-[#4B2E2B] disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs text-[#8C6A5E]">
            Page {meta?.page ?? page}
            {meta?.totalPage ? ` of ${meta.totalPage}` : ""}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={meta?.totalPage ? page >= meta.totalPage : requests.length < PER_PAGE}
            className="flex items-center gap-1 rounded-full border border-[#D4BFAA] px-3 py-1.5 text-xs font-semibold text-[#4B2E2B] disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
