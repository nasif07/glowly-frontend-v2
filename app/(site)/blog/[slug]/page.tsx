import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedPost,
  getPublishedPosts,
  getRelatedPosts,
} from "@/lib/blog-api";
import { richTextToPlain } from "@/lib/rich-text";
import { truncateForPreview } from "@/lib/seo";
import BlogPostView from "@/components/blog/blog-post-view";

// Posts are published from the dashboard, so slugs appear between builds.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: { absolute: "Post not found | Glowly Journal" } };

  // The body is rich text, so it has to be flattened before it can stand in
  // for a description — otherwise the markup ends up inside the meta tag.
  const description =
    truncateForPreview(post.excerpt) ??
    truncateForPreview(richTextToPlain(post.html));

  return {
    // Absolute: opts out of the root layout's `%s | Glowly` template so the
    // blog keeps its own "Glowly Journal" brand suffix instead of doubling up.
    title: { absolute: `${post.title} | Glowly Journal` },
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date || undefined,
      authors: post.author ? [post.author] : undefined,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, all] = await Promise.all([
    getPublishedPost(slug),
    getPublishedPosts(),
  ]);

  // Covers both a missing post and a draft — `getPublishedPost` returns null
  // for anything not marked published.
  if (!post) notFound();

  return <BlogPostView post={post} related={getRelatedPosts(post, all, 3)} />;
}
