"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { estimateReadTime } from "@/lib/blog";
import { t, formatDate, localizeDigits } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";
import CategoryBadge from "@/components/blog/category-badge";
import type { BlogPost } from "@/types/blog";

export default function BlogHero({ post }: { post: BlogPost }) {
  const { lang } = useLang();
  return (
    <section className="mb-14">
      <div className="group relative overflow-hidden rounded-[2rem] shadow-[0_20px_60px_-20px_rgba(48,3,50,0.35)]">
        <div className="relative aspect-[21/12] w-full sm:aspect-[21/9]">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a011c] via-[#1a011c]/50 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-14">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <CategoryBadge category={post.category} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 font-montserrat">
                {t("featured", lang)}
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h1>

            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base font-montserrat">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-3">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border-2 border-white/30 object-cover"
                />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white font-montserrat">
                    {post.author.name}
                  </p>
                  <p className="text-[11px] text-white/60 font-montserrat">
                    {post.author.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider text-white/60 font-montserrat">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> {formatDate(post.date, lang)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />{" "}
                  {localizeDigits(estimateReadTime(post.content), lang)}{" "}
                  {t("minRead", lang)}
                </span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#300332] transition-all hover:gap-3 hover:bg-[#D9C5B2] font-montserrat"
              >
                {t("readMore", lang)} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
