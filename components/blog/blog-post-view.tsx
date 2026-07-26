"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, Eye } from "lucide-react";
import { estimateReadTime, localizePost } from "@/lib/blog";
import { t, formatDate, formatViews, localizeDigits } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";
import CategoryBadge from "@/components/blog/category-badge";
import ContentRenderer from "@/components/blog/content-renderer";
import BlogCard from "@/components/blog/blog-card";
import BlogComments from "@/components/blog/blog-comments";
import NewsletterForm from "@/components/blog/newsletter-form";
import LanguageToggle from "@/components/blog/language-toggle";
import { ShareButtons, PostActions } from "@/components/blog/share-buttons";
import type { RawBlogPost } from "@/types/blog";

export default function BlogPostView({
  post: rawPost,
  related: rawRelated,
}: {
  post: RawBlogPost;
  related: RawBlogPost[];
}) {
  const { lang } = useLang();

  const post = useMemo(() => localizePost(rawPost, lang), [rawPost, lang]);
  const related = useMemo(
    () => rawRelated.map((p) => localizePost(p, lang)),
    [rawRelated, lang],
  );

  const readTime = estimateReadTime(post.content);

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
            <div className="flex items-center gap-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="leading-tight">
                <p className="text-sm font-bold text-[#2D1B14] font-montserrat">
                  {post.author.name}
                </p>
                <p className="text-xs text-[#300332]/45 font-montserrat">
                  {post.author.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider text-[#300332]/45 font-montserrat">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {formatDate(post.date, lang)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {localizeDigits(readTime, lang)}{" "}
                {t("min", lang)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={13} /> {formatViews(post.views, lang)}
              </span>
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

        {/* Body */}
        <ContentRenderer content={post.content} />

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
        <div className="mt-10 flex items-center gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#300332]/40 font-montserrat">
              {t("writtenBy", lang)}
            </p>
            <p className="text-lg font-bold text-[#2D1B14]">
              {post.author.name}
            </p>
            <p className="text-sm text-[#5D4037]/70 font-montserrat">
              {post.author.role} {t("atGlowly", lang)}
            </p>
          </div>
        </div>

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
