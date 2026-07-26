"use client";

import { create } from "zustand";
import type { CartItem } from "@/types";
import type { Product, ProductVariant } from "@/types";

/**
 * Client-side cart. There are no server endpoints for the cart in the original
 * app — it lived in localStorage under `glowlyCart` and synced via a
 * `cartUpdated` window event. This store replaces both: it persists to the same
 * key (raw array) and Zustand's subscriptions handle cross-component sync.
 */

const STORAGE_KEY = "glowlyCart";
const SHIPPING_CHARGE = 120;

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
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
          price: product.discountPrice || product.price || variant?.price || 0,
          image: product.images?.[0]?.url,
          variant,
          quantity,
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

export const CART_SHIPPING_CHARGE = SHIPPING_CHARGE;
