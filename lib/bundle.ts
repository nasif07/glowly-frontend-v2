import type {
  BundleComponent,
  Product,
  ProductVariant,
} from "@/types";
import { getUnitPrice } from "@/lib/pricing";

/**
 * Combos ("bundle" products): one product at its own price, made of other
 * products. The API works out a combo's stock from its items and returns it
 * as `totalStock`, so every stock rule in lib/stock.ts applies unchanged.
 */

export function isBundleProduct(
  product?: Pick<Product, "productType"> | null,
): boolean {
  return product?.productType === "bundle";
}

/** "Rose · 50ml" — how a variant or shade is named to a customer. */
export function variantName(
  variant?: Pick<ProductVariant, "color" | "size" | "weight"> | null,
): string {
  return [variant?.color, variant?.size, variant?.weight]
    .filter(Boolean)
    .join(" · ");
}

export interface ResolvedBundleItem {
  product: BundleComponent;
  /** The variant that goes in the box, when the item has variants. */
  variant: ProductVariant | null;
  quantity: number;
}

/**
 * A combo's items with their products populated (the API does that on every
 * read). Items whose product didn't come back are left out.
 */
export function bundleItems(
  product?: Pick<Product, "bundleItems"> | null,
): ResolvedBundleItem[] {
  return (product?.bundleItems ?? []).flatMap((item) => {
    if (!item.product || typeof item.product !== "object") return [];
    const variants = item.product.variants ?? [];
    const variant =
      variants.find((v) => item.variantId && v._id === item.variantId) ??
      (variants.length === 1 ? variants[0] : null);
    return [
      {
        product: item.product,
        variant,
        quantity: Number(item.quantity) || 1,
      },
    ];
  });
}

/**
 * What the items would cost bought one by one — the figure a combo's price
 * is compared against. Null when it can't be worked out.
 */
export function bundleWorth(
  product?: Pick<Product, "bundleItems"> | null,
): number | null {
  const items = bundleItems(product);
  if (!items.length) return null;
  return items.reduce(
    (sum, item) =>
      sum + getUnitPrice(item.product, item.variant) * item.quantity,
    0,
  );
}

/** Units in the box, counting quantities. */
export function bundleUnitCount(
  product?: Pick<Product, "bundleItems"> | null,
): number {
  return (product?.bundleItems ?? []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0,
  );
}
