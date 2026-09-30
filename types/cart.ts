import type { ProductVariant } from "./product";

/**
 * A cart line item as persisted in localStorage under `glowlyCart`.
 * `cartId` is `${productId}-${variantId}` (or just the product id when there
 * is no variant), so the same product in different variants stays distinct.
 */
export interface CartItem {
  cartId: string;
  _id: string;
  title: string;
  price: number;
  image?: string;
  variant?: ProductVariant | null;
  /**
   * The product was a shade product when this line was added. Lines saved
   * before shades existed have neither this nor `slug`.
   */
  isShade?: boolean;
  /** For linking back to the product page. */
  slug?: string;
  quantity: number;
  /** A combo line: what's in the box, for the cart and checkout summaries. */
  isBundle?: boolean;
  bundleContents?: { title: string; quantity: number; option?: string }[];
}
