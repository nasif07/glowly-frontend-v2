"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Clock, TrendingUp } from "lucide-react";
import { BLOG_CATEGORIES, estimateReadTime } from "@/lib/blog";
import { t, pick, formatDate, localizeDigits } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";
import NewsletterForm from "@/components/blog/newsletter-form";
import type { BlogCategorySlug, BlogPost } from "@/types/blog";

type Filter = BlogCategorySlug | "all";

export default function BlogSidebar({
  query,
  onQuery,
  active,
  onCategory,
  counts,
  popular,
}: {
  query: string;
  onQuery: (v: string) => void;
  active: Filter;
  onCategory: (c: Filter) => void;
  counts: Record<string, number>;
  popular: BlogPost[];
}) {
  const { lang } = useLang();
  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="rounded-2xl border border-[#300332]/5 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#300332]/50 font-montserrat">
          {t("search", lang)}
        </h3>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#300332]/30"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t("searchPlaceholder", lang)}
            aria-label={t("searchPlaceholder", lang)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#300332]/10 bg-[#FAF9F6] text-sm font-montserrat outline-none transition-colors focus:border-[#300332] focus:bg-white"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-2xl border border-[#300332]/5 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#300332]/50 font-montserrat">
          {t("categories", lang)}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategory("all")}
            className={`rounded-full px-4 py-2 text-xs font-bold font-montserrat transition-all ${
              active === "all"
                ? "bg-[#300332] text-white"
                : "bg-[#FAF9F6] text-[#300332]/70 hover:bg-[#F5E6E0]"
            }`}
          >
            {t("all", lang)} ({localizeDigits(counts.all ?? 0, lang)})
          </button>
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = active === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onCategory(cat.slug)}
                className="rounded-full px-4 py-2 text-xs font-bold font-montserrat transition-all"
                style={
                  isActive
                    ? { backgroundColor: cat.accent, color: "#fff" }
                    : undefined
                }
              >
                <span
                  className={
                    isActive ? "" : "text-[#300332]/70 hover:text-[#300332]"
                  }
                >
                  {pick(cat.name, lang)} (
                  {localizeDigits(counts[cat.slug] ?? 0, lang)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular posts */}
      <div className="rounded-2xl border border-[#300332]/5 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#300332]/50 font-montserrat">
          <TrendingUp size={14} /> {t("popularPosts", lang)}
        </h3>
        <div className="space-y-4">
          {popular.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-bold leading-tight text-[#2D1B14] transition-colors group-hover:text-[#300332]">
                  {post.title}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-[#300332]/40 font-montserrat">
                  <Clock size={10} />{" "}
                  {localizeDigits(estimateReadTime(post.content), lang)}{" "}
                  {t("min", lang)} · {formatDate(post.date, lang)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="rounded-2xl bg-[#300332] p-6 text-white">
        <h3 className="mb-1.5 text-lg font-bold">{t("glowNotes", lang)}</h3>
        <p className="mb-4 text-sm text-[#D9C5B2]/80 font-montserrat">
          {t("glowNotesBody", lang)}
        </p>
        <NewsletterForm />
      </div>
    </aside>
  );
}
