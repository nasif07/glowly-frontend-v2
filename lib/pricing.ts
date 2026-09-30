import type { Product, ProductVariant } from "@/types";

type Priced = Pick<Product, "price" | "discountPrice">;

/**
 * The discounted price, or `null` when there is no genuine discount.
 *
 * `discountPrice` is optional on the API and defaults to 0, and nothing
 * server-side stops an admin typing a figure at or above the list price — so
 * it only counts as a discount when it actually sits below `price`.
 */
export function getSalePrice(product: Priced): number | null {
  const listPrice = Number(product.price) || 0;
  const salePrice = Number(product.discountPrice) || 0;
  return salePrice > 0 && salePrice < listPrice ? salePrice : null;
}

/**
 * What the customer is actually charged for a given variant selection — the
 * single source of truth for the shop card, the detail page and the cart.
 *
 * A variant's own price wins only when it was deliberately priced apart. The
 * admin product form seeds every variant with the product's `price`, so
 * `variant.price === product.price` means "not priced apart"; treating that as
 * an override silently threw the discount away for every product with
 * variants, quoting the full price on the detail page while the shop card
 * still advertised the discounted one.
 */
export function getUnitPrice(
  product: Priced,
  variant?: Pick<ProductVariant, "price"> | null,
): number {
  const listPrice = Number(product.price) || 0;
  const variantPrice = Number(variant?.price) || 0;

  if (variantPrice > 0 && variantPrice !== listPrice) return variantPrice;

  return getSalePrice(product) ?? listPrice;
}

/**
 * The list price to strike through, or `null` when it isn't above what's being
 * charged — striking a price at or below the live one reads as a price rise.
 */
export function getListPrice(product: Priced, unitPrice: number): number | null {
  const listPrice = Number(product.price) || 0;
  return listPrice > unitPrice ? listPrice : null;
}

/** Whole-percent saving off the list price, or `null` when there is none. */
export function getDiscountPercentage(
  product: Priced,
  unitPrice: number = getUnitPrice(product),
): number | null {
  const listPrice = getListPrice(product, unitPrice);
  if (!listPrice) return null;

  const percentage = Math.round(((listPrice - unitPrice) / listPrice) * 100);
  return percentage > 0 ? percentage : null;
}
