"use client";

import { useState } from "react";
import { Search, Truck } from "lucide-react";
import { toast } from "sonner";

import { useTrackSteadfastOrder } from "@/hooks/use-steadfast";
import { getErrorMessage } from "@/lib/api-error";
import type { SteadfastStatusResponse, SteadfastTrackIdentifier } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlowButton } from "@/components/forms/glow-button";
import { DeliveryStatusBadge } from "./status-badge";

type SearchBy = "consignmentId" | "invoice" | "trackingCode";

const SEARCH_BY_LABEL: Record<SearchBy, string> = {
  consignmentId: "Consignment ID",
  invoice: "Invoice",
  trackingCode: "Tracking Code",
};

export function TrackOrderPanel() {
  const [searchBy, setSearchBy] = useState<SearchBy>("invoice");
  const [value, setValue] = useState("");
  const [identifier, setIdentifier] = useState<SteadfastTrackIdentifier>({});
  const [result, setResult] = useState<SteadfastStatusResponse | null>(null);

  const query = useTrackSteadfastOrder(identifier, false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const nextIdentifier: SteadfastTrackIdentifier = { [searchBy]: value.trim() };
    setIdentifier(nextIdentifier);
    setResult(null);

    try {
      const res = await query.refetch();
      if (res.error) throw res.error;
      if (!res.data) throw new Error("Not found");
      setResult(res.data);
    } catch (error) {
      toast.error(getErrorMessage(error, "No matching order found"));
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl border border-[#300332]/10 bg-[#F9F1E7] p-2.5">
          <Truck className="h-5 w-5 text-[#300332]" />
        </div>
        <h2 className="text-lg font-bold text-[#2D1B14]">Track Delivery Status</h2>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <Select value={searchBy} onValueChange={(v) => setSearchBy(v as SearchBy)}>
          <SelectTrigger className="h-auto rounded-xl border border-[#D4BFAA] bg-[#FCFAF8] px-4 py-2.5 text-sm text-[#4B2E2B] sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SEARCH_BY_LABEL) as SearchBy[]).map((key) => (
              <SelectItem key={key} value={key}>
                {SEARCH_BY_LABEL[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${SEARCH_BY_LABEL[searchBy].toLowerCase()}`}
          className="h-auto flex-1 rounded-xl border border-[#D4BFAA] bg-[#FCFAF8] px-4 py-2.5 text-sm text-[#4B2E2B] shadow-none focus-visible:border-[#6B4A3D] focus-visible:ring-4 focus-visible:ring-[#6B4A3D]/5"
        />

        <GlowButton
          type="submit"
          disabled={query.isFetching}
          className="rounded-xl bg-[#4B2E2B] px-6 py-2.5 text-xs font-bold tracking-widest text-white uppercase shadow-none hover:bg-[#321E1B]"
        >
          <Search size={14} /> {query.isFetching ? "Searching..." : "Search"}
        </GlowButton>
      </form>

      {result && (
        <div className="mt-6 rounded-2xl border border-[#E8D8C3] bg-[#FDF8F3] p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wide text-[#8C6A5E] uppercase">
              Delivery Status
            </p>
            <DeliveryStatusBadge status={result.delivery_status} />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-[#4B2E2B] sm:grid-cols-3">
            {result.consignment_id !== undefined && (
              <p>
                <span className="font-semibold">Consignment ID:</span>{" "}
                {result.consignment_id}
              </p>
            )}
            {result.invoice && (
              <p>
                <span className="font-semibold">Invoice:</span> {result.invoice}
              </p>
            )}
            {result.tracking_code && (
              <p>
                <span className="font-semibold">Tracking Code:</span>{" "}
                {result.tracking_code}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
