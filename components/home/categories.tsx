"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";
import SectionTitle from "@/components/common/section-title";
import Button from "@/components/common/button";

function getLayoutStyles(count: number, index: number) {
  if (count === 1) return "col-span-2 md:col-span-4 h-[350px] md:h-[450px]";
  if (count === 2) return "md:col-span-2 h-[300px] md:h-[400px]";
  if (count === 3) {
    return index === 0
      ? "col-span-2 md:row-span-2 md:h-[432px]"
      : "col-span-2 md:col-span-2 h-[200px] ";
  }
  const spans = [
    "col-span-2 md:col-span-2 md:row-span-2 min-h-[300px] md:min-h-[500px]",
    "col-span-2 md:col-span-2 md:row-span-1 min-h-[200px] md:min-h-[240px]",
    "col-span-1 md:col-span-1 md:row-span-1 min-h-[180px] md:min-h-[240px]",
    "col-span-1 md:col-span-1 md:row-span-1 min-h-[180px] md:min-h-[240px]",
  ];
  return spans[index % 4];
}

function CategorySkeleton() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg" />
          </div>
          <div className="hidden md:block h-6 w-40 bg-gray-200 animate-pulse rounded" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`rounded-xl md:rounded-2xl bg-gray-200 animate-pulse relative overflow-hidden ${getLayoutStyles(4, index)}`}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

              <div className="absolute bottom-6 left-6 space-y-2">
                <div className="h-3 w-16 bg-gray-300 rounded" />
                <div className="h-6 w-32 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Categories() {
  const router = useRouter();
  const { data, isLoading } = useCategories();

  // We still filter client-side because the backend might not have a specific
  // showOnLanding filter yet.
  const categories = (data || []).filter((cat) => cat.showOnLanding === true);

  if (isLoading) return <CategorySkeleton />;

  if (categories.length === 0) return null;

  return (
    <section className="py-8 md:py-24 px-4 md:px-6 overflow-hidden bg-[#D9C5B2]/20">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-10">
          <SectionTitle title="Our Categories" subtitle="Shop by Category" />

          <button
            onClick={() => router.push("/shop")}
            className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#300332] border-b border-[#300332]/20 pb-1 hover:border-[#300332] transition-all"
          >
            Explore All Categories <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 grid-rows-1 md:grid-cols-4 gap-4 md:gap-5">
          {categories.slice(0, 4).map((category, index) => (
            <div
              key={category._id || index}
              onClick={() => router.push(`/shop?category=${category.name}`)}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer bg-[#D9C5B2] transition-all duration-700 ${getLayoutStyles(
                categories.length,
                index,
              )}`}
            >
              {/* Image with subtle zoom */}
              <Image
                src={category.image || "/placeholder.jpg"}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />

              {/* Modern Minimal Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#300332]/90 via-[#300332]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8 z-10">
                <div className="space-y-1 md:space-y-2">
                  <p className="text-[#D9C5B2] text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    Discover
                  </p>

                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl md:text-3xl tracking-tight">
                      {category.name}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  <div className="h-[1px] w-0 group-hover:w-full bg-[#D9C5B2]/40 transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden mt-10">
          <Button onClick={() => router.push("/shop")} fullWidth>
            View Full Catalog
          </Button>
        </div>
      </div>
    </section>
  );
}
