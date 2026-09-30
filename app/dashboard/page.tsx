"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useOrders } from "@/hooks/use-orders";
import { useUsers } from "@/hooks/use-users";
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

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: productsPage } = useProducts({ limit: 1 });
  const { data: categories = [] } = useCategories();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

  const weeklySales = useWeeklySales(orders);
  const weekTotal = weeklySales.reduce((sum, d) => sum + d.total, 0);

  // Name, greeting and date depend on the browser (localStorage, clock), so
  // render them after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const firstName = mounted
    ? (user?.name || user?.fullName || "").split(" ")[0]
    : "";

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "pending",
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === "delivered",
  ).length;

  const stats = [
    {
      title: "Total Products",
      value: productsPage?.meta?.total ?? "—",
      icon: Package,
      tint: "from-[#300332] to-[#8E1454]",
    },
    {
      title: "Categories",
      value: countCategories(categories),
      icon: Box,
      tint: "from-[#8E1454] to-[#E26AA0]",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      tint: "from-[#C4891E] to-[#E7B96A]",
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle,
      tint: "from-[#1F7A5C] to-[#4FB58E]",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: User,
      tint: "from-[#5B2A86] to-[#9B6BCB]",
    },
  ];

  const actions = [
    {
      label: "New Product",
      icon: PlusCircle,
      path: "/dashboard/inventory/add-product",
      tint: "from-[#300332] to-[#8E1454]",
      sub: "Stock up new items",
    },
    {
      label: "Add Category",
      icon: LayoutGrid,
      path: "/dashboard/categories/add",
      tint: "from-[#8E1454] to-[#E26AA0]",
      sub: "Organize your store",
    },
    {
      label: "View Orders",
      icon: ShoppingBag,
      path: "/dashboard/orders",
      tint: "from-[#C4891E] to-[#E7B96A]",
      sub: `${pendingOrders} pending orders`,
    },
    {
      label: "Courier",
      icon: Truck,
      path: "/dashboard/courier",
      tint: "from-[#5B2A86] to-[#9B6BCB]",
      sub: "Steadfast shipments & returns",
    },
  ];

  return (
    <div>
      {/* --- WELCOME BANNER --- */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-[#360718] via-[#8E1454] to-[#360718] p-6 text-white shadow-[0_20px_50px_-24px_rgba(142,20,84,0.8)] md:p-8">
        <span className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-[#F49AC2]/30 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#E7B96A]/25 blur-3xl" />
        <span className="pointer-events-none absolute top-6 right-8 text-2xl text-[#E7B96A]/80">
          ✦
        </span>
        <span className="pointer-events-none absolute top-16 right-20 text-sm text-[#F3E0EA]/60">
          ✦
        </span>

        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#E7B96A] uppercase">
              {mounted
                ? new Date().toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : " "}
            </p>
            <h1 className="mt-2 font-sans text-3xl font-bold md:text-4xl">
              {mounted ? greeting() : "Welcome"}
              {firstName && `, ${firstName}`}
            </h1>
            <p className="mt-1 text-sm text-[#F3E0EA]/80">
              {pendingOrders > 0
                ? `You have ${pendingOrders} pending order${pendingOrders === 1 ? "" : "s"} waiting.`
                : "Everything is caught up. Keep glowing!"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="text-[10px] font-bold tracking-widest text-[#F3E0EA]/70 uppercase">
                Last 7 days
              </p>
              <p className="text-xl font-black">
                ৳{weekTotal.toLocaleString()}
              </p>
            </div>
            <Link
              href="/dashboard/inventory/add-product"
              className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#F3E9DC] to-[#E7B96A] px-4 py-3 text-sm font-bold text-[#300332] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <PlusCircle size={18} /> Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl border border-[#F0E3EA] bg-white/90 p-5 shadow-[0_8px_24px_-16px_rgba(48,3,50,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(48,3,50,0.45)]"
          >
            <span
              className={`pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-linear-to-br opacity-10 transition-opacity group-hover:opacity-20 ${stat.tint}`}
            />
            <div
              className={`mb-4 inline-flex rounded-xl bg-linear-to-br p-2.5 text-white shadow-md ${stat.tint}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-[#300332]">{stat.value}</p>
            <p className="mt-1 text-[11px] font-bold tracking-wider text-[#A1887F] uppercase">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* --- SALES OVERVIEW (real revenue, last 7 days) --- */}
        <div className="rounded-3xl border border-[#F0E3EA] bg-white/90 p-6 shadow-[0_8px_24px_-16px_rgba(48,3,50,0.35)] lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#300332]">
              <span className="rounded-lg bg-[#FBE9F1] p-1.5 text-[#8E1454]">
                <TrendingUp className="h-4 w-4" />
              </span>
              Sales Performance
            </h3>
            <span className="rounded-full bg-[#FBF3EA] px-3 py-1 text-[10px] font-bold tracking-widest text-[#C4891E] uppercase">
              Last 7 days
            </span>
          </div>
          <div className="flex h-64 items-end justify-between gap-2 px-2">
            {weeklySales.map((day) => (
              <div
                key={day.label}
                className="group relative h-full flex-1 rounded-t-xl bg-[#FBF3F7]"
                title={`${day.label}: ৳${day.total.toLocaleString()}`}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-xl bg-linear-to-t from-[#300332] via-[#8E1454] to-[#F49AC2] transition-all group-hover:brightness-110"
                  style={{ height: `${day.height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between px-2 text-[10px] font-bold tracking-widest text-[#A1887F] uppercase">
            {weeklySales.map((day) => (
              <span key={day.label} className="flex-1 text-center">
                {day.label}
              </span>
            ))}
          </div>
        </div>

        {/* --- QUICK ACTIONS --- */}
        <div className="grid grid-cols-1 gap-3">
          {actions.map((btn) => (
            <Link
              key={btn.label}
              href={btn.path}
              className="group flex items-center justify-between rounded-2xl border border-[#F0E3EA] bg-white/90 p-4 text-left shadow-[0_8px_24px_-18px_rgba(48,3,50,0.35)] transition-all hover:-translate-y-0.5 hover:border-[#8E1454]/30 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-xl bg-linear-to-br p-3 text-white shadow-md transition-transform group-hover:rotate-6 ${btn.tint}`}
                >
                  <btn.icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm leading-tight font-bold text-[#300332] uppercase">
                    {btn.label}
                  </p>
                  <p className="mt-1 text-[10px] font-bold tracking-widest text-[#A1887F] uppercase">
                    {btn.sub}
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-[#FBF3F7] p-2 text-[#300332] transition-colors group-hover:bg-[#300332] group-hover:text-white">
                <ChevronRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={3}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
