"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowRight, PackageSearch } from "lucide-react";

import { useProducts } from "@/hooks/use-products";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { trackSearch } from "@/lib/pixel";
import type { Product } from "@/types";

/** Below this the popup stays shut — one letter matches half the catalogue. */
const MIN_QUERY = 2;
const MAX_RESULTS = 6;

interface NavSearchProps {
  /** Mobile search drawer state — drives the responsive width only. */
  isMobileOpen: boolean;
  /** Fired after a result or "see all" navigates, so the navbar can close. */
  onNavigate: () => void;
}

/**
 * Navbar search box with a live suggestion popup. Owns its own query state;
 * the navbar only tells it whether the mobile drawer is open.
 */
export function NavSearch({ isMobileOpen, onNavigate }: NavSearchProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const term = useDebouncedValue(search.trim(), 300);
  const enabled = term.length >= MIN_QUERY;

  const { data, isFetching } = useProducts(
    { search: term, limit: MAX_RESULTS },
    { enabled },
  );

  const results = enabled ? (data?.data ?? []) : [];
  const showPopup = isOpen && enabled;

  // A new term invalidates whatever row was highlighted.
  useEffect(() => setActiveIndex(-1), [term]);

  // Click anywhere else dismisses the popup.
  useEffect(() => {
    if (!showPopup) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPopup]);

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const goToProduct = (product: Product) => {
    router.push(`/products/${product.slug || product._id}`);
    setSearch("");
    close();
    onNavigate();
  };

  const goToShop = () => {
    const query = search.trim();
    if (!query) return;
    router.push(`/shop?search=${encodeURIComponent(query)}`);
    trackSearch(query);
    setSearch("");
    close();
    onNavigate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) goToProduct(results[activeIndex]);
    else goToShop();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (!showPopup || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${isMobileOpen ? "flex w-full" : "hidden md:flex"} relative md:w-64 lg:w-72`}
    >
      <form onSubmit={handleSubmit} className="group relative w-full">
        <input
          type="text"
          autoFocus={isMobileOpen}
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showPopup}
          aria-controls="nav-search-results"
          aria-autocomplete="list"
          /* The home header is transparent over the hero image, so the field
             needs its own dark surface — a white tint alone disappears. */
          className="w-full rounded-2xl border border-white/25 bg-[#300332]/45 py-2.5 pr-12 pl-5 text-[15px] text-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 placeholder:text-white/60 focus:border-[#D9C5B2] focus:bg-[#300332]/70 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute top-1/2 right-4 -translate-y-1/2 text-[#D9C5B2] transition-transform hover:scale-110"
        >
          {isFetching && enabled ? (
            <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
          ) : (
            <Search size={18} strokeWidth={2.5} />
          )}
        </button>
      </form>

      {showPopup && (
        <div
          id="nav-search-results"
          role="listbox"
          className="absolute top-full right-0 left-0 z-60 mt-3 max-h-[70vh] overflow-y-auto rounded-2xl border border-[#E8D8C3] bg-white shadow-[0_24px_60px_-20px_rgba(48,3,50,0.45)]"
        >
          {results.length === 0 ? (
            <div className="px-5 py-8 text-center">
              {isFetching ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#8E1454]" />
              ) : (
                <>
                  <PackageSearch className="mx-auto mb-2 h-6 w-6 text-[#D4BFAA]" />
                  <p className="text-sm font-semibold text-[#300332]">
                    No products match “{search.trim()}”
                  </p>
                  <p className="mt-1 text-xs text-[#8A6F63]">
                    Try a shorter word — search matches product names.
                  </p>
                </>
              )}
            </div>
          ) : (
            <ul className="py-2">
              {results.map((product, index) => {
                const price = product.discountPrice || product.price;
                const hasDiscount =
                  product.discountPrice > 0 &&
                  product.discountPrice < product.price;

                return (
                  <li key={product._id} role="option" aria-selected={index === activeIndex}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goToProduct(product)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        index === activeIndex ? "bg-[#FDF3F7]" : "bg-transparent"
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#FAF9F6]">
                        {product.images?.[0]?.url && (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].altText || product.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold text-[#300332]">
                          {product.title}
                        </p>
                        <p className="font-montserrat mt-0.5 flex items-center gap-2 text-xs">
                          <span className="font-bold text-[#8E1454]">
                            ৳{price?.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-[#8A6F63] line-through">
                              ৳{product.price.toLocaleString()}
                            </span>
                          )}
                        </p>
                      </div>

                      {product.stockStatus === "Out of Stock" && (
                        <span className="shrink-0 rounded-full bg-[#F3E9DC] px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#8A6F63] uppercase">
                          Sold out
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={goToShop}
            className="flex w-full items-center justify-between gap-2 border-t border-[#F3E9DC] px-5 py-3 text-left text-xs font-bold tracking-wider text-[#8E1454] uppercase transition-colors hover:bg-[#FDF3F7]"
          >
            See all results
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}

export default NavSearch;
