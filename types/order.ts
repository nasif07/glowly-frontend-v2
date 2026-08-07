import type { ProductVariant } from "./product";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "BKASH_MANUAL";

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

/** A line item as stored on the order. */
export interface OrderProduct {
  title: string;
  productId: string;
  variant?: ProductVariant | Record<string, never>;
  quantity: number;
  price: number;
  image?: string;
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
  products: OrderProduct[];
  subtotal: number;
  shippingCharge: number;
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
