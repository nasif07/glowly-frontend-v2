"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Home,
  ShoppingBag,
  X,
  Package,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCartCount } from "@/hooks/use-cart";
import { useMobileSearch } from "@/hooks/use-ui-store";
import { trackSearch } from "@/lib/pixel";
import glowlyLogo from "@/public/glowly.png";

const desktopNav = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "About", path: "/about" },
  { label: "Track Order", path: "/track-order" },
];

const mobileBottomNav = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Shop", icon: ShoppingBag, path: "/shop" },
  { label: "Cart", icon: ShoppingCart, path: "/cart", isCart: true },
  { label: "Track Order", icon: Package, path: "/track-order" },
];

const Navbar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    isOpen: isMobileSearchOpen,
    set: setIsMobileSearchOpen,
    toggle: toggleMobileSearch,
  } = useMobileSearch();

  // Cart count now comes from the Zustand cart store (single source of truth).
  const cartCountRaw = useCartCount();

  // Defer user- and store-derived UI to the client to avoid SSR/hydration
  // mismatches (the server has no localStorage).
  useEffect(() => setMounted(true), []);
  const currentUser = mounted ? user : null;
  const cartCount = mounted ? cartCountRaw : 0;

  useEffect(() => {
    const handleScroll = () => {
      // Small threshold for immediate feedback, larger for major state change
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      trackSearch(search.trim());
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <>
      <div className="bg-[#240226] text-[#D9C5B2] py-2.5 px-6 text-center text-[11px] tracking-[0.2em] uppercase font-bold border-b border-white/5 relative z-[60]">
        Your favorite online skincare shop
      </div>

      <header
        className={`w-full sticky top-0 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) border-b ${
          isScrolled
            ? "bg-[#300332]/90 backdrop-blur-xl py-2 border-white/10 shadow-2xl"
            : "bg-[#300332] py-5 border-transparent"
        }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between h-12 md:h-14 gap-4">
            {/* Logo Container with Smooth Scaling */}
            <div
              className={`flex-shrink-0 transition-all duration-500 ease-out transform-gpu ${isMobileSearchOpen ? "hidden md:block" : "block"} ${isScrolled ? "scale-90" : "scale-100"}`}>
              <Link href="/" className="block">
                <Image
                  src={glowlyLogo}
                  className="h-10 md:h-12 w-auto object-contain"
                  alt="Glowly"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation - Refined Spacing */}
            <nav className="hidden lg:flex items-center gap-10">
              {desktopNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`text-[14px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 hover:text-[#D9C5B2] relative py-1 group ${
                    pathname === item.path ? "text-[#D9C5B2]" : "text-white"
                  }`}>
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#D9C5B2] transition-all duration-500 ease-in-out ${pathname === item.path ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </Link>
              ))}
            </nav>

            {/* Search Section - Smooth Width Transition */}
            <div
              className={`flex items-center transition-all duration-500 ease-in-out ${isMobileSearchOpen ? "flex-1 scale-[1.02]" : "flex-shrink-0"}`}>
              <form
                onSubmit={handleSearch}
                className={`${isMobileSearchOpen ? "flex w-full" : "hidden md:flex"} md:w-64 lg:w-72 relative group`}>
                <input
                  type="text"
                  autoFocus={isMobileSearchOpen}
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-[15px] text-white pl-5 pr-12 py-2.5 rounded-2xl transition-all duration-300 focus:outline-none focus:border-[#D9C5B2] focus:bg-white/10 placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D9C5B2] transition-transform hover:scale-110">
                  <Search size={18} strokeWidth={2.5} />
                </button>
              </form>

              {/* Mobile Search/Close Toggle */}
              <div className="md:hidden flex items-center ml-auto">
                <button
                  onClick={toggleMobileSearch}
                  className="p-3 text-[#D9C5B2] active:scale-75 transition-all duration-200">
                  {isMobileSearchOpen ? (
                    <X size={28} strokeWidth={2} />
                  ) : (
                    <Search size={24} />
                  )}
                </button>
              </div>
            </div>

            {/* Icons Group */}
            <div
              className={`flex items-center gap-6 ${isMobileSearchOpen ? "hidden md:flex" : "flex"}`}>
              <Link
                href={
                  !currentUser
                    ? "/login"
                    : currentUser.role === "admin"
                      ? "/dashboard"
                      : "/profile"
                }
                className="group flex items-center gap-2.5">
                <div className="relative">
                  <User
                    size={24}
                    className="text-white group-hover:text-[#D9C5B2] transition-colors duration-300"
                  />
                  {currentUser && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-[#300332] rounded-full" />
                  )}
                </div>
                {currentUser && (
                  <span className="hidden xl:block text-[11px] font-bold text-white uppercase tracking-tighter">
                    {currentUser?.name?.split(" ")[0]}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative group p-1 transition-transform hover:scale-105 active:scale-95">
                <ShoppingCart
                  size={24}
                  className="text-white group-hover:text-[#D9C5B2] transition-colors duration-300"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D9C5B2] text-[#300332] text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav - Floating Style for smoothness */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-[#300332]/80 backdrop-blur-xl border border-white/10 z-50 rounded-3xl px-2 shadow-2xl overflow-hidden">
        <div className="flex justify-around items-center h-16">
          {mobileBottomNav.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.path}
                className="flex flex-col items-center justify-center flex-1 transition-all active:scale-90">
                <div
                  className={`relative pt-2 px-2 rounded-2xl transition-all duration-300`}>
                  <Icon
                    size={22}
                    className={isActive ? "text-[#D9C5B2]" : "text-white/40"}
                  />
                  {item.isCart && cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#D9C5B2] text-[#300332] text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] mt-1 font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-[#D9C5B2]" : "text-white/40"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
