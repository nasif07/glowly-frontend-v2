import type { Product, ProductVariant } from "@/types";

/**
 * Stock as the shop reads it when the API enforces stock (STOCK_ENFORCEMENT).
 * Mirrors glowly-backend/src/modules/product/product.stock.js, which the
 * order code and the Meta feed share: a product with variants sells from each
 * variant's stock, one without sells from `totalStock`, and "Pre-order"
 * products are never stock-checked.
 *
 * With the flag off every call site keeps its own original rule — see
 * `useStockEnforcement`.
 */

/** At or below this many units a variant is flagged as low in the admin. */
export const LOW_STOCK_THRESHOLD = 5;

type Stocked = Pick<Product, "stockStatus" | "totalStock" | "variants">;

export function isPreOrder(product?: Pick<Product, "stockStatus"> | null) {
  return product?.stockStatus === "Pre-order";
}

/** Units the product can sell: the variant sum, or `totalStock` without variants. */
export function sellableStock(product: Stocked): number {
  const variants = product.variants ?? [];
  if (variants.length > 0) {
    return variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  }
  return Number(product.totalStock) || 0;
}

/** Sold out by real stock. Pre-order products never are. */
export function isSoldOutByStock(product: Stocked): boolean {
  return !isPreOrder(product) && sellableStock(product) <= 0;
}

/** One variant or shade sold out by real stock. Pre-order products never are. */
export function isVariantSoldOutByStock(
  product: Pick<Product, "stockStatus">,
  variant: Pick<ProductVariant, "stock">,
): boolean {
  return !isPreOrder(product) && (Number(variant.stock) || 0) <= 0;
}

export type StockLevel = "out" | "low" | "ok";

export function stockLevel(units: number): StockLevel {
  if (units <= 0) return "out";
  if (units <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
}
