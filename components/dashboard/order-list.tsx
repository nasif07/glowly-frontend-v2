"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Package, Search, Loader2 } from "lucide-react";

import { useOrders } from "@/hooks/use-orders";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DataPagination } from "@/components/dashboard/data-pagination";
import { usePagination } from "@/hooks/use-pagination";
import {
  OrderStatusControl,
  ORDER_STATUS_STYLES,
} from "@/components/forms/order-status-control";
import type { OrderStatus } from "@/types";

const ORDERS_PER_PAGE = 10;

const statusOptions: (OrderStatus | "all")[] = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderList() {
  const { data: orders = [], isLoading } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return orders
      .filter((order) => {
        const matchesSearch =
          (order.orderId ?? "").toLowerCase().includes(search) ||
          (order.shippingAddress?.name ?? "").toLowerCase().includes(search);
        const matchesStatus =
          statusFilter === "all" || order.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      );
  }, [orders, searchTerm, statusFilter]);

  const {
    page,
    setPage,
    pageItems: pagedOrders,
    reset: resetPage,
  } = usePagination(filteredOrders, ORDERS_PER_PAGE);

  // Changing the status tab or search shortens the list — go back to page 1
  // rather than stranding the admin past the end of it.
  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  return (
    <div className="min-h-screen md:p-4">
      <DashboardHeader title="Order Management" Icon={Package} />

      {/* Status Tabs */}
      <div className="mt-6 mb-6 flex flex-wrap gap-2">
        {statusOptions.map((status) => {
          const active = statusFilter === status;
          const count =
            status === "all"
              ? orders.length
              : orders.filter((o) => o.orderStatus === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
                active
                  ? "border-transparent bg-linear-to-r from-[#300332] to-[#8E1454] text-white shadow-[0_8px_20px_-10px_rgba(142,20,84,0.8)]"
                  : "border-[#EAD9E2] bg-white text-[#6B2D5C] hover:border-[#8E1454]/30 hover:bg-[#FBF4F7]"
              }`}
            >
              {status !== "all" && (
                <span
                  className={`h-2 w-2 rounded-full ${active ? "bg-white" : ORDER_STATUS_STYLES[status].dot}`}
                />
              )}
              {status}
              <span
                className={`rounded-full px-1.5 text-[10px] leading-4 ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-[#FBF4F7] text-[#8A6F80]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#B89AAC]" />
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name..."
          className="w-full rounded-2xl border border-[#EAD9E2] bg-white/90 py-3 pr-4 pl-12 shadow-[0_6px_20px_-16px_rgba(48,3,50,0.4)] outline-none transition-all placeholder:text-[#B89AAC] focus:border-[#8E1454]/40 focus:ring-4 focus:ring-[#8E1454]/10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center text-[#6B2D5C]">
          <Loader2 className="mb-2 h-8 w-8 animate-spin" />
          <p className="font-medium">Syncing orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EAD9E2] bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBF4F7]">
            <Package className="h-8 w-8 text-[#E3CFDA]" />
          </div>
          <h3 className="text-lg font-bold text-[#300332]">
            No orders match your search
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your filters or checking back later.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-[#EAD9E2] bg-white shadow-[0_10px_30px_-20px_rgba(48,3,50,0.35)] md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#EAD9E2] bg-linear-to-r from-[#FBF4F7] to-[#FBF3EA] text-[11px] tracking-widest text-[#8A6F80] uppercase">
                <tr>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5E9EF]">
                {pagedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-[#FBF4F7]/50"
                  >
                    <td className="px-6 py-4 font-mono text-[13px] font-semibold text-[#8E1454]">
                      {order.orderId || order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#300332]">
                          {order.shippingAddress?.name || "Guest"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-[#300332]">
                      ৳{(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusControl
                        id={order._id}
                        currentStatus={order.orderStatus}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/orders/details/${order._id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD9E2] px-3 py-1.5 text-xs font-semibold text-[#300332] transition-colors hover:border-transparent hover:bg-[#300332] hover:text-white"
                      >
                        <Eye size={15} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {pagedOrders.map((order) => (
              <div
                key={order._id}
                className="relative overflow-hidden rounded-2xl border border-[#EAD9E2] bg-white p-5"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-tighter text-gray-400 uppercase">
                      Order ID
                    </p>
                    <h3 className="font-mono font-bold text-[#300332]">
                      {order.orderId || order._id.slice(-8).toUpperCase()}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#300332]">
                      ৳{(order.totalAmount || 0).toLocaleString()}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toDateString()
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="mb-5 flex items-center gap-3 rounded-lg bg-[#FBF4F7] p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5E9EF] text-[12px] font-bold text-[#300332]">
                    {order.shippingAddress?.name?.charAt(0) || "G"}
                  </div>
                  <p className="text-sm font-bold text-[#6B2D5C]">
                    {order.shippingAddress?.name || "Guest Customer"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <OrderStatusControl
                      id={order._id}
                      currentStatus={order.orderStatus}
                    />
                  </div>
                  <Link
                    href={`/dashboard/orders/details/${order._id}`}
                    className="rounded-xl bg-[#FBE9F1] p-2.5 text-[#8E1454]"
                  >
                    <Eye size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <DataPagination
            page={page}
            totalItems={filteredOrders.length}
            pageSize={ORDERS_PER_PAGE}
            onChange={setPage}
            label="orders"
          />
        </>
      )}
    </div>
  );
}
