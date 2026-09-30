"use client";

import { create } from "zustand";
import type { CartItem } from "@/types";
import type { Product, ProductVariant } from "@/types";
import { getUnitPrice } from "@/lib/pricing";
import { isShadeProduct } from "@/lib/shades";
import { bundleItems, isBundleProduct, variantName } from "@/lib/bundle";

/**
 * Client-side cart. There are no server endpoints for the cart in the original
 * app — it lived in localStorage under `glowlyCart` and synced via a
 * `cartUpdated` window event. This store replaces both: it persists to the same
 * key (raw array) and Zustand's subscriptions handle cross-component sync.
 */

const STORAGE_KEY = "glowlyCart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Carts outlive deploys: drop anything that isn't a usable line rather
    // than let one malformed entry break the cart and checkout pages.
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is CartItem =>
            !!item &&
            typeof item === "object" &&
            typeof item.cartId === "string" &&
            typeof item._id === "string",
        )
      : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/** Build a stable cart id: `${productId}-${variantId}` (or just the product id). */
function buildCartId(productId: string, variant?: ProductVariant | null) {
  return variant?._id ? `${productId}-${variant._id}` : productId;
}

interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    variant?: ProductVariant | null,
    quantity?: number,
  ) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  setQuantity: (cartId: string, quantity: number) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: loadCart(),

  addItem: (product, variant = null, quantity = 1) =>
    set((state) => {
      const cartId = buildCartId(product._id, variant);
      const existing = state.items.find((i) => i.cartId === cartId);

      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.cartId === cartId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      } else {
        const newItem: CartItem = {
          cartId,
          _id: product._id,
          title: product.title,
          // Charged at whatever the product page quoted for this selection —
          // the discount, or a variant priced apart from the base price.
          price: getUnitPrice(product, variant),
          // A shade's own shot, when it has one, is what they picked.
          image: variant?.image?.url || product.images?.[0]?.url,
          variant,
          isShade: isShadeProduct(product),
          slug: product.slug,
          quantity,
          ...(isBundleProduct(product) && {
            isBundle: true,
            bundleContents: bundleItems(product).map((item) => ({
              title: item.product.title,
              quantity: item.quantity,
              option: variantName(item.variant) || undefined,
            })),
          }),
        };
        items = [...state.items, newItem];
      }
      persist(items);
      return { items };
    }),

  updateQuantity: (cartId, delta) =>
    set((state) => {
      const items = state.items.map((i) =>
        i.cartId === cartId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i,
      );
      persist(items);
      return { items };
    }),

  setQuantity: (cartId, quantity) =>
    set((state) => {
      const items = state.items.map((i) =>
        i.cartId === cartId ? { ...i, quantity: Math.max(1, quantity) } : i,
      );
      persist(items);
      return { items };
    }),

  removeItem: (cartId) =>
    set((state) => {
      const items = state.items.filter((i) => i.cartId !== cartId);
      persist(items);
      return { items };
    }),

  clearCart: () =>
    set(() => {
      persist([]);
      return { items: [] };
    }),
}));

// Cross-tab sync: mirror the original navbar's `storage` listener so the cart
// stays consistent across tabs/windows (client only, registered once).
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      useCartStore.setState({ items: loadCart() });
    }
  });
}

/* ----------------------- Derived selectors ----------------------- */

export function useCartCount() {
  return useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
}

export function useCartSubtotal() {
  return useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  );
}
