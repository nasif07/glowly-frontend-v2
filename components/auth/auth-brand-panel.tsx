import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import glowlyLogo from "@/public/glowly.png";

export interface AuthBrandHighlight {
  title: string;
  desc: string;
  icon: ReactNode;
}

/**
 * Left-side marketing column shared by /login and /register (ported from
 * glowly-frontend's split-screen auth layout). Copy/highlights differ per
 * page via props; the chrome (blurs, logo, highlight rows) stays identical.
 */
export function AuthBrandPanel({
  eyebrow,
  heading,
  highlights,
  footer,
}: {
  eyebrow: string;
  heading: ReactNode;
  highlights: AuthBrandHighlight[];
  footer: string;
}) {
  return (
    <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-[#300332] p-16 lg:flex">
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
        <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-[#D9C5B2]/10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full bg-[#D9C5B2]/5 blur-[100px]" />
      </div>

      <Link href="/" className="relative z-10">
        <Image src={glowlyLogo} alt="Glowly Logo" className="h-16 w-auto" />
      </Link>

      <div className="relative z-10">
        <span className="mb-8 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#D9C5B2] uppercase">
          {eyebrow}
        </span>
        <h1 className="mb-12 text-5xl leading-[1.1] text-white">{heading}</h1>

        <div className="space-y-5">
          {highlights.map((item, i) => (
            <div key={i} className="group flex items-start gap-6">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#D9C5B2] transition-all duration-500 group-hover:bg-[#D9C5B2] group-hover:text-[#300332]">
                {item.icon}
              </div>
              <div>
                <h4 className="mb-1.5 text-xl font-medium text-white">
                  {item.title}
                </h4>
                <p className="max-w-sm text-base leading-relaxed text-[#D9C5B2]/60">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-xs font-bold tracking-[0.4em] text-[#D9C5B2]/30 uppercase">
        {footer}
      </div>
    </div>
  );
}
