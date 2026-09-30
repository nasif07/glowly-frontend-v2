import { SITE_NAME } from "@/lib/site";
import { richTextToPlain } from "@/lib/rich-text";
import type { Product } from "@/types";

/**
 * Helpers for the social/share metadata emitted by `generateMetadata`.
 *
 * Kept out of the page file so the fallback rules are testable and so other
 * routes (blog, shop) can reuse them without duplicating the fallback chain.
 */

/** Recommended ceiling for a share description before platforms truncate. */
const PREVIEW_DESCRIPTION_MAX = 200;

/**
 * Product images are normalised to 1000x1000 by the upload pipeline, so the
 * dimensions can be declared. Social platforms use them to reserve a large
 * card on the first scrape instead of waiting to measure the file.
 */
const PRODUCT_IMAGE_SIZE = { width: 1000, height: 1000 } as const;

/** Site-wide share image, used whenever a product has no image of its own. */
const FALLBACK_IMAGE = {
  url: "/glowlyCover.png",
  width: 1915,
  height: 709,
  alt: `${SITE_NAME} — authentic skincare in Bangladesh`,
} as const;

/**
 * Collapse whitespace and clip to a whole word.
 *
 * Product copy arrives with embedded newlines from the admin editor, which
 * render as literal line breaks inside a preview card.
 */
export function truncateForPreview(
  text: string | undefined | null,
  max: number = PREVIEW_DESCRIPTION_MAX,
): string | undefined {
  const clean = text?.replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;

  const clipped = clean.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");
  // Fall back to a hard cut for text with no spaces in range.
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:.\s]+$/, "")}…`;
}

/**
 * Drop a brand suffix an admin already typed into `metaTitle`.
 *
 * The root layout applies a `%s | Glowly` title template, so a stored
 * "Toner | Glowly" would otherwise render as "Toner | Glowly | Glowly".
 * Normalising here means either stored convention ends up with exactly one.
 */
export function stripBrandSuffix(title: string): string {
  return title.replace(/\s*[|\-–—]\s*glowly\s*$/i, "").trim() || title.trim();
}

/**
 * Share images for a product, largest first, with the site cover as a fallback
 * so a product with no photo still previews as a card rather than a bare link.
 */
export function productShareImages(product: Product) {
  const images = (product.images ?? []).filter((image) => Boolean(image?.url));

  if (images.length === 0) return [FALLBACK_IMAGE];

  return images.map((image) => ({
    url: image.url,
    ...PRODUCT_IMAGE_SIZE,
    alt: image.altText || product.title,
  }));
}

/**
 * Description for a product share card, in order of preference.
 *
 * `fullDescription` is authored as rich text, so it is flattened first —
 * otherwise the markup ends up inside the meta tag.
 */
export function productShareDescription(product: Product) {
  return (
    truncateForPreview(product.metaDescription) ??
    truncateForPreview(product.shortDescription) ??
    truncateForPreview(richTextToPlain(product.fullDescription))
  );
}
