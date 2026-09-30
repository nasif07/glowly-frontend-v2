/**
 * The blog post as the API stores it (`/blogs`), authored in the dashboard at
 * `/dashboard/blog` and rendered by the public blog. `content` is a rich-text
 * HTML body — see `lib/rich-text.ts` and `components/common/rich-text.tsx`.
 *
 * `lib/blog.ts` maps this to `BlogView`, the shape the pages actually render.
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
