import { api } from "./axios";
import type { User } from "@/types";

interface TrackEventData {
  email?: string;
  phone?: string;
  external_id?: string;
  value?: number;
  currency?: string;
  content_ids?: string[];
}

/**
 * Fire-and-forget POST to the backend's Meta Conversions API relay
 * (`glowly-backend` /track-event, see `src/modules/tracking`). Tracking must
 * never block or fail the surrounding UI action, so errors are swallowed.
 */
async function trackEvent(eventName: string, data: TrackEventData) {
  try {
    await api.post("/track-event", { eventName, data });
  } catch {
    // Non-blocking by design — see tracking.controller.js's own comment.
  }
}

function userData(
  user?: User | null,
): Pick<TrackEventData, "email" | "phone" | "external_id"> {
  if (!user) return {};
  return {
    email: user.email || undefined,
    phone: user.phoneNumber || undefined,
    external_id: user._id,
  };
}

interface TrackableProduct {
  _id: string;
  price: number;
  discountPrice?: number;
}

/** Tracked when a product page is viewed. */
export function trackViewContent(product: TrackableProduct, user?: User | null) {
  trackEvent("ViewContent", {
    ...userData(user),
    value: product.discountPrice || product.price || 0,
    currency: "BDT",
    content_ids: [product._id],
  });
}

/** Tracked when an item is added to the cart (product card or product page). */
export function trackAddToCart(
  product: TrackableProduct,
  quantity: number,
  user?: User | null,
) {
  trackEvent("AddToCart", {
    ...userData(user),
    value: (product.discountPrice || product.price || 0) * quantity,
    currency: "BDT",
    content_ids: [product._id],
  });
}

/** Tracked when the checkout page loads with a non-empty cart. */
export function trackInitiateCheckout(
  items: { _id: string }[],
  totalAmount: number,
  user?: User | null,
) {
  if (!items.length) return;
  trackEvent("InitiateCheckout", {
    ...userData(user),
    value: totalAmount,
    currency: "BDT",
    content_ids: items.map((item) => item._id),
  });
}

/** Tracked right after an order is successfully created. */
export function trackPurchase(
  order: { totalAmount: number; products?: { productId: string }[] },
  user?: User | null,
) {
  trackEvent("Purchase", {
    ...userData(user),
    value: order.totalAmount,
    currency: "BDT",
    content_ids: (order.products ?? []).map((p) => p.productId),
  });
}
