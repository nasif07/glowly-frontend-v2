"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/common/product-card";
import SectionTitle from "@/components/common/section-title";
import { useProducts } from "@/hooks/use-products";

const SHOWN = 5;

/** The newest combos; hidden entirely while there are none. */
export default function ComboDeals() {
  const { data, isLoading } = useProducts({ type: "bundle", limit: SHOWN });
  const combos = data?.data ?? [];

  if (isLoading || combos.length === 0) return null;

  return (
    <section className="bg-[#D9C5B2]/20 px-4 py-8 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-10">
          <SectionTitle title="Combo Deals" subtitle="Complete Routines, Better Price" />
          <Link
            href="/shop?type=bundle"
            className="flex shrink-0 items-center gap-2 border-b border-[#300332]/20 pb-1 text-[11px] font-bold tracking-widest text-[#300332] uppercase transition-all hover:border-[#300332]"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
          {combos.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
