import type {
  BlogBlock,
  BlogCategory,
  BlogCategorySlug,
  BlogPost,
  RawBlogBlock,
  RawBlogPost,
} from "@/types/blog";
import type { Lang } from "@/hooks/use-language";
import { pick } from "@/lib/i18n";

/* ------------------------------ Categories ------------------------------ */

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "skincare-tips",
    name: { en: "Skincare Tips", bn: "স্কিনকেয়ার টিপস" },
    badge: "bg-[#E8DFF5] text-[#6D4FA3]",
    accent: "#8B6FC4",
  },
  {
    slug: "product-reviews",
    name: { en: "Product Reviews", bn: "প্রোডাক্ট রিভিউ" },
    badge: "bg-[#F5E6E0] text-[#C06B58]",
    accent: "#D08670",
  },
  {
    slug: "ingredients-101",
    name: { en: "Ingredients 101", bn: "উপাদান পরিচিতি" },
    badge: "bg-[#CFE8E6] text-[#2C7A7B]",
    accent: "#3AA0A0",
  },
  {
    slug: "trending",
    name: { en: "Trending & Viral", bn: "ট্রেন্ডিং ও ভাইরাল" },
    badge: "bg-[#F5EAD4] text-[#A9822F]",
    accent: "#D4A574",
  },
  {
    slug: "wellness",
    name: { en: "Wellness", bn: "সুস্থতা" },
    badge: "bg-[#D4E5D9] text-[#4A7C59]",
    accent: "#5E9B72",
  },
];

const CATEGORY_MAP = new Map<BlogCategorySlug, BlogCategory>(
  BLOG_CATEGORIES.map((c) => [c.slug, c]),
);

export function getCategory(slug: BlogCategorySlug): BlogCategory {
  return CATEGORY_MAP.get(slug) ?? BLOG_CATEGORIES[0];
}

/** Localized display name for a category slug. */
export function getCategoryName(slug: BlogCategorySlug, lang: Lang): string {
  return pick(getCategory(slug).name, lang);
}

/* ----------------------------- Localization ----------------------------- */

function localizeBlock(block: RawBlogBlock, lang: Lang): BlogBlock {
  switch (block.type) {
    case "paragraph":
    case "heading":
      return { type: block.type, text: pick(block.text, lang) };
    case "image":
      return {
        type: "image",
        src: block.src,
        alt: pick(block.alt, lang),
        caption: block.caption ? pick(block.caption, lang) : undefined,
        layout: block.layout,
      };
    case "quote":
      return {
        type: "quote",
        text: pick(block.text, lang),
        cite: block.cite ? pick(block.cite, lang) : undefined,
      };
    case "productCta":
      return {
        type: "productCta",
        title: pick(block.title, lang),
        description: pick(block.description, lang),
        href: block.href,
        image: block.image,
      };
  }
}

/** Flatten a bilingual source post to plain strings for one language. */
export function localizePost(post: RawBlogPost, lang: Lang): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: pick(post.title, lang),
    excerpt: pick(post.excerpt, lang),
    featuredImage: post.featuredImage,
    category: post.category,
    author: {
      name: post.author.name,
      role: pick(post.author.role, lang),
      avatar: post.author.avatar,
    },
    date: post.date,
    views: post.views,
    content: post.content.map((b) => localizeBlock(b, lang)),
  };
}

/* ------------------------------- Helpers -------------------------------- */

/** Reading-time estimate from the text content (~200 wpm). */
export function estimateReadTime(content: BlogBlock[]): number {
  const words = content.reduce((total, block) => {
    if (
      block.type === "paragraph" ||
      block.type === "heading" ||
      block.type === "quote"
    ) {
      return total + block.text.trim().split(/\s+/).length;
    }
    return total;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

/* --------------------------- Image utilities ---------------------------- */
/**
 * Deterministic placeholder photography (Lorem Picsum) + author avatars
 * (Pravatar). Both always render and are wired through next/image. Swap these
 * helpers for your curated skincare CDN URLs when ready — the data layer only
 * calls these two functions.
 */
export function photo(seed: string, w: number, h: number): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export function avatar(n: number): string {
  return `https://i.pravatar.cc/160?img=${n}`;
}
