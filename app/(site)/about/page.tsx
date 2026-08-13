import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ScanBarcode, Truck, BadgeCheck } from "lucide-react";
import { GlowButton } from "@/components/forms/glow-button";
import bannerImg from "@/public/about-us-banner.jpg";

export const metadata: Metadata = {
  // Absolute: the docs' meta title already contains the brand, so the root
  // layout's "| Glowly" template would double it up.
  title: { absolute: "About Glowly | Trusted Authentic Skincare Shop in BD" },
  description:
    "Glowly BD is your trusted partner for genuine international skincare in Bangladesh. Sourced directly from global brands with guaranteed quality. Read our story!",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Glowly | Trusted Authentic Skincare Shop in BD",
    description:
      "Glowly BD is your trusted partner for genuine international skincare in Bangladesh. Sourced directly from global brands with guaranteed quality.",
    type: "website",
    url: "/about",
  },
};

const values = [
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: "Authorized Sourcing",
    desc: "Every product comes from an authorized distributor — never a reseller.",
  },
  {
    icon: <ScanBarcode size={28} strokeWidth={1.5} />,
    title: "Batch Code Verified",
    desc: "Check the code on your product against the brand's official site.",
  },
  {
    icon: <BadgeCheck size={28} strokeWidth={1.5} />,
    title: "Checked Before Listing",
    desc: "If we can't confirm a product is authentic, we don't sell it.",
  },
  {
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "Nationwide Delivery",
    desc: "We deliver to all districts across Bangladesh.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-[#300332]">
      {/* Hero Section - Rose Gradient Background */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#360718] via-[#8E1454] to-[#360718] px-4 py-20 text-[#D9C5B2] md:px-6 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.5em] text-white/60">
            Est. 2026
          </span>
          <h1 className="mb-8 text-5xl leading-none text-white md:text-8xl">
            The Glowly <span className="font-light italic">Story</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed opacity-80 md:text-xl">
            Authentic skincare for Bangladesh — sourced directly from authorized
            distributors, and verifiable down to the batch code.
          </p>
        </div>
        {/* Subtle Organic Shape Overlay */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-10">
          <div className="absolute right-[-5%] top-[-10%] h-96 w-96 rounded-full bg-[#D9C5B2] blur-[120px]"></div>
        </div>
      </section>

      {/* Our Story - Two Column */}
      <section className="mx-auto grid max-w-7xl items-center gap-20 px-6 py-20 md:grid-cols-2 md:py-32">
        <div className="relative order-2 md:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-[#D9C5B2]/30 bg-[#D9C5B2]/20">
            <Image
              src={bannerImg}
              alt="Authentic skincare products sold by Glowly"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-90 mix-blend-multiply"
            />
          </div>
          {/* Floating Badge */}
          <div className="absolute -bottom-10 -right-6 hidden h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-white bg-[#D9C5B2] p-10 text-[#300332] shadow-2xl md:flex">
            <p className="text-4xl">100%</p>
            <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-widest">
              Authentic
            </p>
          </div>
        </div>

        <div className="order-1 space-y-8 md:order-2">
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#300332]/40">
              Our Story
            </h2>
            <h3 className="text-4xl leading-tight md:text-5xl">
              Built to solve a <span className="italic">real problem.</span>
            </h3>
          </div>
          <p className="text-lg leading-relaxed text-[#300332]/70">
            Founded in 2026, Glowly was built to solve a real problem in
            Bangladesh&apos;s skincare market: the widespread sale of counterfeit
            products, leaving customers with no reliable way to know whether what
            they bought was genuine.
          </p>
          <p className="text-lg leading-relaxed text-[#300332]/70">
            A small team of us set out to change that. Glowly sources every
            product directly from authorized distributors, never from
            unauthorized resellers, and every item comes with a verifiable batch
            code you can check against the brand&apos;s official website. Our
            catalog includes internationally trusted names such as The Ordinary,
            CosRx, and CeraVe, each one verified before it reaches you.
          </p>
          <div className="pt-4">
            <Link
              href="/transparency"
              className="inline-block border-b-2 border-[#300332] pb-1 text-sm font-bold uppercase tracking-widest transition-all hover:border-[#8E1454] hover:text-[#8E1454]"
            >
              How we source our products
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values - Oatmeal Section */}
      <section className="bg-[#D9C5B2]/20 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#300332]/40">
              The Glowly Standard
            </h2>
            <h3 className="text-4xl">Why customers trust us</h3>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="group space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#300332] shadow-sm transition-all duration-500 group-hover:bg-[#300332] group-hover:text-white">
                  {value.icon}
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  {value.title}
                </h4>
                <p className="px-4 text-sm leading-relaxed text-[#300332]/60">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative bg-white px-6 py-24 text-center md:py-40">
        <div className="mx-auto max-w-3xl space-y-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#300332]/40">
            Our Mission
          </h2>
          <p className="text-3xl italic leading-tight text-[#300332] md:text-5xl">
            To give people in Bangladesh real access to authentic skincare — and
            the confidence that what they&apos;re putting on their skin is
            exactly what it says it is.
          </p>
          <div className="mx-auto h-[1px] w-12 bg-[#300332]/20"></div>
          <div className="space-y-6 pt-4">
            <p className="text-lg leading-relaxed text-[#300332]/70">
              Explore our full range of authentic skincare, sourced and verified
              for your peace of mind.
            </p>
            <GlowButton href="/shop" className="mx-auto">
              Shop With Confidence
            </GlowButton>
          </div>
        </div>
      </section>
    </div>
  );
}
