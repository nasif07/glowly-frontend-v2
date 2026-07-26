import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/common/button";
import glowlyCover from "@/public/glowlyCover.png";

export default function Banner() {
  return (
    /* Changed h-screen to py-20 and reduced min-h for a tighter look */
    <section className="relative w-full py-8 md:py-20 md:min-h-[600px] flex items-center overflow-hidden">
      {/* Decorative floral background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url('/path-to-your-floral-pattern.png')`,
          backgroundSize: "cover",
        }}
      />

      {/* Background Shape - Adjusted width/height to match new section scale */}
      <div className="absolute top-0 right-0 w-[45%] h-full bg-[#F1E9EA] rounded-l-[160px] hidden lg:block" />

      <div className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-1 gap-5 md:gap-8 items-center relative z-20">
        {/* TOP CONTENT */}
        <div className="flex flex-col items-center text-center space-y-3 md:space-y-6 animate-in fade-in zoom-in duration-1000">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4">
              <span className="h-[1px] w-10 bg-[#300332]" />
              <span className="text-[#300332] text-xs font-bold tracking-[0.5em] uppercase">
                Est. 2026 • Pure Excellence
              </span>
              <span className="h-[1px] w-10 bg-[#300332]" />
            </div>

            <h1 className="text-[#300332] text-5xl md:text-7xl font-black md:leading-tight tracking-tighter">
              The Art of{" "}
              <span className="text-white drop-shadow-[2px_2px_0_#300332]">
                Authentic{" "}
              </span>
              Glow
            </h1>
          </div>

          <p className="text-[#300332]/80 text-[14px] font-semibold md:text-lg max-w-xl md:leading-relaxed">
            GLOWLY: 100% authentic skincare sourced directly from global
            origins. Trending serums, moisturizers & routines for radiant skin
            in Bangladesh. Fast delivery & genuine quality.
          </p>

          <div className="pt-2">
            <Link href="/shop">
              <Button variant="primary">
                Shop the Lineup
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* IMAGE CONTENT: Slightly scaled down max-width */}
        <div className="relative w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          <div className="relative rounded-2xl  overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 border-[#D9C5B2]">
            <Image
              src={glowlyCover}
              alt="Glowly Product Collection"
              sizes="(max-width: 768px) 100vw, 896px"
              placeholder="blur"
              className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-700"
            />

            <div className="absolute top-4 left-4 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/40">
              <span className="text-[#300332] text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={10} /> Trusted Brands
              </span>
            </div>
          </div>

          {/* Floating Trust Badge - Scaled down */}
          <div className="absolute -bottom-4 -right-4 bg-[#300332] text-[#FAF9F6] p-4 rounded-xl shadow-2xl hidden md:block">
            <p className="text-xl md:text-2xl font-black">100%</p>
            <p className="text-sm md:text-[12px] font-bold uppercase tracking-tighter opacity-80">
              Authentic Formulas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
