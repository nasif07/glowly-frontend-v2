import { z } from "zod";

/** Hero banner overlay copy + published flag (all optional — partial updates). */
export const heroBannerSchema = z.object({
  title: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
  ctaText: z.string().optional().default(""),
  ctaLink: z.string().optional().default(""),
  isPublished: z.boolean().default(false),
});

export type HeroBannerInput = z.infer<typeof heroBannerSchema>;

/** A single hero slide (image or video). */
export const heroSlideSchema = z.object({
  type: z.enum(["image", "video"]),
  mediaUrl: z.string().url("A valid media URL is required"),
  title: z.string().optional().default(""),
  isActive: z.boolean().default(true),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
