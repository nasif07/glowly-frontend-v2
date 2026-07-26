"use client";

import { useState, type ReactNode } from "react";
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
} from "lucide-react";
import { useLogout } from "@/hooks/use-auth";
import glowlyLogo from "@/public/glowly.png";

const navItems = [
  { name: "Overview", path: "/dashboard", icon: Home, exact: true },
  { name: "Users", path: "/dashboard/users", icon: User },
  { name: "Categories", path: "/dashboard/categories", icon: Box },
  { name: "Brands", path: "/dashboard/brands", icon: Store },
  { name: "Inventory", path: "/dashboard/inventory", icon: Store },
  { name: "Orders", path: "/dashboard/orders", icon: Package },
  { name: "Courier", path: "/dashboard/courier", icon: Truck },
  { name: "Profile", path: "/profile", icon: User },
];

/**
 * Persistent admin sidebar (desktop) + top bar/drawer (mobile), ported from
 * the original app's DashboardLayout. Wraps every /dashboard/* page.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();

  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname.startsWith(path);

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="font-montserrat flex-1 space-y-1.5 px-2">
      {navItems.map((item) => {
        const active = isActive(item.path, item.exact);
        return (
          <Link
            key={item.name}
            href={item.path}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
              active
                ? "bg-[#D9C5B2] font-bold text-[#300332] shadow-lg shadow-black/20"
                : "text-[#D9C5B2]/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon size={18} strokeWidth={1.5} className="opacity-70" />
            <span className="text-sm tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen text-[#300332]">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-50 hidden h-full w-64 flex-col bg-[#300332] lg:flex">
        <div className="flex h-full flex-col p-8">
          <Link href="/" className="mb-12 flex items-center gap-3 px-2">
            <Image src={glowlyLogo} alt="Glowly Logo" className="h-auto w-auto" />
          </Link>

          <div className="mb-4 px-4 text-[10px] font-bold tracking-[0.3em] text-[#D9C5B2]/30 uppercase">
            Management
          </div>

          <NavLinks />

          <div className="mt-auto border-t border-white/5 pt-6">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-400/10"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-[#D9C5B2]/20 bg-[#300332] px-6 lg:hidden">
        <Link href="/">
          <Image src={glowlyLogo} alt="Glowly Logo" className="h-10 w-auto" />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg bg-[#300332] p-2 text-white"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[999] flex h-full w-72 flex-col bg-[#300332] p-4 transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="mb-10 flex items-center justify-between">
          <Image src={glowlyLogo} alt="Glowly Logo" className="h-10 w-auto" />
          <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <X className="text-[#D9C5B2]" size={24} />
          </button>
        </div>
        <NavLinks mobile />
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-4 py-3 font-medium text-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="min-h-screen flex-1 overflow-y-auto lg:ml-64">
        <div className="p-6 pt-24 lg:p-10 lg:pt-10">{children}</div>
      </main>
    </div>
  );
}
