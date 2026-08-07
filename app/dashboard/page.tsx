"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Box,
  Clock,
  User,
  CheckCircle,
  TrendingUp,
  PlusCircle,
  ChevronRight,
  LayoutGrid,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useOrders } from "@/hooks/use-orders";
import { useUsers } from "@/hooks/use-users";
import Button from "@/components/common/button";
import type { Category, Order } from "@/types";

function countCategories(categories: Category[]): number {
  return categories.reduce(
    (sum, cat) => sum + 1 + countCategories(cat.children ?? []),
    0,
  );
}

/** Last 7 days of revenue, bucketed from the orders already on hand. */
function useWeeklySales(orders: Order[]) {
  return useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (6 - i));
      return start;
    });

    const totals = days.map((start) => {
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return orders.reduce((sum, o) => {
        if (!o.createdAt) return sum;
        const created = new Date(o.createdAt);
        return created >= start && created < end ? sum + o.totalAmount : sum;
      }, 0);
    });

    const max = Math.max(...totals, 1);
    return days.map((start, i) => ({
      label: start.toLocaleDateString("en-US", { weekday: "short" }),
      total: totals[i],
      height: totals[i] > 0 ? Math.max((totals[i] / max) * 100, 6) : 2,
    }));
  }, [orders]);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const logout = useLogout();

  const { data: productsPage } = useProducts({ limit: 1 });
  const { data: categories = [] } = useCategories();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

  const weeklySales = useWeeklySales(orders);

  const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;

  const stats = [
    {
      title: "Total Products",
      value: productsPage?.meta?.total ?? "—",
      icon: Package,
    },
    { title: "Categories", value: countCategories(categories), icon: Box },
    { title: "Pending Orders", value: pendingOrders, icon: Clock },
    { title: "Delivered", value: deliveredOrders, icon: CheckCircle },
    { title: "Total Users", value: users.length, icon: User },
  ];

  const actions = [
    {
      label: "New Product",
      icon: PlusCircle,
      path: "/dashboard/inventory/add-product",
      color: "bg-[#1A0D08]",
      sub: "Stock up new items",
    },
    {
      label: "Add Category",
      icon: LayoutGrid,
      path: "/dashboard/categories/add",
      color: "bg-[#4B2E2B]",
      sub: "Organize your store",
    },
    {
      label: "View Orders",
      icon: ShoppingBag,
      path: "/dashboard/orders",
      color: "bg-[#6B4A3D]",
      sub: `${pendingOrders} pending orders`,
    },
    {
      label: "Courier",
      icon: Truck,
      path: "/dashboard/courier",
      color: "bg-[#A67B5B]",
      sub: "Steadfast shipments & returns",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* --- HEADER --- */}
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#4B2E2B]">
            Dashboard
          </h1>
          <p className="mt-1 font-medium text-[#8C6A5E]">
            Welcome back, {user?.name || user?.email}. Here&apos;s what&apos;s
            happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/dashboard/inventory/add-product")}
            className="flex items-center justify-center gap-3"
          >
            <PlusCircle size={18} /> Add Product
          </Button>
          <Button variant="outline" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-[#E0C9A6]/50 bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-[#FBF6EF] p-2.5">
                <stat.icon className="h-5 w-5 text-[#4B2E2B]" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-[#4B2E2B]">{stat.value}</p>
              <p className="mt-1 text-xs font-bold tracking-wider text-[#A67B5B] uppercase">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* --- SALES OVERVIEW (real revenue, last 7 days) --- */}
        <div className="rounded-3xl border border-[#E0C9A6]/50 bg-white p-6 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#4B2E2B]">
              <TrendingUp className="h-5 w-5" /> Sales Performance
            </h3>
            <span className="text-[10px] font-bold tracking-widest text-[#A67B5B] uppercase">
              Last 7 days
            </span>
          </div>
          <div className="flex h-64 items-end justify-between gap-2 px-2">
            {weeklySales.map((day) => (
              <div
                key={day.label}
                className="relative flex-1 rounded-t-lg bg-[#FBF6EF]"
                title={`${day.label}: ৳${day.total.toLocaleString()}`}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-lg bg-[#E0C9A6] transition-all"
                  style={{ height: `${day.height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between px-2 text-[10px] font-bold tracking-widest text-[#A67B5B] uppercase">
            {weeklySales.map((day) => (
              <span key={day.label}>{day.label}</span>
            ))}
          </div>
        </div>

        {/* --- QUICK ACTIONS --- */}
        <div className="grid grid-cols-1 gap-4">
          {actions.map((btn) => (
            <Link
              key={btn.label}
              href={btn.path}
              className="group flex items-center justify-between rounded-2xl border border-[#E0C9A6]/50 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-[#1A0D08] active:scale-95"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`rounded-2xl p-3 ${btn.color} text-white shadow-lg transition-transform group-hover:rotate-6`}
                >
                  <btn.icon size={20} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-base leading-tight font-black text-[#1A0D08] uppercase">
                    {btn.label}
                  </p>
                  <p className="mt-1 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    {btn.sub}
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-stone-100 p-2 transition-colors group-hover:bg-[#1A0D08] group-hover:text-white">
                <ChevronRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  strokeWidth={4}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
