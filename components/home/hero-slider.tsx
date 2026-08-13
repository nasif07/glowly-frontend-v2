"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import Button from "@/components/common/button";
import { useHero } from "@/hooks/use-hero";
import type { HeroBanner, HeroSlide } from "@/types/hero";

// Placeholder shown until an admin publishes a real banner from /dashboard/hero
// (free-license Mixkit clips — swap for real footage anytime).
const DEMO_HERO = {
  title: "Reveal Your Natural Glow",
  subtitle:
    "Authentic Korean & international skincare, curated for radiant, healthy-looking results.",
  ctaText: "Shop the Edit",
  ctaLink: "/shop",
};

const DEMO_SLIDES: HeroSlide[] = [
  {
    _id: "demo-1",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/50417/50417-720.mp4",
    title: "Your Daily Ritual",
    order: 0,
    isActive: true,
  },
  {
    _id: "demo-2",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/51177/51177-720.mp4",
    title: "Formulated With Care",
    order: 1,
    isActive: true,
  },
];

// Internal links use the SPA router; external ones fall back to a plain anchor.
function CtaButton({ text, link }: { text?: string; link?: string }) {
  if (!text) return null;
  const isExternal = /^https?:\/\//i.test(link || "");

  const button = (
    <Button variant="secondary">
      {text}
      <ArrowRight size={18} className="ml-2" />
    </Button>
  );

  if (!link) return button;
  return isExternal ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {button}
    </a>
  ) : (
    <Link href={link}>{button}</Link>
  );
}

export default function HeroSlider() {
  const { data: hero } = useHero();

  // No published banner / no slides yet (including the brief initial load)
  // -> show the demo slides so the homepage is never empty.
  const isDemo = !hero || (hero.slides || []).length === 0;
  const activeHero: Pick<
    HeroBanner,
    "title" | "subtitle" | "ctaText" | "ctaLink"
  > = isDemo ? DEMO_HERO : hero;
  const slides = isDemo ? DEMO_SLIDES : hero.slides;

  return (
    // Pulled up by the header's resting height (py-5 + h-12/h-14) so the media
    // runs behind the transparent bar instead of starting below it.
    <section className="hero-slider relative -mt-22 w-full md:-mt-24">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        rewind={slides.length > 1}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            {/* Heights carry the header offset so the visible hero below the
                bar keeps its original size. */}
            <div className="relative h-[calc(75vh+5.5rem)] min-h-137 w-full overflow-hidden md:h-174">
              {/* Media (slow Ken Burns zoom while active) */}
              {slide.type === "video" ? (
                <video
                  src={slide.mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="hero-media absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.mediaUrl}
                  alt={slide.title || activeHero.title || "Glowly"}
                  className="hero-media absolute inset-0 h-full w-full object-cover"
                />
              )}

              {/* Legibility overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a011c]/80 via-[#1a011c]/30 to-transparent" />

              {/* Content (staggered entrance, re-triggers each slide) */}
              <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 pt-22 text-center md:pt-24">
                <div className="hero-content max-w-3xl space-y-4 md:space-y-6">
                  {slide.title && (
                    <span className="hero-anim hero-kicker inline-block text-[11px] font-bold tracking-[0.4em] text-[#D9C5B2] uppercase md:text-xs">
                      {slide.title}
                    </span>
                  )}

                  {activeHero.title && (
                    <h1 className="hero-anim hero-title text-4xl font-black tracking-tighter text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] md:text-6xl md:leading-tight">
                      {activeHero.title}
                    </h1>
                  )}

                  {activeHero.subtitle && (
                    <p className="hero-anim hero-subtitle mx-auto max-w-xl text-sm font-semibold text-white/85 md:text-lg md:leading-relaxed">
                      {activeHero.subtitle}
                    </p>
                  )}

                  <div className="hero-anim hero-cta flex justify-center pt-2">
                    <CtaButton text={activeHero.ctaText} link={activeHero.ctaLink} />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .hero-slider .swiper-pagination-bullet {
          background: #ffffff;
          opacity: 0.45;
          transition: all 0.4s ease;
        }
        .hero-slider .swiper-pagination-bullet-active {
          background: #D9C5B2;
          opacity: 1;
          width: 22px;
          border-radius: 6px;
        }
        .hero-slider .hero-media {
          transform: scale(1.03);
          will-change: transform;
        }
        .hero-slider .swiper-slide-active .hero-media {
          animation: heroKenBurns 8000ms ease-out forwards;
        }
        @keyframes heroKenBurns {
          from { transform: scale(1.03); }
          to   { transform: scale(1.13); }
        }
        .hero-slider .hero-anim { opacity: 0; }
        .hero-slider .swiper-slide-active .hero-anim {
          animation: heroRise 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hero-slider .swiper-slide-active .hero-kicker   { animation-delay: 150ms; }
        .hero-slider .swiper-slide-active .hero-title    { animation-delay: 320ms; }
        .hero-slider .swiper-slide-active .hero-subtitle { animation-delay: 500ms; }
        .hero-slider .swiper-slide-active .hero-cta      { animation-delay: 660ms; }
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-slider .hero-media,
          .hero-slider .swiper-slide-active .hero-anim {
            animation: none !important;
          }
          .hero-slider .hero-media { transform: scale(1); }
          .hero-slider .hero-anim { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
