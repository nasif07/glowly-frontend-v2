import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import { pick } from "@/lib/i18n";
import BlogPostView from "@/components/blog/blog-post-view";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: { absolute: "Post not found | Glowly Journal" } };
  // Metadata is static (server-rendered) so it uses the English title/excerpt.
  const title = pick(post.title, "en");
  const description = pick(post.excerpt, "en");
  return {
    // Absolute: opts out of the root layout's `%s | Glowly` template so the
    // blog keeps its own "Glowly Journal" brand suffix instead of doubling up.
    title: { absolute: `${title} | Glowly Journal` },
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
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
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);

  // Raw (bilingual) data flows to the client view, which resolves it to the
  // reader's chosen language and re-renders instantly on toggle.
  return <BlogPostView post={post} related={related} />;
}
