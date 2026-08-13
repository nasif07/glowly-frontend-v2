import { z } from "zod";

export const stockStatusSchema = z.enum([
  "In Stock",
  "Out of Stock",
  "Pre-order",
]);

export const productVariantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  // Coerced because the form inputs are strings.
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().default(0),
});

export const productImageSchema = z.object({
  url: z.string().url(),
  key: z.string().nullable().optional(),
  altText: z.string().optional().default(""),
});

/**
 * Create/update product form (mirrors AddProduct's defaultValues + onSubmit
 * coercions). The empty-string list entries are filtered out on submit.
 */
export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  price: z.coerce.number().positive("Price is required"),
  discountPrice: z.coerce.number().nonnegative().default(0),
  stockStatus: stockStatusSchema.default("In Stock"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  howToUse: z.string().optional(),
  fullIngredientList: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  tags: z.array(z.string()).default([]),
  keyBenefits: z.array(z.string()).default([]),
  keyIngredients: z.array(z.string()).default([]),
  whoShouldUse: z.array(z.string()).default([]),
  images: z.array(productImageSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
export type ProductInput = z.infer<typeof productSchema>;
