"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, Eye } from "lucide-react";
import { t, formatDate, formatViews, localizeDigits } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";
import CategoryBadge from "@/components/blog/category-badge";
import { AuthorAvatar } from "@/components/blog/author-chip";
import { RichText } from "@/components/common/rich-text";
import BlogCard from "@/components/blog/blog-card";
import BlogComments from "@/components/blog/blog-comments";
import NewsletterForm from "@/components/blog/newsletter-form";
import LanguageToggle from "@/components/blog/language-toggle";
import { ShareButtons, PostActions } from "@/components/blog/share-buttons";
import type { BlogView } from "@/lib/blog";

export default function BlogPostView({
  post,
  related,
}: {
  post: BlogView;
  related: BlogView[];
}) {
  const { lang } = useLang();

  return (
    <div
      className={`min-h-screen bg-[#F5F3F0] ${lang === "bn" ? "font-bengali" : ""}`}
    >
      {/* Breadcrumb + language toggle */}
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 pt-8 md:px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#300332]/40 font-montserrat"
        >
          <Link href="/" className="transition-colors hover:text-[#300332]">
            {t("home", lang)}
          </Link>
          <ChevronRight size={12} />
          <Link href="/blog" className="transition-colors hover:text-[#300332]">
            {t("journal", lang)}
          </Link>
          <ChevronRight size={12} />
          <span className="line-clamp-1 text-[#300332]/70">{post.title}</span>
        </nav>
        <LanguageToggle className="shrink-0" />
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <header className="mb-8">
          <CategoryBadge category={post.category} className="mb-4" />
          <h1 className="mb-5 text-3xl font-bold leading-tight text-[#2D1B14] md:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#300332]/8 py-4">
            {post.author && (
              <div className="flex items-center gap-3">
                <AuthorAvatar name={post.author} size={48} />
                <p className="text-sm font-bold text-[#2D1B14] font-montserrat">
                  {post.author}
                </p>
              </div>
            )}
            <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider text-[#300332]/45 font-montserrat">
              {post.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> {formatDate(post.date, lang)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {localizeDigits(post.readTime, lang)}{" "}
                {t("min", lang)}
              </span>
              {/* Nothing increments views yet — hide the chip rather than show 0. */}
              {post.views > 0 && (
                <span className="flex items-center gap-1.5">
                  <Eye size={13} /> {formatViews(post.views, lang)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Featured image */}
        <div className="relative mb-10 aspect-[2/1] overflow-hidden rounded-3xl shadow-[0_20px_50px_-20px_rgba(48,3,50,0.35)]">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {/* Body — rich text written in the dashboard, images and all. */}
        <RichText html={post.html} className="text-[17px]" />

        {post.tags.length > 0 && (
          <div className="clear-both mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#300332]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#300332]/60 font-montserrat"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share + save */}
        <div className="clear-both mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#300332]/10 pt-6">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#300332]/50 font-montserrat">
              {t("share", lang)}
            </span>
            <ShareButtons title={post.title} />
          </div>
          <PostActions />
        </div>

        {/* Author card */}
        {post.author && (
          <div className="mt-10 flex items-center gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <AuthorAvatar name={post.author} size={64} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#300332]/40 font-montserrat">
                {t("writtenBy", lang)}
              </p>
              <p className="text-lg font-bold text-[#2D1B14]">{post.author}</p>
              <p className="text-sm text-[#5D4037]/70 font-montserrat">
                {t("atGlowly", lang)}
              </p>
            </div>
          </div>
        )}

        {/* Comments */}
        <BlogComments />
      </article>

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-[#300332] p-8 text-center text-white md:p-14">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D9C5B2] font-montserrat">
            {t("joinRitual", lang)}
          </p>
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">
            {t("newsletterCtaTitle", lang)}
          </h2>
          <p className="mx-auto mb-7 max-w-lg text-[#D9C5B2]/80 font-montserrat">
            {t("newsletterCtaBody", lang)}
          </p>
          <div className="mx-auto max-w-md">
            <NewsletterForm variant="wide" />
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
          <h2 className="mb-8 text-2xl font-bold text-[#2D1B14] md:text-3xl">
            {t("relatedReading", lang)}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
