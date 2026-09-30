import { z } from "zod";
import { HEX_PATTERN } from "@/lib/shades";
import { SKIN_CONCERN_VALUES, SKIN_TYPE_VALUES } from "@/lib/skin";

export const stockStatusSchema = z.enum([
  "In Stock",
  "Out of Stock",
  "Pre-order",
]);

export const productVariantSchema = z.object({
  // Sent back unchanged so the API keeps the variant's id — carts and
  // `?shade=<id>` links point at it. Zod would otherwise strip it.
  _id: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  // Coerced because the form inputs are strings.
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().default(0),
  // Shade fields. Blank values are dropped by the API.
  hex: z.string().optional(),
  sku: z.string().optional(),
  image: z
    .object({ url: z.string().url(), key: z.string().nullable().optional() })
    .nullable()
    .optional(),
});

/** One product in a combo. `variantId` is required only for an item with several variants. */
export const bundleItemSchema = z.object({
  product: z.string().min(1, "Pick a product"),
  variantId: z.string().nullable().optional(),
  quantity: z.coerce.number().int().min(1, "At least 1"),
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
  // Optional: "" is "No brand", which the API stores as none.
  brand: z.string().default(""),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  howToUse: z.string().optional(),
  fullIngredientList: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  tags: z.array(z.string()).default([]),
  keyBenefits: z.array(z.string()).default([]),
  keyIngredients: z.array(z.string()).default([]),
  whoShouldUse: z.array(z.string()).default([]),
  skinTypes: z.array(z.enum(SKIN_TYPE_VALUES)).default([]),
  skinConcerns: z.array(z.enum(SKIN_CONCERN_VALUES)).default([]),
  productType: z.enum(["single", "bundle"]).default("single"),
  bundleItems: z.array(bundleItemSchema).default([]),
  images: z.array(productImageSchema).default([]),
  variantType: z.enum(["standard", "shade"]).default("standard"),
  // Stock of a product without variants. With variants the API derives it
  // (their sum) and ignores this.
  totalStock: z.coerce.number().int().nonnegative().optional(),
  variants: z.array(productVariantSchema).default([]),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type BundleItemInput = z.infer<typeof bundleItemSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
export type ProductInput = z.infer<typeof productSchema>;

/**
 * What the admin product form validates against. A discount at or above the
 * list price is not a discount — the shop would end up striking through a
 * figure below the one it is actually charging. 0 means "no sale", so only a
 * non-zero discount is checked.
 */
export const productFormSchema = productSchema
  .refine((p) => !p.discountPrice || p.discountPrice < p.price, {
    path: ["discountPrice"],
    message: "Discount price must be below the regular price",
  })
  .superRefine((p, ctx) => {
    // Mirrors `findBundleIssues` on the API. A combo has no variants, so the
    // variant rules below don't apply to it.
    if (p.productType === "bundle") {
      const units = p.bundleItems.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0,
      );
      if (units < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bundleItems"],
          message: "A combo needs at least two items.",
        });
      }
      const seen = new Set<string>();
      p.bundleItems.forEach((item, i) => {
        const key = `${item.product}:${item.variantId || "-"}`;
        if (seen.has(key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["bundleItems", i, "product"],
            message:
              "This item is already in the combo — raise its quantity instead.",
          });
        }
        seen.add(key);
      });
      return;
    }

    // Mirrors `findVariantIssues` on the API, so the admin sees these on the
    // right row before a round trip. The API still enforces them.
    const seen = new Set<string>();
    p.variants.forEach((v, i) => {
      const sku = v.sku?.trim().toUpperCase();
      if (!sku) return;
      if (seen.has(sku)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", i, "sku"],
          message: `SKU "${sku}" is used by more than one variant.`,
        });
      }
      seen.add(sku);
    });

    if (p.variantType !== "shade") return;

    if (p.variants.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message: "A shade product needs at least one shade.",
      });
    }
    p.variants.forEach((v, i) => {
      if (!v.color?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", i, "color"],
          message: "Each shade needs a name.",
        });
      }
      if (!v.hex?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", i, "hex"],
          message: "Each shade needs a swatch colour.",
        });
      } else if (!HEX_PATTERN.test(v.hex.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", i, "hex"],
          message: "Shade colour must be a hex code like #c2185b",
        });
      }
    });
  });
