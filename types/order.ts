export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "COD" | "ONLINE" | "BKASH_MANUAL";

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  /** District name. */
  city: string;
  thana: string;
}

export interface PaymentDetails {
  senderNumber: string;
  transactionId: string;
  advanceAmount: number;
}

/**
 * The variant snapshot on an order line. Orders placed before shades existed
 * carry only color/size/weight (or nothing) — a missing `isShade` means a
 * non-shade line.
 */
export interface OrderItemVariant {
  variantId?: string;
  isShade?: boolean;
  /** The shade name, on a shade line. */
  color?: string;
  size?: string;
  weight?: string;
  sku?: string;
  hex?: string;
}

/**
 * A line item as stored on the order. The API persists these under `items`
 * with the product reference named `product`, even though `POST /orders`
 * accepts them under `products`/`productId` — see `makeCreateOrderSchema`.
 */
export interface OrderItem {
  /** The product this line was bought from, when it still exists. */
  product?: string;
  /** Title snapshot taken at checkout. */
  title: string;
  variant?: OrderItemVariant;
  quantity: number;
  price: number;
  image?: string;
  /** A combo line; `bundleItems` quantities are per combo. */
  isBundle?: boolean;
  bundleItems?: OrderBundleItem[];
}

export interface OrderBundleItem {
  product?: string;
  title: string;
  quantity: number;
  variant?: OrderItemVariant;
}

export interface OrderCourier {
  provider: "steadfast";
  consignmentId: number;
  trackingCode: string;
  status: string;
  sentAt: string;
}

export interface Order {
  _id: string;
  orderId?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  /** Flat discount (৳) set by an admin; absent on older orders. */
  discount?: number;
  advanceAmount: number;
  dueAmount: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  orderStatus: OrderStatus;
  courier?: OrderCourier;
  createdAt?: string;
  updatedAt?: string;
}
