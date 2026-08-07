import { z } from "zod";

/**
 * Create/update category form. `parentCategory` is an empty string in the form
 * and normalised to `null` (root category) before sending.
 */
export const categorySchema = z.object({
  name: z.string().min(1, "A name is required"),
  slug: z.string().min(1, "Slug is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  showOnLanding: z.boolean().default(false),
  parentCategory: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .default(null),
});

export type CategoryInput = z.infer<typeof categorySchema>;
