import type { Blog } from "@/types/blog";
import { isRichTextEmpty, richTextToPlain } from "@/lib/rich-text";

/**
 * View model for the public blog.
 *
 * The API stores a post flat — a single HTML `content` body, a free-text
 * `category`, an `author` name and nothing else — while the page wants a few
 * derived things (read time, a display date, a colour for the category chip).
 * `toBlogView` does that once, so no component has to reach into the raw
 * record or recompute anything per render.
 */
export interface BlogView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Always a usable src — falls back to the site cover when the post has none. */
  featuredImage: string;
  /** Free text as typed in the dashboard; "" when the author left it blank. */
  category: string;
  author: string;
  /** ISO date string (the record's `createdAt`). */
  date: string;
  views: number;
  /** The rich-text body, rendered by `<RichText>`. */
  html: string;
  /** Minutes, rounded, from the body's plain text. */
  readTime: number;
  /** Headlines the listing hero when set. */
  isFeatured: boolean;
  tags: string[];
}

/** Shown when a post has no featured image of its own. */
export const BLOG_FALLBACK_IMAGE = "/glowlyCover.png";

/* ------------------------------ Categories ------------------------------ */

/**
 * Chip colours. The API category is free text, so there is no fixed set to map
 * — a name picks a palette entry by hash, which keeps one category the same
 * colour everywhere it appears without needing to be registered anywhere.
 */
const CATEGORY_PALETTE = [
  { badge: "bg-[#E8DFF5] text-[#6D4FA3]", accent: "#8B6FC4" },
  { badge: "bg-[#F5E6E0] text-[#C06B58]", accent: "#D08670" },
  { badge: "bg-[#CFE8E6] text-[#2C7A7B]", accent: "#3AA0A0" },
  { badge: "bg-[#F5EAD4] text-[#A9822F]", accent: "#D4A574" },
  { badge: "bg-[#D4E5D9] text-[#4A7C59]", accent: "#5E9B72" },
] as const;

export type CategoryStyle = (typeof CATEGORY_PALETTE)[number];

export function categoryStyle(name: string): CategoryStyle {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

/** Distinct categories across a set of posts, alphabetical, blanks dropped. */
export function collectCategories(posts: BlogView[]): string[] {
  return [...new Set(posts.map((p) => p.category).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );
}

/* ------------------------------- Mapping -------------------------------- */

/** Reading-time estimate from the body text (~200 wpm). */
export function estimateReadTime(html: string): number {
  const text = richTextToPlain(html);
  if (!text) return 1;
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export function toBlogView(blog: Blog): BlogView {
  return {
    id: blog._id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt ?? "",
    featuredImage: blog.featuredImage || BLOG_FALLBACK_IMAGE,
    category: blog.category?.trim() ?? "",
    author: blog.author?.trim() ?? "",
    date: blog.createdAt ?? "",
    views: blog.views ?? 0,
    html: isRichTextEmpty(blog.content) ? "" : blog.content,
    readTime: estimateReadTime(blog.content ?? ""),
    isFeatured: blog.isFeatured ?? false,
    tags: blog.tags ?? [],
  };
}

/* ------------------------------- Helpers -------------------------------- */

/**
 * Initials for the author chip. The API only stores a name, so there is no
 * avatar to show — a monogram beats a broken image or a stock face.
 */
export function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** Whether a post matches a free-text query across its title, excerpt and body. */
export function matchesQuery(post: BlogView, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [post.title, post.excerpt, post.category, richTextToPlain(post.html)]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}
