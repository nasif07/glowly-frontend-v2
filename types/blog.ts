import type { Localized } from "@/lib/i18n";

export type BlogCategorySlug =
  | "skincare-tips"
  | "product-reviews"
  | "ingredients-101"
  | "trending"
  | "wellness";

export interface BlogCategory {
  slug: BlogCategorySlug;
  /** Bilingual display name. */
  name: Localized;
  /** Tailwind classes for the color-coded tag. */
  badge: string;
  /** Accent hex used for dots / active states. */
  accent: string;
}

/* ----------------------------- Source (raw) ----------------------------- */
/**
 * The data layer stores every reader-facing string bilingually via `Localized`.
 * `localizePost` (lib/blog.ts) flattens a `RawBlogPost` to a `BlogPost` for a
 * chosen language, which is the plain-string shape every component renders.
 */

export interface RawBlogAuthor {
  name: string;
  role: Localized;
  avatar: string;
}

export type RawBlogBlock =
  | { type: "paragraph"; text: Localized }
  | { type: "heading"; text: Localized }
  | {
      type: "image";
      src: string;
      alt: Localized;
      caption?: Localized;
      layout?: "full" | "left" | "right";
    }
  | { type: "quote"; text: Localized; cite?: Localized }
  | {
      type: "productCta";
      title: Localized;
      description: Localized;
      href: string;
      image: string;
    };

export interface RawBlogPost {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  featuredImage: string;
  category: BlogCategorySlug;
  author: RawBlogAuthor;
  /** ISO date string. */
  date: string;
  /** Mocked engagement metric. */
  views: number;
  content: RawBlogBlock[];
}

/* --------------------------- Resolved (render) -------------------------- */

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

/**
 * Rich content is modelled as a list of typed blocks so images can be
 * interleaved with text (floated, full-width) rather than only at the top.
 */
export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      layout?: "full" | "left" | "right";
    }
  | { type: "quote"; text: string; cite?: string }
  | {
      type: "productCta";
      title: string;
      description: string;
      href: string;
      image: string;
    };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: BlogCategorySlug;
  author: BlogAuthor;
  date: string;
  views: number;
  content: BlogBlock[];
}

/* ------------------------------ Admin (API) ------------------------------ */
/**
 * The dashboard-authored blog post (`/blogs` API, `/dashboard/blog`). Plain
 * English fields with a single HTML/markdown `content` body — distinct from
 * the bilingual, block-based `RawBlogPost` demo data the public blog renders.
 */
export interface Blog {
  _id: string;
  blogId?: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageKey?: string | null;
  category?: string;
  tags: string[];
  author?: string;
  isFeatured: boolean;
  isPublished: boolean;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Query params accepted by `GET /blogs`. */
export interface BlogsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isPublished?: boolean;
}
