import { z } from "zod";

export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const shippingAddressSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "Please select your district"),
  thana: z.string().min(1, "Please select your Thana/Upazila"),
});

const MIN_ADVANCE = 200;

export const paymentDetailsSchema = z.object({
  senderNumber: z.string().min(1, "Your bKash number is required"),
  transactionId: z
    .string()
    .min(1, "Transaction ID is required")
    .transform((v) => v.toUpperCase()),
  advanceAmount: z.coerce
    .number()
    .min(MIN_ADVANCE, `Minimum advance is ৳${MIN_ADVANCE}`),
});

const orderProductSchema = z.object({
  title: z.string(),
  productId: z.string(),
  variant: z.record(z.string(), z.unknown()).optional().default({}),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative(),
  image: z.string().optional(),
});

/** POST /orders — full checkout payload. */
export const createOrderSchema = z.object({
  products: z.array(orderProductSchema).min(1, "Your cart is empty"),
  subtotal: z.coerce.number().nonnegative(),
  shippingCharge: z.coerce.number().nonnegative(),
  advanceAmount: z.coerce.number().min(MIN_ADVANCE),
  dueAmount: z.coerce.number(),
  totalAmount: z.coerce.number().nonnegative(),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.literal("BKASH_MANUAL").default("BKASH_MANUAL"),
  paymentDetails: paymentDetailsSchema,
});

/** PATCH /orders/:id/status — { orderStatus }. */
export const updateOrderStatusSchema = z.object({
  orderStatus: orderStatusSchema,
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type PaymentDetailsInput = z.infer<typeof paymentDetailsSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
