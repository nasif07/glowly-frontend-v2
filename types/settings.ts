/**
 * Store-wide settings (singleton) — mirrors the backend `/settings` module.
 * Currently just the checkout payment policy, which applies to every product.
 */
export interface StoreSettings {
  _id: string;
  /** false => full cash on delivery; no advance is collected at checkout. */
  advanceRequired: boolean;
  /** Minimum advance (৳) when `advanceRequired`. Ignored otherwise. */
  advanceAmount: number;
  createdAt?: string;
  updatedAt?: string;
}
