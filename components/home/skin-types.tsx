"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Droplets,
  Feather,
  Scale,
  Shield,
  Sun,
} from "lucide-react";
import SectionTitle from "@/components/common/section-title";
import { useSkinTypeMedia } from "@/hooks/use-skin-types";
import { SKIN_TYPES, type SkinType } from "@/lib/skin";
import type { SkinTypeMedia } from "@/types/skin-type";

import "swiper/css";
import "swiper/css/pagination";

/** Icon + pastel backdrop per type, shown when a tile has no media yet. */
const LOOKS: Partial<Record<SkinType, { icon: typeof Droplet; bg: string }>> = {
  normal: { icon: Scale, bg: "from-[#F6EDE2] to-[#E6D0B8]" },
  dry: { icon: Sun, bg: "from-[#FBEADB] to-[#EDC3A0]" },
  oily: { icon: Droplets, bg: "from-[#EAF2EC] to-[#C4DACB]" },
  combination: { icon: Droplet, bg: "from-[#F2E7F3] to-[#D6BBDA]" },
  sensitive: { icon: Shield, bg: "from-[#FCE8ED] to-[#EFC0CC]" },
};

/**
 * "Shop by Skin Type": one portrait card per skin type, each opening the shop
 * filtered to it. Products tagged "All Skin Types" appear under every one.
 *
 * Cards show the image or video set in the dashboard, full bleed, with the
 * copy over a plum fade. Types without media get a pastel backdrop and their
 * icon, so the row reads as designed either way. The cards run in a Swiper
 * carousel (autoplay, drag, arrows, dots) at every width.
 */
export default function SkinTypes() {
  const types = SKIN_TYPES.filter((t) => t.value !== "all");
  const { data: media = [] } = useSkinTypeMedia();
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  const byType = new Map<string, SkinTypeMedia>(
    media.map((m) => [m.skinType, m]),
  );

  return (
    <section className="px-4 py-10 md:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <SectionTitle title="Shop by Skin Type" subtitle="Find Your Match" />
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/skin-consultation"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#300332]"
            >
              Not sure? Get a free consultation
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                aria-label="Previous skin type"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#300332]/15 bg-white text-[#300332] shadow-sm transition-colors hover:bg-[#300332] hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                aria-label="Next skin type"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#300332]/15 bg-white text-[#300332] shadow-sm transition-colors hover:bg-[#300332] hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          onSwiper={setSwiper}
          spaceBetween={12}
          slidesPerView={1.35}
          // `rewind` rather than `loop`: five slides are too few for Swiper's
          // loop at the wider breakpoints, which duplicates and misbehaves.
          rewind
          grabCursor
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            480: { slidesPerView: 2.2, spaceBetween: 14 },
            768: { slidesPerView: 3.2, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 18 },
          }}
          // Room above for the hover lift and below for the dots.
          className="skin-type-swiper pt-2! pb-12!"
        >
          {types.map((type, index) => {
            const look = LOOKS[type.value];
            const Icon = look?.icon ?? Feather;
            const entry = byType.get(type.value);
            const description = entry?.description || type.description;
            const hasMedia = Boolean(entry?.mediaUrl);

            return (
              <SwiperSlide key={type.value}>
                <Link
                  href={`/shop?skinType=${type.value}`}
                  className="group relative block aspect-3/4 w-full overflow-hidden rounded-3xl bg-[#F3E9DC] shadow-[0_10px_30px_-18px_rgba(48,3,50,0.5)] ring-1 ring-[#300332]/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(48,3,50,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#300332]"
                >
                  {/* Backdrop: uploaded media, or the type's pastel + icon */}
                  {hasMedia && entry ? (
                    entry.mediaType === "video" ? (
                      <video
                        src={entry.mediaUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <Image
                        src={entry.mediaUrl}
                        alt={type.label}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 70vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )
                  ) : (
                    <span
                      className={`absolute inset-0 flex items-start justify-center bg-linear-to-br pt-[22%] ${look?.bg ?? "from-[#F6EDE2] to-[#E6D0B8]"}`}
                    >
                      <span className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
                      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/60 text-[#300332] shadow-sm ring-1 ring-white/70 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 md:h-24 md:w-24">
                        <Icon size={36} strokeWidth={1.3} />
                      </span>
                    </span>
                  )}

                  {/* Number chip */}
                  <span className="absolute top-3 left-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#300332] backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Hover arrow */}
                  <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#300332] opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>

                  {/* Copy over a plum fade */}
                  <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#300332]/90 via-[#300332]/55 to-transparent p-4 pt-16 md:p-5 md:pt-20">
                    <span className="block text-xl leading-tight font-bold text-white md:text-2xl">
                      {type.short}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-xs leading-snug text-white/80">
                      {description}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] text-[#F3E9DC] uppercase">
                      Shop now
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
