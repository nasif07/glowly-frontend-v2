"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import ProductCard from "@/components/common/product-card";
import SectionTitle from "@/components/common/section-title";
import Button from "@/components/common/button";
import { useProducts } from "@/hooks/use-products";

export default function AllProduct() {
  const router = useRouter();
  const { data, isLoading } = useProducts({ limit: 10 });

  const products = data?.data ?? [];
  const displayedProducts = products.slice(0, 10);

  return (
    <section className="py-8 md:py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-20 right-[-10%] w-96 h-96 bg-[#D9C5B2]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-[-10%] w-96 h-96 bg-[#300332]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Icon */}
        <div className="flex flex-col mb-6 md:mb-10 space-y-2 md:space-y-4">
          <div className="flex items-center gap-2 text-[#300332]/80">
            <Sparkles size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
              Curated for you
            </span>
          </div>
          <SectionTitle
            title="Explore Our Products"
            subtitle="Discover Your Next Ritual"
          />
        </div>

        {/* Loading State: Refined Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-[#300332]/5 rounded-[2rem]" />
                <div className="h-3 w-2/3 bg-[#300332]/5 rounded-full mx-auto" />
                <div className="h-3 w-1/2 bg-[#300332]/5 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Product Grid with Staggered Entry Animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {displayedProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Centered CTA Button */}
            {products.length > 8 && (
              <div className="mt-8 md:mt-20 flex flex-col items-center space-y-6">
                <div className="h-[1px] w-20 bg-[#300332]/10" />
                <Button
                  onClick={() => router.push("/shop")}
                  variant="outline"
                  className="px-12"
                >
                  Explore All Products
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-[#300332]/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#300332]/40">
                  Our shelves are currently being restocked.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
