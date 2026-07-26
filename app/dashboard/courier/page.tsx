"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  BalanceCard,
  BulkOrderForm,
  CreateOrderForm,
  PaymentsPanel,
  PoliceStationsPanel,
  ReturnRequestsPanel,
  TrackOrderPanel,
} from "@/components/dashboard/steadfast";

const TABS = [
  { key: "create", label: "Create Order" },
  { key: "bulk", label: "Bulk Order" },
  { key: "track", label: "Track" },
  { key: "returns", label: "Returns" },
  { key: "payments", label: "Payments" },
  { key: "police", label: "Police Stations" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function CourierDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("create");

  return (
    <div className="min-h-screen p-4 md:p-6">
      <DashboardHeader
        title="Steadfast Courier"
        Icon={Truck}
        onBack={() => router.back()}
      />

      <div className="mx-auto max-w-5xl space-y-6">
        <BalanceCard />

        <div className="flex flex-wrap gap-2 rounded-2xl border border-[#E8D8C3] bg-white p-2 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wide uppercase transition-all ${
                tab === t.key
                  ? "bg-[#300332] text-white"
                  : "text-[#4B2E2B] hover:bg-[#F9F1E7]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "create" && <CreateOrderForm />}
        {tab === "bulk" && <BulkOrderForm />}
        {tab === "track" && <TrackOrderPanel />}
        {tab === "returns" && <ReturnRequestsPanel />}
        {tab === "payments" && <PaymentsPanel />}
        {tab === "police" && <PoliceStationsPanel />}
      </div>
    </div>
  );
}
