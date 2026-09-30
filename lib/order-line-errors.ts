import { getFieldErrors } from "@/lib/api-error";
import { findShadeErrorLine, parseShadeOrderError } from "@/lib/shades";

/**
 * `POST /orders` refusals that are about one cart line — a missing shade or
 * option, or not enough stock — read back into something checkout can act on:
 * which line, and what the customer should do about it.
 *
 * The API names the line as `products.<index>` in `error.details`, the index
 * into the cart as it was sent. Messages come from
 * glowly-backend/src/modules/order (order.services.js, order.stock.js).
 */

export type OrderLineAction =
  | "choose-shade"
  | "choose-option"
  | "pick-shade"
  | "view-product";

export const ORDER_LINE_ACTION_LABEL: Record<OrderLineAction, string> = {
  "choose-shade": "Choose a shade",
  "choose-option": "Choose an option",
  "pick-shade": "Pick another shade",
  "view-product": "View product",
};

/** What a line error asks of the customer, or null if it isn't one. */
export function orderLineAction(message: string): OrderLineAction | null {
  if (/^Please choose a shade for ".+"\.$/.test(message)) return "choose-shade";
  if (/^Please choose an option for ".+"\.$/.test(message)) return "choose-option";
  if (
    /^The shade ".+" of ".+" is out of stock\.$/.test(message) ||
    /^Only \d+ left of the shade ".+" of ".+"\.$/.test(message)
  ) {
    return "pick-shade";
  }
  if (/ is out of stock\.$/.test(message) || /^Only \d+ left of ".+/.test(message)) {
    return "view-product";
  }
  return null;
}

/**
 * The line an order error is about, and what to do. Falls back to matching
 * the product title for the shade errors, in case the API didn't name a line.
 */
export function findOrderLineProblem<
  T extends {
    title: string;
    isShade?: boolean;
    variant?: { color?: string } | null;
  },
>(error: unknown, message: string, items: T[]) {
  const action = orderLineAction(message);
  if (!action) return null;

  const lineKey = Object.keys(getFieldErrors(error)).find((key) =>
    /^products\.\d+$/.test(key),
  );
  let item: T | undefined = lineKey
    ? items[Number(lineKey.split(".")[1])]
    : undefined;

  if (!item) {
    const shadeError = parseShadeOrderError(message);
    if (shadeError) item = findShadeErrorLine(items, shadeError);
  }

  return { message, action, item };
}
