import { z } from "zod";

/**
 * Create/update blog form (mirrors ProductForm's defaultValues + onSubmit
 * coercions). `tags` empty-string entries are filtered out on submit.
 */
export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url().optional().or(z.literal("")),
  featuredImageKey: z.string().nullable().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export type BlogInput = z.infer<typeof blogSchema>;
