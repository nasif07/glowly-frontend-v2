"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, ImageIcon, Loader2, Search, Stethoscope } from "lucide-react";

import { useConsultations } from "@/hooks/use-consultations";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DataPagination } from "@/components/dashboard/data-pagination";
import {
  CONSULTATION_STATUS_LABEL,
  ConsultationStatusBadge,
} from "@/components/dashboard/consultation-status";
import { SKIN_TYPE_LABEL } from "@/lib/consultation-i18n";
import { CONSULTATION_STATUSES, type ConsultationStatus } from "@/types";

const PAGE_SIZE = 15;

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export function ConsultationList() {
  const [status, setStatus] = useState<ConsultationStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(searchTerm.trim(), 350);

  // Filtering shortens the list — go back to its first page.
  useEffect(() => setPage(1), [status, search]);

  const { data, isLoading, isFetching } = useConsultations({
    status: status === "all" ? undefined : status,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const rows = data?.data ?? [];
  const meta = data?.meta;
  const totalAll = meta
    ? Object.values(meta.counts).reduce((sum, n) => sum + n, 0)
    : 0;

  return (
    <div className="min-h-screen md:p-4">
      <DashboardHeader title="Skin Consultations" Icon={Stethoscope} />

      {/* Status tabs, with counts */}
      <div className="mt-6 mb-6 flex flex-wrap gap-2">
        {(["all", ...CONSULTATION_STATUSES] as const).map((option) => (
          <button
            key={option}
            onClick={() => setStatus(option)}
            className={`rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
              status === option
                ? "border-[#300332] bg-[#300332] text-white"
                : "border-[#EAD9E2] bg-white text-[#6B2D5C] hover:bg-[#FBF4F7]"
            }`}
          >
            {option === "all" ? "All" : CONSULTATION_STATUS_LABEL[option]}
            {meta && (
              <span className="ml-1.5 opacity-70">
                {option === "all" ? totalAll : meta.counts[option]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, WhatsApp number or ID…"
          className="w-full rounded-xl border border-[#EAD9E2] bg-white py-3 pr-4 pl-12 outline-none transition-all focus:ring-2 focus:ring-[#6B2D5C]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isFetching && !isLoading && (
          <Loader2 className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center text-[#6B2D5C]">
          <Loader2 className="mb-2 h-8 w-8 animate-spin" />
          <p className="font-medium">Loading consultations…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EAD9E2] bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBF4F7]">
            <Stethoscope className="h-8 w-8 text-[#E3CFDA]" />
          </div>
          <h3 className="text-lg font-bold text-[#300332]">No consultations here</h3>
          <p className="mt-1 text-sm text-gray-500">
            New requests from the Skin Consultation page appear under “New”.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-[#EAD9E2] bg-white md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-[#EAD9E2] bg-[#FBF4F7] text-[#300332]">
                <tr>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Concern</th>
                  <th className="px-6 py-4 font-bold">Skin type</th>
                  <th className="px-6 py-4 font-bold">Photos</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Received</th>
                  <th className="px-6 py-4 text-right font-bold">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FBF4F7]">
                {rows.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FBF4F7]/40">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#300332]">{c.name}</p>
                      <p className="font-mono text-xs text-gray-500">
                        {c.whatsapp} · {c.consultationId}
                      </p>
                    </td>
                    <td className="max-w-[260px] px-6 py-4">
                      <p className="line-clamp-2 text-gray-600">{c.concern}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {c.skinType ? SKIN_TYPE_LABEL[c.skinType].en : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <ImageIcon size={14} />
                        {c.photosPurgedAt ? "Deleted" : c.photoCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ConsultationStatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/consultations/details/${c._id}`}
                        className="inline-flex rounded-xl p-2 text-[#6B2D5C] transition-colors hover:bg-[#FBF4F7]"
                        aria-label={`View consultation from ${c.name}`}
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {rows.map((c) => (
              <Link
                key={c._id}
                href={`/dashboard/consultations/details/${c._id}`}
                className="rounded-2xl border border-[#EAD9E2] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[#300332]">{c.name}</p>
                    <p className="font-mono text-xs text-gray-500">{c.whatsapp}</p>
                  </div>
                  <ConsultationStatusBadge status={c.status} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{c.concern}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {formatDate(c.createdAt)} ·{" "}
                  {c.photosPurgedAt ? "photos deleted" : `${c.photoCount} photo(s)`}
                </p>
              </Link>
            ))}
          </div>

          <DataPagination
            page={page}
            totalItems={meta?.total ?? 0}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            label="consultations"
          />
        </>
      )}
    </div>
  );
}
