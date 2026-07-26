import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, Award, Truck, ShieldCheck } from "lucide-react";
import bannerImg from "@/public/about-us-banner.jpg";

export const metadata: Metadata = {
  title: "Glowly | Your Trusted Skincare Partner",
  description:
    "Glowly BD is committed to providing authentic international skincare products in Bangladesh with guaranteed genuine quality.",
  alternates: { canonical: "https://glowlybd.com/about" },
  openGraph: {
    title: "Shop Original Korean & International Skincare Glowly BD",
    description:
      "Glowly BD is committed to providing authentic Korean and global skincare products in Bangladesh with guaranteed genuine quality.",
    type: "website",
    url: "https://glowlybd.com/about",
  },
};

const values = [
  {
    icon: <Leaf size={28} strokeWidth={1.5} />,
    title: "Ethical Sourcing",
    desc: "100% Vegan and cruelty-free botanicals.",
  },
  {
    icon: <Award size={28} strokeWidth={1.5} />,
    title: "Clinical Grade",
    desc: "Dermatologist tested for peak performance.",
  },
  {
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "Conscious Transit",
    desc: "Plastic-free, biodegradable packaging.",
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: "Pure Integrity",
    desc: "Zero synthetic fragrances or parabens.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-[#300332]">
      {/* Hero Section - Deep Plum Background */}
      <section className="relative py-20 md:py-32 px-4 md:px-6 bg-[#300332] text-[#D9C5B2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block text-white/60">
            Est. 2024
          </span>
          <h1 className="text-5xl md:text-8xl text-white leading-none mb-8">
            The Glowly <span className="italic font-light">Story</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed opacity-80">
            A sanctuary where clinical science meets botanical luxury. We are
            redefining the art of the daily ritual.
          </p>
        </div>
        {/* Subtle Organic Shape Overlay */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#D9C5B2] rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Our Philosophy - Two Column */}
      <section className="max-w-7xl mx-auto py-20 md:py-32 px-6 grid md:grid-cols-2 gap-20 items-center">
        <div className="relative order-2 md:order-1">
          <div className="relative aspect-[4/5] bg-[#D9C5B2]/20 rounded-t-full overflow-hidden border border-[#D9C5B2]/30">
            <Image
              src={bannerImg}
              alt="Artisanal Skincare"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover mix-blend-multiply opacity-90"
            />
          </div>
          {/* Floating Stats Badge */}
          <div className="absolute -bottom-10 -right-6 bg-[#D9C5B2] text-[#300332] p-10 rounded-full shadow-2xl hidden md:flex flex-col items-center justify-center w-48 h-48 border-4 border-white">
            <p className="text-4xl">10k+</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-center mt-1">
              Radiant Souls
            </p>
          </div>
        </div>

        <div className="space-y-8 order-1 md:order-2">
          <div className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#300332]/40">
              Our Philosophy
            </h2>
            <h3 className="text-4xl md:text-5xl leading-tight">
              Purity in every <span className="italic">drop.</span>
            </h3>
          </div>
          <p className="text-lg leading-relaxed text-[#300332]/70">
            Founded with a vision to simplify beauty, **Glowly** emerged from
            the belief that effective skincare should be a moment of peace, not
            a chore. We curate formulations that respect your skin&apos;s natural
            barrier while delivering transformative results.
          </p>
          <p className="text-lg leading-relaxed text-[#300332]/70">
            Every ingredient is ethically sourced, every bottle is a commitment
            to quality, and every routine is an invitation to rediscover your
            natural brilliance.
          </p>
          <div className="pt-4">
            <button className="border-b-2 border-[#300332] pb-1 text-sm font-bold uppercase tracking-widest hover:text-[#D9C5B2] hover:border-[#D9C5B2] transition-all">
              Learn about our lab
            </button>
          </div>
        </div>
      </section>

      {/* Core Values - Oatmeal Section */}
      <section className="bg-[#D9C5B2]/20 py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#300332]/40 mb-4">
              The Glowly Standard
            </h2>
            <h3 className="text-4xl">Why we stand apart</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {values.map((value, idx) => (
              <div key={idx} className="group text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:bg-[#300332] group-hover:text-white transition-all duration-500 text-[#300332]">
                  {value.icon}
                </div>
                <h4 className="font-bold text-sm uppercase tracking-wider">
                  {value.title}
                </h4>
                <p className="text-sm text-[#300332]/60 leading-relaxed px-4">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 md:py-40 px-6 text-center bg-white relative">
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="text-6xl text-[#D9C5B2]/40 block">“</span>
          <h2 className="text-3xl md:text-5xl italic text-[#300332] leading-tight -mt-10">
            Your skin is a reflection of your self-care ritual. We make sure it
            glows with intention.
          </h2>
          <div className="w-12 h-[1px] bg-[#300332]/20 mx-auto"></div>
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-40">
            Glowly Conscious Beauty
          </p>
        </div>
      </section>
    </div>
  );
}
