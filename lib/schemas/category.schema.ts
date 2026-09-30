import { z } from "zod";

/**
 * Create/update category form.
 *
 * Both `parentCategory` and `image` are empty strings while the form is open —
 * a `<select>` and an uploader can't hold `null` — and are normalised to
 * `null` on the way out. The API validates `image` as a URL, so sending the
 * raw "" rejected every category saved without a cover image.
 */
export const categorySchema = z.object({
  name: z.string().min(1, "A name is required"),
  slug: z.string().min(1, "Slug is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  image: z
    .string()
    .url("Enter a valid image URL")
    .or(z.literal(""))
    .optional()
    .transform((v) => (v ? v : null))
    .nullable(),
  imageKey: z.string().nullable().optional(),
  showOnLanding: z.boolean().default(false),
  parentCategory: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .default(null),
});

export type CategoryInput = z.infer<typeof categorySchema>;
