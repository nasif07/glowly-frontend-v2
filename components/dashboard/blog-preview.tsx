"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Eye,
  Newspaper,
  Pencil,
  Star,
  Tag,
  User,
  XCircle,
} from "lucide-react";

import { useBlog } from "@/hooks/use-blogs";
import { RichText } from "@/components/common/rich-text";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Button from "@/components/common/button";

/**
 * Reader's-eye view of an admin-authored post.
 *
 * Drafts have no public URL — /blog/[slug] serves published posts only — so
 * this is where an author checks an unpublished post before it goes live. It
 * renders through the same `<RichText>` the public page uses, so the styling
 * here is the styling a reader would get.
 */
export function BlogPreview({ id }: { id: string }) {
  const router = useRouter();
  const { data: blog, isLoading } = useBlog(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-[#6B4A3D]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#4B2E2B]" />
        <span className="ml-3 font-medium tracking-wide">Loading post...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Blog post not found
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-4">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <DashboardHeader
          title="Preview"
          Icon={Newspaper}
          onBack={() => router.back()}
        />
        <Link href={`/dashboard/blog/edit/${blog._id}`}>
          <Button
            variant="primary"
            className="flex items-center justify-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit Post
          </Button>
        </Link>
      </div>

      {/* Status strip — the things that decide whether readers see this at all */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {blog.isPublished ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[9px] font-bold text-emerald-700 uppercase">
            <CheckCircle2 className="h-3 w-3" /> Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-[9px] font-bold text-gray-500 uppercase">
            <XCircle className="h-3 w-3" /> Draft
          </span>
        )}
        {blog.isFeatured && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8D8C3] bg-[#F9F1E7] px-3 py-1 text-[9px] font-bold text-[#A67B5B] uppercase">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
        {blog.category && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8D8C3] bg-white px-3 py-1 text-[9px] font-bold text-[#6B4A3D] uppercase">
            <Tag className="h-3 w-3" /> {blog.category}
          </span>
        )}
        <span className="font-mono text-[10px] tracking-wider text-[#8C6A5E]">
          /blog/{blog.slug}
        </span>
      </div>

      <article className="overflow-hidden rounded-3xl border border-[#E8D8C3] bg-white">
        {blog.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="aspect-[2/1] w-full object-cover"
          />
        )}

        <div className="p-6 md:p-10">
          <h1 className="text-2xl leading-tight font-bold text-[#2D1B14] md:text-4xl">
            {blog.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-[#F3E9DC] py-3 text-[11px] font-semibold tracking-wider text-[#8C6A5E] uppercase">
            {blog.author && (
              <span className="flex items-center gap-1.5">
                <User size={13} /> {blog.author}
              </span>
            )}
            {blog.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye size={13} /> {blog.views ?? 0}
            </span>
          </div>

          {blog.excerpt && (
            <p className="mt-6 text-lg leading-relaxed font-medium text-[#5D4037]">
              {blog.excerpt}
            </p>
          )}

          <RichText html={blog.content} className="mt-6" />

          {blog.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-[#F3E9DC] pt-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-[#A67B5B]/30 px-3 py-1 text-xs font-semibold text-[#A67B5B]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
