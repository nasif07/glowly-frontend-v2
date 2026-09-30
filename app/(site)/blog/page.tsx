import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog-api";
import BlogListing from "@/components/blog/blog-listing";

export const metadata: Metadata = {
  // Absolute: the blog has its own "Glowly Journal" brand, so it opts out of
  // the root layout's `%s | Glowly` template instead of doubling up.
  title: {
    absolute: "The Glowly Journal | Skincare Tips, Ingredients & Rituals",
  },
  alternates: { canonical: "/blog" },
  description:
    "Expert skincare advice, ingredient science and product guides from the Glowly team. Learn how to build a routine that actually works.",
};

// Posts are written in the dashboard and expected to appear without a rebuild,
// so the list is re-fetched rather than baked in at build time.
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  // The hero headlines whichever post is flagged featured, else the newest.
  const featured = posts.find((p) => p.isFeatured) ?? posts[0] ?? null;
  const popular = [...posts].sort((a, b) => b.views - a.views).slice(0, 4);

  return <BlogListing posts={posts} featured={featured} popular={popular} />;
}
