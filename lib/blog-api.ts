import { api } from "@/lib/axios";
import { toBlogView, type BlogView } from "@/lib/blog";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type { Blog } from "@/types/blog";

/**
 * Server-side reads for the public blog.
 *
 * The listing and the post page are server components so the copy is in the
 * HTML for crawlers and `generateMetadata` has the real title to work with —
 * which is most of the point of having a blog. The dashboard talks to the same
 * endpoints through `hooks/use-blogs.ts` instead.
 */

/** The API clamps `limit` at 100, so this is the largest page it will serve. */
const MAX_PAGE_SIZE = 100;

/**
 * Published posts, newest first.
 *
 * The listing filters, searches and paginates in the browser — it is a store
 * blog, not an archive — so everything is fetched up front. If the blog ever
 * outgrows one page of 100, this is the place that has to start paginating.
 */
export async function getPublishedPosts(): Promise<BlogView[]> {
  try {
    const { data } = await api.get<PaginatedResponse<Blog>>("/blogs", {
      params: { isPublished: true, limit: MAX_PAGE_SIZE, page: 1 },
    });
    return (data.data ?? []).map(toBlogView);
  } catch (error) {
    // Rendering an empty blog beats a 500 on a page that is mostly chrome.
    console.warn("[blog] could not load posts", error);
    return [];
  }
}

/**
 * One published post by slug, or null.
 *
 * `GET /blogs/:id` resolves a slug or an ObjectId and does not filter drafts —
 * the dashboard preview relies on that — so the published check happens here.
 * Without it, an unpublished post would be readable by anyone who guessed the
 * slug.
 */
export async function getPublishedPost(slug: string): Promise<BlogView | null> {
  try {
    const { data } = await api.get<ApiResponse<Blog>>(
      `/blogs/${encodeURIComponent(slug)}`,
    );
    const blog = data.data;
    if (!blog?.isPublished) return null;
    return toBlogView(blog);
  } catch {
    return null;
  }
}

/** Other published posts to show under an article — same category first. */
export function getRelatedPosts(
  post: BlogView,
  all: BlogView[],
  limit = 3,
): BlogView[] {
  const others = all.filter((p) => p.id !== post.id);
  const sameCategory = post.category
    ? others.filter((p) => p.category === post.category)
    : [];
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}
