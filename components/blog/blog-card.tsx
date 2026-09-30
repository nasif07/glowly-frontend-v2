"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { t, formatDate, formatViews, localizeDigits } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";
import CategoryBadge from "@/components/blog/category-badge";
import { AuthorAvatar } from "@/components/blog/author-chip";
import { PostActions } from "@/components/blog/share-buttons";
import type { BlogView } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogView }) {
  const { lang } = useLang();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#300332]/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgba(48,3,50,0.18)]">
      {/* Thumbnail */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
        {post.category && (
          <div className="absolute left-3 top-3">
            <CategoryBadge category={post.category} />
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-[#300332]/40 font-montserrat">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {localizeDigits(post.readTime, lang)}{" "}
            {t("minRead", lang)}
          </span>
          {/* Nothing increments views yet, so "0 views" would just be noise. */}
          {post.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={12} /> {formatViews(post.views, lang)}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-xl font-bold leading-snug text-[#2D1B14] transition-colors group-hover:text-[#300332]">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-[#5D4037]/80 font-montserrat">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-[#300332]/5 pt-4">
          <div className="flex items-center gap-2.5">
            {post.author && <AuthorAvatar name={post.author} size={36} />}
            <div className="leading-tight">
              {post.author && (
                <p className="text-xs font-bold text-[#2D1B14] font-montserrat">
                  {post.author}
                </p>
              )}
              {post.date && (
                <p className="text-[10px] text-[#300332]/40 font-montserrat">
                  {formatDate(post.date, lang)}
                </p>
              )}
            </div>
          </div>
          <PostActions compact />
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#300332] transition-all hover:gap-2.5 font-montserrat"
        >
          {t("readMore", lang)} <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
