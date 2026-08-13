"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FilterX, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Range, getTrackBackground } from "react-range";
import ProductCard from "@/components/common/product-card";
import ProductCardSkeleton from "@/components/products/product-card-skeleton";
import ChildCategoryBar from "@/components/products/child-category-bar";
import Button from "@/components/common/button";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { useInfiniteProducts } from "@/hooks/use-products";
import { useMobileFilter } from "@/hooks/use-ui-store";
import type { Category, ProductsQuery } from "@/types";

const LIMIT = 9;

export default function ProductListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Global UI toggle (Zustand); expandedCats stays local — it's keyed to this view.
  const { isOpen: isMobileFilterOpen, set: setIsMobileFilterOpen } =
    useMobileFilter();
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  // Local UI State (seeded from URL)
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [minPrice, setMinPrice] = useState(
    Number(searchParams.get("minPrice")) || 0,
  );
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || 10000,
  );

  const loaderRef = useRef<HTMLDivElement>(null);

  const activeCategory = searchParams.get("category") || "All";
  const activeSort = searchParams.get("sort") || "newest";
  const activeBrand = searchParams.get("brand") || "All";

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  /* ---------------- URL HELPERS ---------------- */
  const commitParams = useCallback(
    (params: URLSearchParams) => {
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  /* ---------------- FILTERS → QUERY ---------------- */
  const filters: Omit<ProductsQuery, "page" | "limit"> = useMemo(() => {
    const f: Omit<ProductsQuery, "page" | "limit"> = {
      minPrice: Number(searchParams.get("minPrice")) || 0,
      maxPrice: Number(searchParams.get("maxPrice")) || 10000000,
      sort: activeSort,
    };
    if (searchParams.get("search")) f.search = searchParams.get("search")!;
    if (activeCategory !== "All") f.category = activeCategory;
    if (activeBrand !== "All") f.brand = activeBrand;
    return f;
  }, [searchParams, activeCategory, activeBrand, activeSort]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProducts(filters, LIMIT);

  const products = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  /* ---------------- SYNC UI WITH URL ---------------- */
  useEffect(() => {
    setMinPrice(Number(searchParams.get("minPrice")) || 0);
    setMaxPrice(Number(searchParams.get("maxPrice")) || 10000);
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  /* ---------------- AUTO-EXPAND PARENTS ---------------- */
  useEffect(() => {
    if (activeCategory !== "All" && categories.length > 0) {
      setExpandedCats((prev) => {
        const next = { ...prev };
        categories.forEach((cat) => {
          const hasActiveChild = cat.children?.some(
            (child) => child.name === activeCategory,
          );
          if (hasActiveChild || cat.name === activeCategory) {
            next[cat._id] = true;
          }
        });
        return next;
      });
    }
  }, [activeCategory, categories]);

  /* ---------------- INFINITE SCROLL ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" },
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* ---------------- HANDLERS ---------------- */
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("search", searchTerm);
    else params.delete("search");
    params.set("minPrice", String(minPrice));
    params.set("maxPrice", String(maxPrice));
    params.set("page", "1");
    commitParams(params);
    setIsMobileFilterOpen(false);
  };

  const resetFilters = () => {
    router.push(pathname);
    setIsMobileFilterOpen(false);
    setExpandedCats({});
  };

  // Child-category bar: set (or clear) the ?category filter, same as the sidebar.
  const selectCategory = (name: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name) params.set("category", name);
    else params.delete("category");
    params.set("page", "1");
    commitParams(params);
  };

  /* ---------------- RENDER CATEGORY ITEM ---------------- */
  const renderCategory = (cat: Category, isChild = false) => {
    const hasChildren = cat.children && cat.children.length > 0;
    const isSelected = activeCategory === cat.name;

    const isParentOfActive = cat.children?.some(
      (child) => child.name === activeCategory,
    );
    const isOpen = expandedCats[cat._id] || isSelected || isParentOfActive;

    return (
      <div key={cat._id} className="flex flex-col font-montserrat">
        <div className="flex items-center justify-between group">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("category", cat.name);
              commitParams(params);
              if (!hasChildren && window.innerWidth < 1024) {
                setIsMobileFilterOpen(false);
              }
            }}
            className={`flex-1 text-left py-1 md:py-2 text-xs uppercase transition-all ${
              isSelected
                ? "text-black font-bold"
                : "text-stone-500 hover:text-black"
            } ${isChild ? "pl-4 italic" : "px-2"}`}
          >
            {cat.name}
          </button>

          {hasChildren && (
            <button
              onClick={() =>
                setExpandedCats((prev) => ({
                  ...prev,
                  [cat._id]: !prev[cat._id],
                }))
              }
              className="p-2 text-stone-400"
            >
              <ChevronDown
                size={14}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
        {hasChildren && isOpen && (
          <div className="flex flex-col border-l border-stone-200 ml-4 mb-2">
            {cat.children!.map((child) => renderCategory(child, true))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Held as an element, not declared as a component. Declaring it inline gave
   * React a brand-new component type on every render, so the whole panel — the
   * price Range slider included — unmounted and remounted mid-interaction.
   */
  const filterContent = (
    <div className="space-y-4 md:space-y-6 font-montserrat z-50">
      <button
        onClick={resetFilters}
        className="w-full py-3 border border-stone-300 text-stone-700 bg-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
      >
        <X size={14} /> Reset Filters
      </button>

      <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-[#A1887F]">
          Collections
        </h3>
        <button
          onClick={() => {
            const p = new URLSearchParams(searchParams.toString());
            p.delete("category");
            commitParams(p);
          }}
          className={`text-left px-2 py-2 text-xs uppercase ${activeCategory === "All" ? "text-black font-bold" : "text-stone-500"}`}
        >
          All Pieces
        </button>
        {categories.map((cat) => renderCategory(cat))}
      </div>

      <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-[#A1887F]">
          Our Brands
        </h3>
        <div className="flex flex-wrap gap-2">
          {["All", ...brands.map((b) => b.name)].map((bName) => (
            <button
              key={bName}
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                if (bName === "All") p.delete("brand");
                else p.set("brand", bName);
                commitParams(p);
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase border ${
                activeBrand === bName
                  ? "bg-linear-to-r from-[#360718] via-[#8E1454] to-[#360718] text-white border-transparent"
                  : "bg-white text-stone-500 border-stone-200"
              }`}
            >
              {bName}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-[#A1887F]">
          Price Range
        </h3>
        <div className="space-y-6 px-2">
          <Range
            values={[minPrice, maxPrice]}
            step={50}
            min={0}
            max={10000}
            onChange={(vals) => {
              setMinPrice(vals[0]);
              setMaxPrice(vals[1]);
            }}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{ ...props.style }}
                className="h-6 w-full flex items-center"
              >
                <div
                  ref={props.ref}
                  className="h-1 w-full rounded-full"
                  style={{
                    background: getTrackBackground({
                      values: [minPrice, maxPrice],
                      colors: ["#d6d3d1", "#1A0D08", "#d6d3d1"],
                      min: 0,
                      max: 10000,
                    }),
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  style={{ ...restProps.style }}
                  className="h-4 w-4 rounded-full bg-[#1A0D08] border-2 border-white shadow-md outline-none"
                />
              );
            }}
          />

          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-100">
            <div className="text-center">
              <p className="text-[9px] uppercase text-stone-400 font-bold">
                Min
              </p>
              <span className="text-xs font-bold">৳{minPrice}</span>
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase text-stone-400 font-bold">
                Max
              </p>
              <span className="text-xs font-bold">৳{maxPrice}</span>
            </div>
          </div>

          <Button
            onClick={applyFilters}
            variant="primary"
            fullWidth
            className="w-full py-3 text-[10px] font-black uppercase"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-[#1A0D08]">
      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 lg:hidden transition-opacity ${isMobileFilterOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={() => setIsMobileFilterOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-screen w-[85%] max-w-sm bg-[#FAF9F6] z-50 transition-transform lg:hidden flex flex-col ${
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-stone-100 bg-[#FAF9F6]">
          <h2 className="text-sm font-black uppercase tracking-widest">
            Filters
          </h2>
          <button onClick={() => setIsMobileFilterOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-24 scrollbar-hide">
          {filterContent}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Child category quick-filter bar */}
        <ChildCategoryBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={selectCategory}
        />

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="hidden lg:block w-72 sticky top-24 self-start">
            {filterContent}
          </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center mb-4 md:mb-8 border-b border-stone-200 pb-3 md:pb-5">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-[10px] font-black uppercase border border-stone-200"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <Badge
              variant="outline"
              className="hidden md:inline-flex text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#A1887F] font-montserrat border-none px-0"
            >
              {products.length} Products
            </Badge>
            <select
              aria-label="Sort products"
              value={activeSort}
              onChange={(e) => {
                const p = new URLSearchParams(searchParams.toString());
                p.set("sort", e.target.value);
                commitParams(p);
              }}
              className="bg-stone-100 border border-stone-200 text-xs md:text-[12px] font-semibold uppercase py-2.5 px-4 rounded-full outline-none font-montserrat"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-4">
              {[...Array(LIMIT)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-stone-50 rounded-3xl flex flex-col items-center gap-6">
              <FilterX size={48} className="mx-auto mb-4 text-stone-200" />
              <h2 className="italic text-stone-500">
                No rituals found in this collection
              </h2>
              <button
                onClick={resetFilters}
                className="py-3 px-4 border border-stone-300 text-stone-700 bg-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
              >
                <X size={14} /> Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          <div
            ref={loaderRef}
            className="h-20 flex items-center justify-center mt-10"
          >
            {isFetchingNextPage && (
              <div className="animate-pulse text-stone-400 text-[10px] font-bold uppercase">
                Curating more pieces...
              </div>
            )}
          </div>
          </main>
        </div>
      </div>
    </div>
  );
}
