import { api } from "./axios";
import type { ProductVariant, User } from "@/types";
import { getUnitPrice } from "./pricing";
import { fbqTrack, getMetaCookies, newEventId } from "./pixel";

const CURRENCY = "BDT";

interface TrackContent {
  id: string;
  quantity: number;
  item_price?: number;
}

/** Customer details — sent to the backend only, which hashes them for Meta. */
interface TrackUserData {
  email?: string;
  phone?: string;
  external_id?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
}

interface TrackEventData extends TrackUserData {
  value?: number;
  currency?: string;
  contents?: TrackContent[];
  content_name?: string;
  num_items?: number;
  order_id?: string;
  search_string?: string;
}

/**
 * Fires the event twice — once through the browser Meta Pixel and once through
 * the backend's Conversions API relay (`glowly-backend` /track-event, see
 * `src/modules/tracking`) — with one shared event id so Meta de-duplicates
 * them. Tracking must never block or fail the surrounding UI action, so
 * errors are swallowed.
 */
async function trackEvent(eventName: string, data: TrackEventData) {
  const eventId = newEventId();
  // Personal data stays out of the browser event; the server hashes it.
  const { value, currency, contents, content_name, num_items, order_id, search_string } =
    data;
  const content_ids = contents?.map((content) => content.id);

  fbqTrack(
    eventName,
    {
      value,
      currency,
      content_name,
      num_items,
      order_id,
      search_string,
      ...(contents?.length && { contents, content_ids, content_type: "product" }),
    },
    eventId,
  );

  try {
    await api.post("/track-event", {
      eventName,
      data: {
        ...data,
        content_ids,
        ...getMetaCookies(),
        event_id: eventId,
        event_source_url: window.location.href,
      },
    });
  } catch {
    // Non-blocking by design — see tracking.controller.js's own comment.
  }
}

function splitName(name?: string): Pick<TrackUserData, "first_name" | "last_name"> {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (!parts.length) return {};
  return {
    first_name: parts[0],
    last_name: parts.length > 1 ? parts[parts.length - 1] : undefined,
  };
}

function userData(user?: User | null): TrackUserData {
  if (!user) return {};
  return {
    email: user.email || undefined,
    phone: user.phoneNumber || undefined,
    external_id: user._id,
    ...splitName(user.fullName || user.name),
  };
}

/**
 * One content entry per product: a product in the cart twice (two shades)
 * would otherwise appear twice, which Meta reads as two catalog items.
 */
function mergeContents(contents: TrackContent[]): TrackContent[] {
  const byId = new Map<string, TrackContent>();
  for (const content of contents) {
    const existing = byId.get(content.id);
    if (existing) existing.quantity += content.quantity;
    else byId.set(content.id, { ...content });
  }
  return [...byId.values()];
}

const sumQuantity = (contents: TrackContent[]) =>
  contents.reduce((sum, content) => sum + content.quantity, 0);

interface TrackableProduct {
  _id: string;
  title: string;
  price: number;
  discountPrice: number;
}

/** Tracked when a product page is viewed. */
export function trackViewContent(product: TrackableProduct, user?: User | null) {
  const price = getUnitPrice(product);
  trackEvent("ViewContent", {
    ...userData(user),
    value: price,
    currency: CURRENCY,
    content_name: product.title,
    contents: [{ id: product._id, quantity: 1, item_price: price }],
  });
}

/** Tracked when an item is added to the cart (product card or product page). */
export function trackAddToCart(
  product: TrackableProduct,
  quantity: number,
  user?: User | null,
  variant?: Pick<ProductVariant, "price"> | null,
) {
  const price = getUnitPrice(product, variant);
  trackEvent("AddToCart", {
    ...userData(user),
    value: price * quantity,
    currency: CURRENCY,
    content_name: product.title,
    num_items: quantity,
    contents: [{ id: product._id, quantity, item_price: price }],
  });
}

/** Tracked when the checkout page loads with a non-empty cart. */
export function trackInitiateCheckout(
  items: { _id: string; quantity: number; price: number }[],
  totalAmount: number,
  user?: User | null,
) {
  if (!items.length) return;
  const contents = mergeContents(
    items.map((item) => ({
      id: item._id,
      quantity: Number(item.quantity) || 1,
      item_price: Number(item.price) || undefined,
    })),
  );
  trackEvent("InitiateCheckout", {
    ...userData(user),
    value: totalAmount,
    currency: CURRENCY,
    num_items: sumQuantity(contents),
    contents,
  });
}

interface TrackableOrder {
  _id?: string;
  orderId?: string;
  totalAmount: number;
  items?: {
    product?: string | { _id: string } | null;
    quantity?: number;
    price?: number;
  }[];
}

/** What the customer typed at checkout — the only customer data a guest order has. */
interface CheckoutCustomer {
  name?: string;
  phone?: string;
  city?: string;
}

/** Tracked right after an order is successfully created. */
export function trackPurchase(
  order: TrackableOrder,
  user?: User | null,
  customer?: CheckoutCustomer,
) {
  const contents = mergeContents(
    (order.items ?? []).flatMap((item) => {
      const id = typeof item.product === "string" ? item.product : item.product?._id;
      if (!id) return [];
      return [
        {
          id,
          quantity: Number(item.quantity) || 1,
          item_price: Number(item.price) || undefined,
        },
      ];
    }),
  );

  const profile = userData(user);
  const typedName = splitName(customer?.name);

  trackEvent("Purchase", {
    // What was typed at checkout wins; the account profile fills the gaps.
    ...profile,
    first_name: typedName.first_name || profile.first_name,
    last_name: typedName.last_name || profile.last_name,
    phone: customer?.phone || profile.phone,
    city: customer?.city,
    value: order.totalAmount,
    currency: CURRENCY,
    order_id: order.orderId || order._id,
    num_items: sumQuantity(contents),
    contents,
  });
}

/** Tracked when a shopper submits a search. */
export function trackSearch(searchQuery: string, user?: User | null) {
  trackEvent("Search", {
    ...userData(user),
    currency: CURRENCY,
    search_string: searchQuery,
  });
}
