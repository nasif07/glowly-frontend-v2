"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { Category } from "@/types";

import "swiper/css";
import "swiper/css/free-mode";

/**
 * Horizontal, swipeable bar of child (sub)categories for the Shop page.
 *
 * `/categories` returns the tree (top-level categories each with a `children`
 * array); this flattens every child into a row of pill chips that drive the
 * same `?category=<name>` filter the sidebar uses. Renders nothing when there
 * are no child categories. Built on Swiper (freeMode + mousewheel) instead of
 * plain `overflow-x-auto` so it drags naturally and never shows a native
 * scrollbar track.
 */
export default function ChildCategoryBar({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: Category[];
  activeCategory: string;
  onSelect: (name: string | null) => void;
}) {
  const children = useMemo(() => {
    const flat = categories.flatMap((cat) => cat.children ?? []);
    const seen = new Set<string>();
    return flat.filter((child) => {
      if (!child?._id || seen.has(child._id)) return false;
      seen.add(child._id);
      return true;
    });
  }, [categories]);

  if (children.length === 0) return null;

  const chipBase =
    "flex items-center gap-2 shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap";

  const chipStyle = (active: boolean) =>
    active
      ? "bg-linear-to-r from-[#360718] via-[#8E1454] to-[#360718] text-white border-transparent"
      : "bg-white text-stone-600 border-stone-200 hover:border-[#8E1454]";

  return (
    <div className="sticky top-16 z-40 -mx-4 bg-background px-4 py-2 mb-6 md:static md:top-auto md:z-auto md:mx-0 md:bg-transparent md:px-0 md:py-0 md:mb-8">
      <Swiper
        modules={[FreeMode, Mousewheel]}
        freeMode={{ enabled: true, momentum: true }}
        mousewheel={{ forceToAxis: true }}
        grabCursor
        slidesPerView="auto"
        spaceBetween={8}
        className="font-montserrat px-0.5! py-1!"
      >
        <SwiperSlide className="w-auto!">
          <button
            onClick={() => onSelect(null)}
            className={`${chipBase} ${chipStyle(activeCategory === "All")}`}
          >
            All
          </button>
        </SwiperSlide>

        {children.map((child) => (
          <SwiperSlide key={child._id} className="w-auto!">
            <button
              onClick={() => onSelect(child.name)}
              className={`${chipBase} ${chipStyle(activeCategory === child.name)}`}
            >
              {child.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={child.image}
                  alt=""
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
              {child.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
