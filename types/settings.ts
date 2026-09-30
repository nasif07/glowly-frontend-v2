/**
 * Store-wide settings (singleton) — mirrors the backend `/settings` module.
 * The checkout payment policy and delivery charge, applied to every order.
 */
export interface StoreSettings {
  _id: string;
  /** false => full cash on delivery; no advance is collected at checkout. */
  advanceRequired: boolean;
  /** Minimum advance (৳) when `advanceRequired`. Ignored otherwise. */
  advanceAmount: number;
  /** false => free delivery; orders carry a ৳0 shipping charge. */
  deliveryChargeEnabled: boolean;
  /** Flat delivery charge (৳) when `deliveryChargeEnabled`. Ignored otherwise. */
  deliveryCharge: number;
  /**
   * The API's STOCK_ENFORCEMENT switch (read-only, from its environment).
   * When true, orders take real stock and the shop shows "sold out" from it.
   */
  stockEnforcement?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
