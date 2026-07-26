"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";
import type { BlogBlock } from "@/types/blog";

function ContentImage({
  block,
}: {
  block: Extract<BlogBlock, { type: "image" }>;
}) {
  const layout = block.layout ?? "full";

  if (layout === "left" || layout === "right") {
    return (
      <figure
        className={`my-2 w-full sm:w-[46%] ${
          layout === "left"
            ? "sm:float-left sm:mr-7"
            : "sm:float-right sm:ml-7"
        } sm:mb-4`}
      >
        <Image
          src={block.src}
          alt={block.alt}
          width={480}
          height={360}
          className="w-full rounded-2xl object-cover shadow-[0_6px_20px_-8px_rgba(0,0,0,0.25)]"
        />
        {block.caption && (
          <figcaption className="mt-2 text-center text-xs italic text-[#300332]/50 font-montserrat">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="clear-both my-8">
      <Image
        src={block.src}
        alt={block.alt}
        width={1000}
        height={560}
        className="w-full rounded-3xl object-cover shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
      />
      {block.caption && (
        <figcaption className="mt-3 text-center text-sm italic text-[#300332]/50 font-montserrat">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function ProductCta({
  block,
}: {
  block: Extract<BlogBlock, { type: "productCta" }>;
}) {
  const { lang } = useLang();
  return (
    <div className="clear-both my-10 flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5E6E0] via-[#F8F2F7] to-[#E8DFF5] p-6 sm:flex-row sm:p-8">
      <Image
        src={block.image}
        alt={block.title}
        width={140}
        height={140}
        className="h-32 w-32 shrink-0 rounded-2xl object-cover shadow-lg"
      />
      <div className="text-center sm:text-left">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#300332]/50 font-montserrat">
          {t("shopTheEdit", lang)}
        </p>
        <h4 className="mb-1.5 text-xl font-bold text-[#300332]">
          {block.title}
        </h4>
        <p className="mb-4 text-sm text-[#5D4037]/80 font-montserrat">
          {block.description}
        </p>
        <Link
          href={block.href}
          className="inline-flex items-center gap-2 rounded-full bg-[#300332] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:gap-3 hover:bg-[#4a054d] font-montserrat"
        >
          {t("shopNow", lang)} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function ContentRenderer({ content }: { content: BlogBlock[] }) {
  return (
    <div className="text-[17px] leading-[1.85] text-[#3a2b24]">
      {content.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="clear-both mb-4 mt-10 text-2xl font-bold text-[#2D1B14] md:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="mb-5 font-montserrat">
                {block.text}
              </p>
            );
          case "image":
            return <ContentImage key={i} block={block} />;
          case "quote":
            return (
              <blockquote
                key={i}
                className="clear-both my-8 rounded-r-2xl border-l-4 border-[#D4A574] bg-[#F5EAD4]/40 py-5 pl-6 pr-5"
              >
                <Quote size={22} className="mb-2 text-[#D4A574]" />
                <p className="text-xl font-medium italic leading-relaxed text-[#300332]">
                  {block.text}
                </p>
                {block.cite && (
                  <cite className="mt-3 block text-xs font-bold uppercase not-italic tracking-widest text-[#300332]/50 font-montserrat">
                    — {block.cite}
                  </cite>
                )}
              </blockquote>
            );
          case "productCta":
            return <ProductCta key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
