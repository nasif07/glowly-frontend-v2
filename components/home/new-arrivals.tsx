"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/common/product-card";
import SectionTitle from "@/components/common/section-title";
import { useNewArrivalProducts } from "@/hooks/use-products";

import "swiper/css";
import "swiper/css/pagination";

/**
 * "New Arrivals": products ticked "New Arrival" in the inventory form (the API
 * returns up to 10 active ones, newest first). Runs as a carousel so it reads
 * differently from the Featured grid; hidden entirely when nothing is ticked.
 */
export default function NewArrivals() {
  const { data, isLoading } = useNewArrivalProducts();
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const products = data ?? [];

  if (!isLoading && products.length === 0) return null;

  const arrowClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#300332]/15 bg-white text-[#300332] shadow-sm transition-colors hover:bg-[#300332] hover:text-white";

  return (
    <section className="relative overflow-hidden px-4 py-10 md:px-6 md:py-16">
      {/* Soft brand glow behind the row */}
      <span className="pointer-events-none absolute top-10 -right-24 h-72 w-72 rounded-full bg-[#F49AC2]/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <SectionTitle title="New Arrivals" subtitle="Just Landed ✦" />
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/shop?sort=newest"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#300332]"
            >
              View all
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                aria-label="Previous products"
                className={arrowClass}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                aria-label="Next products"
                className={arrowClass}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`animate-pulse space-y-4 ${i > 1 ? "hidden md:block" : ""} ${i > 3 ? "md:hidden lg:block" : ""}`}
              >
                <div className="aspect-4/5 rounded-[2rem] bg-[#300332]/5" />
                <div className="mx-auto h-3 w-2/3 rounded-full bg-[#300332]/5" />
                <div className="mx-auto h-3 w-1/2 rounded-full bg-[#300332]/5" />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            onSwiper={setSwiper}
            spaceBetween={8}
            slidesPerView={2}
            rewind
            grabCursor
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 4, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
            }}
            className="pb-12!"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id} className="h-auto!">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
