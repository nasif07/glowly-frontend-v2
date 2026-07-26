import type { Metadata } from "next";
import { getAllPosts, getFeaturedPost, getPopularPosts } from "@/lib/blog-data";
import BlogListing from "@/components/blog/blog-listing";

export const metadata: Metadata = {
  title: "The Glowly Journal | Skincare Tips, Ingredients & Rituals",
  description:
    "Expert skincare advice, ingredient science and product guides from the Glowly team. Learn how to build a routine that actually works.",
};

export default function BlogPage() {
  // Raw (bilingual) data is passed through; BlogListing resolves it to the
  // reader's chosen language on the client so the toggle switches instantly.
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const popular = getPopularPosts(4);

  return <BlogListing posts={posts} featured={featured} popular={popular} />;
}
