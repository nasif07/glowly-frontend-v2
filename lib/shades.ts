import type { Product } from "@/types";

/**
 * Makeup shade helpers. The rules themselves live on the API
 * (glowly-backend/src/modules/product/product.validation.js) — these mirror
 * them for the admin form and read the API's shade errors back for the shop.
 */

/** A swatch colour, "#rrggbb". Mirrors the API's hex check. */
export const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

/** Products saved before `variantType` existed are standard. */
export function isShadeProduct(product?: Pick<Product, "variantType"> | null) {
  return product?.variantType === "shade";
}

/**
 * The shade errors `POST /orders` can answer with, keyed back to the product
 * title so checkout can point the customer at the right product page:
 *
 *   Please choose a shade for "Velvet Lipstick".
 *   The shade "Ruby 03" of "Velvet Lipstick" is out of stock.
 */
export function parseShadeOrderError(
  message: string,
): { kind: "missing" | "out-of-stock"; title: string; shade?: string } | null {
  const missing = message.match(/^Please choose a shade for "(.+)"\.$/);
  if (missing) return { kind: "missing", title: missing[1] };

  const soldOut = message.match(/^The shade "(.+)" of "(.+)" is out of stock\.$/);
  if (soldOut) return { kind: "out-of-stock", shade: soldOut[1], title: soldOut[2] };

  return null;
}

/**
 * The cart line a shade error is about. The title alone is ambiguous — the
 * same product can sit in the bag twice, once with a good shade — so prefer
 * the line the error actually describes: for a missing shade, one that wasn't
 * added as a shade line; for a sold-out shade, the one with that shade.
 */
export function findShadeErrorLine<
  T extends { title: string; isShade?: boolean; variant?: { color?: string } | null },
>(items: T[], error: NonNullable<ReturnType<typeof parseShadeOrderError>>) {
  const sameTitle = items.filter((item) => item.title === error.title);
  const described =
    error.kind === "missing"
      ? sameTitle.find((item) => !item.isShade || !item.variant)
      : sameTitle.find((item) => item.variant?.color === error.shade);
  return described ?? sameTitle[0];
}

/**
 * The SKU named by the API's cross-product clash (409):
 *   SKU "LIP-R03" is already used by "Matte Liner".
 */
export function parseSkuConflict(message: string): string | null {
  return message.match(/^SKU "(.+)" is already used by /)?.[1] ?? null;
}
