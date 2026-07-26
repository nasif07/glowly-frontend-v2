"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Package, Search, Loader2 } from "lucide-react";

import { useOrders } from "@/hooks/use-orders";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { OrderStatusControl } from "@/components/forms/order-status-control";
import type { OrderStatus } from "@/types";

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
        const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      );
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen md:p-4">
      <DashboardHeader title="Order Management" Icon={Package} />

      {/* Status Tabs */}
      <div className="mt-6 mb-6 flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
              statusFilter === status
                ? "border-[#4B2E2B] bg-[#4B2E2B] text-white"
                : "border-[#E0C9A6] bg-white text-[#6B4A3D] hover:bg-[#FDF8F3]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name..."
          className="w-full rounded-xl border border-[#E0C9A6] bg-white py-3 pr-4 pl-12 outline-none transition-all focus:ring-2 focus:ring-[#6B4A3D]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center text-[#6B4A3D]">
          <Loader2 className="mb-2 h-8 w-8 animate-spin" />
          <p className="font-medium">Syncing orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E0C9A6] bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF8F3]">
            <Package className="h-8 w-8 text-[#D4BFAA]" />
          </div>
          <h3 className="text-lg font-bold text-[#4B2E2B]">No orders match your search</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your filters or checking back later.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-[#E0C9A6] bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E0C9A6] bg-[#FDF8F3] text-[#4B2E2B]">
                <tr>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5E6D3]">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="transition-colors hover:bg-[#FDF8F3]/50">
                    <td className="px-6 py-4 font-mono text-[13px] text-[#4B2E2B]">
                      {order.orderId || order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#4B2E2B]">
                          {order.shippingAddress?.name || "Guest"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-[#4B2E2B]">
                      ৳{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusControl id={order._id} currentStatus={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/orders/details/${order._id}`}
                        className="inline-flex rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="relative overflow-hidden rounded-2xl border border-[#E0C9A6] bg-white p-5"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-tighter text-gray-400 uppercase">
                      Order ID
                    </p>
                    <h3 className="font-mono font-bold text-[#4B2E2B]">
                      {order.orderId || order._id.slice(-8).toUpperCase()}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#4B2E2B]">
                      ৳{order.totalAmount}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toDateString() : ""}
                    </span>
                  </div>
                </div>

                <div className="mb-5 flex items-center gap-3 rounded-lg bg-[#FDF8F3] p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFE3D1] text-[12px] font-bold text-[#4B2E2B]">
                    {order.shippingAddress?.name?.charAt(0) || "G"}
                  </div>
                  <p className="text-sm font-bold text-[#6B4A3D]">
                    {order.shippingAddress?.name || "Guest Customer"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <OrderStatusControl id={order._id} currentStatus={order.orderStatus} />
                  </div>
                  <Link
                    href={`/dashboard/orders/details/${order._id}`}
                    className="rounded-xl bg-blue-50 p-2.5 text-blue-600"
                  >
                    <Eye size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
