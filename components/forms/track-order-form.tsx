"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { Order } from "@/types";
import { useTrackOrder } from "@/hooks/use-orders";
import { GlowButton } from "@/components/forms/glow-button";

const statuses = ["pending", "processing", "shipped", "delivered"];

export function TrackOrderForm() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Manual (refetch-driven) query — mirrors the imperative search behaviour.
  const query = useTrackOrder(phone, false);
  const loading = query.isFetching;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    try {
      const res = await query.refetch();
      const list = (res.data ?? []).filter(Boolean) as Order[];
      if (list.length === 0) throw new Error("No orders");
      setOrders(list);
      setSelectedOrder(list.length === 1 ? list[0] : null);
      toast.success(`${list.length} order(s) found`);
    } catch {
      setOrders([]);
      setSelectedOrder(null);
      toast.error("No orders found for this number");
    }
  };

  const getStepIndex = (status?: string) =>
    statuses.indexOf(status?.toLowerCase() || "pending");

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 md:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-4 text-center md:mb-10">
          <h1 className="text-2xl font-bold tracking-widest text-stone-800 uppercase md:text-4xl">
            Track Your Orders
          </h1>
          <p className="mt-2 text-sm text-stone-500 md:text-lg">
            Enter your number to see your recent purchase history
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-2 rounded-3xl border border-stone-200 bg-white p-2 transition-all focus-within:border-stone-400 sm:flex-row"
        >
          <input
            type="tel"
            placeholder="Search by phone (e.g. 01XXXXXXXXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 text-stone-800 outline-none"
            required
          />
          <GlowButton type="submit" fullWidth disabled={loading} className="block md:hidden">
            {loading ? "..." : "Track"}
          </GlowButton>
          <GlowButton type="submit" disabled={loading} className="hidden md:block">
            {loading ? "..." : "Track"}
          </GlowButton>
        </form>

        {/* Results */}
        <div className="space-y-6">
          {orders.length > 1 && !selectedOrder && (
            <div className="animate-in fade-in slide-in-from-bottom-4 grid gap-4 duration-500">
              <h2 className="px-1 text-[12px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                Orders found ({orders.length})
              </h2>
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  onClick={() => setSelectedOrder(ord)}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-stone-800"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold tracking-tight text-stone-900">
                      #{ord.orderId?.toUpperCase() || "NEW"}
                    </p>
                    <p className="text-xs text-stone-500 uppercase italic">
                      {ord.orderStatus} — {ord.products?.length || 0} Items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1A0D08]">
                      {ord.totalAmount} BDT
                    </p>
                    <p className="mt-1 text-[12px] text-stone-400 uppercase">
                      View Details →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedOrder && (
            <div className="animate-in zoom-in-95 rounded-2xl border border-stone-200 bg-white p-6 duration-500 sm:p-10">
              {orders.length > 1 && (
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="mb-8 flex items-center gap-2 text-[12px] font-bold tracking-widest text-stone-400 uppercase hover:text-stone-800"
                >
                  <span className="text-lg">←</span> All Orders
                </button>
              )}

              {/* Order header */}
              <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-stone-100 pb-8 sm:flex-row sm:items-center">
                <div>
                  <span className="text-[12px] font-bold tracking-widest text-stone-400 uppercase">
                    Current Status
                  </span>
                  <h2 className="mt-1 text-2xl leading-none font-bold text-stone-900 uppercase italic">
                    {selectedOrder.orderStatus}
                  </h2>
                </div>
                <div className="w-full border border-stone-100 bg-stone-50 p-4 sm:w-auto sm:border-0 sm:bg-transparent sm:text-right">
                  <span className="text-[12px] font-bold tracking-widest text-stone-400 uppercase">
                    Order ID
                  </span>
                  <p className="font-montserrat mt-1 text-lg leading-none font-bold text-stone-800">
                    #{selectedOrder.orderId?.toUpperCase() || "PENDING"}
                  </p>
                </div>
              </div>

              {/* Progress tracker */}
              <div className="relative mb-6 pt-4 pb-12">
                <div className="absolute top-[35px] left-0 h-[1px] w-full bg-stone-200" />
                <div className="relative flex justify-between">
                  {statuses.map((step, index) => {
                    const isActive = getStepIndex(selectedOrder.orderStatus) >= index;
                    return (
                      <div key={step} className="flex flex-1 flex-col items-center">
                        <div
                          className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-all duration-700 ${
                            isActive ? "" : "border-stone-200 text-stone-300"
                          }`}
                        >
                          {isActive ? (
                            <CheckIcon />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        <span
                          className={`mt-3 text-[12px] font-bold tracking-widest uppercase ${isActive ? "text-stone-900" : "text-stone-300"}`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-1 gap-8 border-t border-stone-100 pt-8 sm:grid-cols-2">
                <div>
                  <h4 className="mb-4 text-[12px] font-bold tracking-widest text-stone-400 uppercase">
                    Package Contents
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.products?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between border-b border-stone-50 pb-2 text-[15px]"
                      >
                        <span className="text-[16px] font-medium text-stone-700">
                          {item.title}{" "}
                          <span className="ml-1 text-stone-400">
                            ×{item.quantity}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 bg-stone-50 p-6">
                  <div>
                    <span className="mb-1 block text-[9px] font-bold tracking-widest text-stone-400 uppercase">
                      Shipping To
                    </span>
                    <p className="font-medium text-stone-800">
                      {selectedOrder.shippingAddress?.name}
                    </p>
                    <p className="mt-1 text-stone-500">
                      {selectedOrder.shippingAddress?.address},{" "}
                      {selectedOrder.shippingAddress?.city}
                    </p>
                  </div>
                  <div className="border-t border-stone-200 pt-4">
                    <span className="mb-1 block text-[11px] font-bold tracking-widest text-stone-400 uppercase">
                      Order Value
                    </span>
                    <p className="font-montserrat text-lg font-bold text-[#1A0D08]">
                      {selectedOrder.totalAmount} BDT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
