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
  quantity: number;
}
