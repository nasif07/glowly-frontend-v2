"use client";

import { RefreshCw, Wallet } from "lucide-react";
import { useSteadfastBalance } from "@/hooks/use-steadfast";
import { getErrorMessage } from "@/lib/api-error";

/** Current Steadfast account balance, with a manual refresh action. */
export function BalanceCard() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useSteadfastBalance();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-28 w-28 rounded-full bg-[#F9F1E7] opacity-60" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-[#300332]/10 bg-[#F9F1E7] p-3">
            <Wallet className="h-5 w-5 text-[#300332]" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#8C6A5E] uppercase">
              Steadfast Balance
            </p>
            {isLoading ? (
              <div className="mt-1 h-7 w-28 animate-pulse rounded bg-[#F3EEEA]" />
            ) : isError ? (
              <p className="mt-1 text-sm text-red-500">
                {getErrorMessage(error, "Failed to load balance")}
              </p>
            ) : (
              <p className="mt-1 text-2xl font-bold text-[#2D1B14]">
                ৳{Number(data?.current_balance ?? 0).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="group rounded-full border border-[#300332]/10 bg-white p-2.5 transition-all hover:bg-[#F9F1E7] disabled:opacity-50"
          aria-label="Refresh balance"
        >
          <RefreshCw
            className={`h-4 w-4 text-[#300332] ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
