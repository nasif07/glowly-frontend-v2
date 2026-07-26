"use client";

import { useMemo, useState } from "react";
import { Building2, Search } from "lucide-react";

import { useSteadfastPoliceStations } from "@/hooks/use-steadfast";
import { Input } from "@/components/ui/input";

export function PoliceStationsPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSteadfastPoliceStations();

  const filtered = useMemo(() => {
    const stations = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return stations;
    return stations.filter((s) => s.name?.toLowerCase().includes(q));
  }, [data, search]);

  return (
    <div className="rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl border border-[#300332]/10 bg-[#F9F1E7] p-2.5">
          <Building2 className="h-5 w-5 text-[#300332]" />
        </div>
        <h2 className="text-lg font-bold text-[#2D1B14]">Police Stations</h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8C6A5E]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by station name..."
          className="h-auto rounded-xl border border-[#D4BFAA] bg-[#FCFAF8] py-2.5 pl-10 text-sm text-[#4B2E2B] shadow-none focus-visible:border-[#6B4A3D] focus-visible:ring-4 focus-visible:ring-[#6B4A3D]/5"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-[#F3EEEA]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-[#8C6A5E]">No matching police stations.</p>
      ) : (
        <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="truncate rounded-lg border border-[#E8D8C3] bg-[#FDF8F3] px-3 py-2 text-xs text-[#4B2E2B]"
              title={s.name}
            >
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
