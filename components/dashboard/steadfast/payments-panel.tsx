"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CreditCard, X } from "lucide-react";

import { useSteadfastPayment, useSteadfastPayments } from "@/hooks/use-steadfast";

const PER_PAGE = 10;

export function PaymentsPanel() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useSteadfastPayments({ page, per_page: PER_PAGE });
  const { data: detail, isLoading: isDetailLoading } = useSteadfastPayment(
    selectedId ?? "",
  );

  const payments = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl border border-[#300332]/10 bg-[#F9F1E7] p-2.5">
          <CreditCard className="h-5 w-5 text-[#300332]" />
        </div>
        <h2 className="text-lg font-bold text-[#2D1B14]">Payments</h2>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F3EEEA]" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <p className="text-sm text-[#8C6A5E]">No payment records yet.</p>
      ) : (
        <div className="space-y-2">
          {payments.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(String(p.id))}
              className="flex w-full items-center justify-between rounded-xl border border-[#E8D8C3] bg-[#FDF8F3] px-4 py-3 text-left transition-colors hover:border-[#300332]/30"
            >
              <span className="text-sm font-semibold text-[#4B2E2B]">
                Payment #{p.id}
              </span>
              <span className="flex items-center gap-3 text-xs text-[#8C6A5E]">
                {p.amount !== undefined && <span>৳{Number(p.amount).toLocaleString()}</span>}
                {p.created_at && <span>{p.created_at}</span>}
              </span>
            </button>
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
          disabled={meta?.totalPage ? page >= meta.totalPage : payments.length < PER_PAGE}
          className="flex items-center gap-1 rounded-full border border-[#D4BFAA] px-3 py-1.5 text-xs font-semibold text-[#4B2E2B] disabled:opacity-40"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>

      {selectedId && (
        <div className="mt-6 rounded-2xl border border-[#E8D8C3] bg-[#FDF8F3] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold tracking-wide text-[#4B2E2B] uppercase">
              Payment #{selectedId} Consignments
            </p>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close"
              className="text-[#8C6A5E] hover:text-[#4B2E2B]"
            >
              <X size={16} />
            </button>
          </div>

          {isDetailLoading ? (
            <div className="h-16 animate-pulse rounded-lg bg-[#F3EEEA]" />
          ) : detail?.consignments?.length ? (
            <div className="space-y-2">
              {detail.consignments.map((c, i) => (
                <pre
                  key={i}
                  className="overflow-x-auto rounded-lg bg-white p-3 text-[11px] text-[#4B2E2B]"
                >
                  {JSON.stringify(c, null, 2)}
                </pre>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8C6A5E]">No consignments on this payment.</p>
          )}
        </div>
      )}
    </div>
  );
}
