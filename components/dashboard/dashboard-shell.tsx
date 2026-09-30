"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Box,
  Menu,
  X,
  LogOut,
  Store,
  Package,
  Truck,
  Newspaper,
  Images,
  Settings2,
  Stethoscope,
  Droplets,
  Warehouse,
  ExternalLink,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useAuth, useLogout } from "@/hooks/use-auth";
import {
  NotificationAlerts,
  NotificationBell,
} from "@/components/dashboard/notifications";
import glowlyLogo from "@/public/glowly.png";

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
}

const navGroups: { label?: string; items: NavItem[] }[] = [
  {
    items: [{ name: "Overview", path: "/dashboard", icon: Home, exact: true }],
  },
  {
    label: "Sales",
    items: [
      { name: "Orders", path: "/dashboard/orders", icon: Package },
      { name: "Courier", path: "/dashboard/courier", icon: Truck },
      {
        name: "Consultations",
        path: "/dashboard/consultations",
        icon: Stethoscope,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      { name: "Inventory", path: "/dashboard/inventory", icon: Warehouse },
      { name: "Categories", path: "/dashboard/categories", icon: Box },
      { name: "Brands", path: "/dashboard/brands", icon: Store },
    ],
  },
  {
    label: "Storefront",
    items: [
      { name: "Hero Banner", path: "/dashboard/hero", icon: Images },
      { name: "Skin Types", path: "/dashboard/skin-types", icon: Droplets },
      { name: "Blog", path: "/dashboard/blog", icon: Newspaper },
    ],
  },
  {
    label: "Admin",
    items: [
      { name: "Users", path: "/dashboard/users", icon: User },
      { name: "Settings", path: "/dashboard/settings", icon: Settings2 },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

const isActive = (pathname: string, item: NavItem) =>
  item.exact
    ? pathname === item.path
    : pathname === item.path || pathname.startsWith(`${item.path}/`);

/**
 * Admin layout: a fixed sidebar (a drawer below `lg`) with grouped links, and
 * a sticky top bar holding the page title, notifications and the account
 * menu. Wraps every /dashboard/* page.
 *
 * The sidebar's link list scrolls on its own, so Logout stays pinned at the
 * bottom on short screens.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();

  const current = allItems.find((item) => isActive(pathname, item));

  // Close the drawer on navigation (covers back/forward too).
  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

  const sidebar = (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Soft glows + sparkles behind the menu */}
      <span className="pointer-events-none absolute -top-16 -right-20 h-56 w-56 rounded-full bg-[#F49AC2]/20 blur-3xl" />
      <span className="pointer-events-none absolute bottom-24 -left-24 h-56 w-56 rounded-full bg-[#C4891E]/15 blur-3xl" />
      <span className="pointer-events-none absolute top-5 right-6 text-xs text-[#E7B96A]/60">
        ✦
      </span>

      <div className="relative flex h-16 shrink-0 items-center justify-between px-6">
        <Link href="/dashboard" className="block">
          {/* Constrain by height — `w-auto` alone renders the 1286px source. */}
          <Image src={glowlyLogo} alt="Glowly" className="h-9 w-auto" />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
          className="rounded-lg p-1.5 text-[#D9C5B2] hover:bg-white/10 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="font-montserrat relative flex-1 overflow-y-auto px-3 py-2 [scrollbar-width:none]">
        {navGroups.map((group, i) => (
          <div key={group.label ?? i} className={i ? "mt-5" : undefined}>
            {group.label && (
              <p className="mb-1.5 flex items-center gap-1.5 px-3 text-[10px] font-bold tracking-[0.2em] text-[#E7B96A]/70 uppercase">
                <span className="text-[8px]">✦</span>
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                      active
                        ? "bg-linear-to-r from-[#FBF3EA] to-[#E8D3BC] font-semibold text-[#300332] shadow-[0_6px_18px_-8px_rgba(0,0,0,0.5)]"
                        : "text-[#F3E0EA]/70 hover:translate-x-0.5 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-1/2 -left-3 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#E7B96A]" />
                    )}
                    <item.icon
                      size={17}
                      strokeWidth={1.75}
                      className={active ? "text-[#8E1454]" : undefined}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative shrink-0 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 ring-1 ring-white/10 transition-colors hover:bg-white/15"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#E7B96A] to-[#C4891E] text-sm text-[#300332]">
            ✦
          </span>
          <span className="font-montserrat min-w-0 leading-tight">
            <span className="block text-xs font-bold text-white">
              Glowly Store
            </span>
            <span className="block text-[10px] text-[#F3E0EA]/60">
              Open the live shop
            </span>
          </span>
          <ExternalLink size={14} className="ml-auto text-[#F3E0EA]/60" />
        </Link>
        <button
          onClick={logout}
          className="font-montserrat flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/10 hover:text-red-200"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );

  // Printing (the order invoice) drops all of the chrome below.
  return (
    <div className="relative min-h-screen bg-[#FBF6F8] text-[#300332] print:min-h-0 print:bg-white">
      {/* Once per tab: turns new notifications into toasts / desktop alerts. */}
      <NotificationAlerts />

      {/* Page glow: rose top-right, gold bottom-left, fixed behind content. */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden print:hidden">
        <span className="absolute -top-40 right-0 h-112 w-md rounded-full bg-[#F49AC2]/15 blur-3xl" />
        <span className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#E7B96A]/10 blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-linear-to-b from-[#360718] via-[#8E1454] to-[#360718] lg:block print:hidden">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-linear-to-b from-[#360718] via-[#8E1454] to-[#360718] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden print:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs lg:hidden print:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="relative lg:pl-64 print:pl-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-white/75 px-4 backdrop-blur-xl md:px-8 print:hidden">
          {/* Brand hairline along the bottom edge */}
          <span className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-[#300332]/10 via-[#8E1454]/30 to-[#E7B96A]/40" />

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-1 rounded-lg p-2 text-[#300332] hover:bg-[#FBE9F1] lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 truncate text-lg leading-tight font-bold text-[#300332]">
              <span className="text-sm text-[#C4891E]">✦</span>
              {current?.name ?? "Dashboard"}
            </p>
            <p className="font-montserrat hidden text-[10px] font-semibold tracking-[0.2em] text-[#A1887F] uppercase sm:block">
              Glowly Admin
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="font-montserrat hidden items-center gap-1.5 rounded-full border border-[#300332]/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#300332] transition-colors hover:border-[#8E1454]/30 hover:bg-[#FBE9F1] sm:flex"
          >
            <ExternalLink size={14} /> View store
          </Link>

          <NotificationBell />

          <AccountMenu onLogout={logout} />
        </header>

        <main className="font-montserrat p-4 md:p-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function AccountMenu({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  // The user comes from localStorage; render it only after hydration.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = (mounted && (user?.name || user?.fullName)) || "Admin";
  const email = mounted ? user?.email : undefined;

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-[#FBE9F1]"
      >
        <span className="font-montserrat flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#300332] to-[#8E1454] text-xs font-bold text-[#F3E9DC] uppercase ring-2 ring-[#E7B96A]/60 ring-offset-1">
          {name.charAt(0)}
        </span>
        <span className="font-montserrat hidden max-w-32 truncate text-sm font-semibold text-[#300332] md:block">
          {name.split(" ")[0]}
        </span>
        <ChevronDown size={14} className="hidden text-[#8D6E63] md:block" />
      </button>

      {open && (
        <div
          role="menu"
          className="font-montserrat absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[#EFE6DC] bg-white shadow-xl"
        >
          <div className="border-b border-[#F3E9DC] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#300332]">
              {name}
            </p>
            {email && (
              <p className="truncate text-xs text-[#8D6E63]">{email}</p>
            )}
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#300332] hover:bg-[#FBF3F7]"
          >
            <User size={16} /> Profile
          </Link>
          <Link
            href="/"
            target="_blank"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#300332] hover:bg-[#FBF3F7] sm:hidden"
          >
            <ExternalLink size={16} /> View store
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 border-t border-[#F3E9DC] px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
