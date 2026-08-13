"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useBrands } from "@/hooks/use-brands";
import SectionTitle from "@/components/common/section-title";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

function BrandSkeleton() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 space-y-3">
          <div className="h-4 w-32 bg-stone-200 animate-pulse rounded" />
          <div className="h-10 w-64 bg-stone-200 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-stone-100 rounded-xl p-8 aspect-square flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 bg-stone-100 rounded-full animate-pulse" />
              <div className="mt-6 h-3 w-20 bg-stone-100 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Brands() {
  const router = useRouter();
  const { data: brands, isLoading } = useBrands();

  if (isLoading) return <BrandSkeleton />;
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-8 md:py-20 px-4 md:px-6 bg-[#D9C5B2]/20 brand-swiper-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <SectionTitle title="Our Partners" subtitle="Curated Brands" />
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          className="pb-12" // Space for pagination dots
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={brand._id || index}>
              <div
                role="link"
                tabIndex={0}
                aria-label={`Shop ${brand.name}`}
                onClick={() =>
                  router.push(`/shop?brand=${encodeURIComponent(brand.name)}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(
                      `/shop?brand=${encodeURIComponent(brand.name)}`,
                    );
                  }
                }}
                className="group bg-white border border-stone-200 rounded-xl p-4 md:p-8 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:border-stone-300 cursor-pointer h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#300332]"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative h-[70%] w-full">
                    {brand.logo && (
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-contain md:grayscale group-hover:grayscale-0 transition-all duration-500 md:opacity-70 group-hover:opacity-100"
                      />
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-4 text-center">
                  <h3 className="text-[12px] md:text-sm font-black uppercase tracking-[0.1em] text-black group-hover:text-[#300332] transition-colors line-clamp-1">
                    {brand.name}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Styles for Swiper Pagination */}
      <style>{`
        .brand-swiper-section .swiper-pagination-bullet-active {
          background: #300332;
        }
      `}</style>
    </section>
  );
}
