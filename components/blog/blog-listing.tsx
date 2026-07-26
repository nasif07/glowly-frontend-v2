"use client";

import { useMemo, useState, useEffect } from "react";
import { FileSearch } from "lucide-react";
import { BLOG_CATEGORIES, getCategoryName, localizePost } from "@/lib/blog";
import { t } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";
import BlogHero from "@/components/blog/blog-hero";
import BlogCard from "@/components/blog/blog-card";
import BlogSidebar from "@/components/blog/blog-sidebar";
import Pagination from "@/components/blog/pagination";
import LanguageToggle from "@/components/blog/language-toggle";
import type { BlogCategorySlug, BlogPost, RawBlogPost } from "@/types/blog";

type Filter = BlogCategorySlug | "all";

const PAGE_SIZE = 6;

function matchesQuery(post: BlogPost, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    post.title,
    post.excerpt,
    ...post.content.map((b) =>
      b.type === "paragraph" || b.type === "heading" || b.type === "quote"
        ? b.text
        : "",
    ),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export default function BlogListing({
  posts: rawPosts,
  featured: rawFeatured,
  popular: rawPopular,
}: {
  posts: RawBlogPost[];
  featured: RawBlogPost;
  popular: RawBlogPost[];
}) {
  const { lang } = useLang();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  // Resolve the bilingual source data to the active language once per change.
  const posts = useMemo(
    () => rawPosts.map((p) => localizePost(p, lang)),
    [rawPosts, lang],
  );
  const featured = useMemo(
    () => localizePost(rawFeatured, lang),
    [rawFeatured, lang],
  );
  const popular = useMemo(
    () => rawPopular.map((p) => localizePost(p, lang)),
    [rawPopular, lang],
  );

  // Reset to first page whenever the filter or search changes.
  useEffect(() => {
    setPage(1);
  }, [query, active]);

  const searchFiltered = useMemo(
    () => posts.filter((p) => matchesQuery(p, query)),
    [posts, query],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: searchFiltered.length };
    for (const cat of BLOG_CATEGORIES) {
      c[cat.slug] = searchFiltered.filter((p) => p.category === cat.slug).length;
    }
    return c;
  }, [searchFiltered]);

  const filtered = useMemo(() => {
    const byCategory =
      active === "all"
        ? searchFiltered
        : searchFiltered.filter((p) => p.category === active);
    // On the default view, the featured post already headlines the hero.
    const isDefault = active === "all" && query.trim() === "";
    return isDefault
      ? byCategory.filter((p) => p.id !== featured.id)
      : byCategory;
  }, [searchFiltered, active, query, featured.id]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const showHero = active === "all" && query.trim() === "";

  return (
    <div className={`min-h-screen bg-[#F5F3F0] ${lang === "bn" ? "font-bengali" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {/* Page header */}
        <header className="mb-10">
          <div className="mb-6 flex justify-center sm:justify-end">
            <LanguageToggle />
          </div>
          <div className="text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.4em] text-[#D4A574] font-montserrat">
              {t("journalKicker", lang)}
            </p>
            <h1 className="text-4xl font-bold text-[#300332] md:text-6xl">
              {t("journalTitle", lang)}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[#5D4037]/70 font-montserrat">
              {t("journalSubtitle", lang)}
            </p>
          </div>
        </header>

        {showHero && <BlogHero post={featured} />}

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          {/* Main column */}
          <main>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-[#2D1B14]">
                {active === "all"
                  ? t("latestArticles", lang)
                  : getCategoryName(active, lang)}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#300332]/40 font-montserrat">
                {filtered.length}{" "}
                {filtered.length === 1 ? t("post", lang) : t("posts", lang)}
              </span>
            </div>

            {pageItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
                {pageItems.map((post, i) => (
                  <div
                    key={post.id}
                    className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-[#300332]/15 bg-white/50 py-20 text-center">
                <FileSearch size={40} className="text-[#300332]/30" />
                <div>
                  <p className="text-lg font-bold text-[#2D1B14]">
                    {t("noResultsTitle", lang)}
                  </p>
                  <p className="mt-1 text-sm text-[#300332]/50 font-montserrat">
                    {t("noResultsBody", lang)}
                  </p>
                </div>
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </main>

          {/* Sidebar */}
          <div className="mt-14 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <BlogSidebar
                query={query}
                onQuery={setQuery}
                active={active}
                onCategory={setActive}
                counts={counts}
                popular={popular}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
