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

/**
 * bKash advance fields. The minimum comes from the store settings (`/settings`)
 * rather than a constant, because an admin can switch the shop to full cash on
 * delivery or change the required advance at any time.
 *
 * In cash-on-delivery mode these fields aren't collected at all, so the whole
 * object is optional there — see `makeCheckoutSchema`.
 */
export const makePaymentDetailsSchema = (minAdvance: number) =>
  z.object({
    senderNumber: z.string().min(1, "Your bKash number is required"),
    transactionId: z
      .string()
      .min(1, "Transaction ID is required")
      .transform((v) => v.toUpperCase()),
    advanceAmount: z.coerce
      .number()
      .min(minAdvance, `Minimum advance is ৳${minAdvance}`),
  });

export type PaymentDetailsInput = z.infer<
  ReturnType<typeof makePaymentDetailsSchema>
>;

const orderProductSchema = z.object({
  title: z.string(),
  productId: z.string(),
  variant: z.record(z.string(), z.unknown()).optional().default({}),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative(),
  image: z.string().optional(),
});

/**
 * POST /orders — full checkout payload, built against the live store settings.
 *
 * `advanceRequired: false` is full cash on delivery: the advance is 0, no bKash
 * details are sent, and the method is COD. Otherwise the advance must clear the
 * configured minimum. The backend re-derives all of this from the same settings
 * before saving, so this schema is for UX, not for trust.
 */
export const makeCreateOrderSchema = (
  advanceRequired: boolean,
  minAdvance: number,
) =>
  z.object({
    products: z.array(orderProductSchema).min(1, "Your cart is empty"),
    subtotal: z.coerce.number().nonnegative(),
    shippingCharge: z.coerce.number().nonnegative(),
    advanceAmount: advanceRequired
      ? z.coerce.number().min(minAdvance)
      : z.literal(0).default(0),
    dueAmount: z.coerce.number(),
    totalAmount: z.coerce.number().nonnegative(),
    shippingAddress: shippingAddressSchema,
    paymentMethod: advanceRequired
      ? z.literal("BKASH_MANUAL").default("BKASH_MANUAL")
      : z.literal("COD").default("COD"),
    paymentDetails: advanceRequired
      ? makePaymentDetailsSchema(minAdvance)
      : z.undefined().optional(),
  });

/** PATCH /orders/:id/status — { orderStatus }. */
export const updateOrderStatusSchema = z.object({
  orderStatus: orderStatusSchema,
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<ReturnType<typeof makeCreateOrderSchema>>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
