import { z } from "zod";

// Mirrors glowly-backend/src/modules/steadfast/steadfast.validation.js
const PHONE_REGEX = /^\d{11}$/;
const INVOICE_REGEX = /^[A-Za-z0-9]+$/;

const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_REGEX, "Phone number must be exactly 11 digits");

const invoiceSchema = z
  .string()
  .trim()
  .min(1, "Invoice is required")
  .max(50, "Invoice must be at most 50 characters")
  .regex(INVOICE_REGEX, "Invoice must be alphanumeric");

const recipientNameSchema = z
  .string()
  .trim()
  .min(1, "Recipient name is required")
  .max(100, "Recipient name must be at most 100 characters");

const recipientAddressSchema = z
  .string()
  .trim()
  .min(1, "Recipient address is required")
  .max(250, "Recipient address must be at most 250 characters");

const codAmountSchema = z.coerce
  .number({ message: "COD amount must be a number" })
  .min(0, "COD amount cannot be negative");

const deliveryTypeSchema = z
  .union([z.literal(0), z.literal(1)])
  .default(0);

/** POST /steadfast/orders */
export const createSteadfastOrderSchema = z.object({
  invoice: invoiceSchema,
  recipient_name: recipientNameSchema,
  recipient_phone: phoneSchema,
  recipient_address: recipientAddressSchema,
  cod_amount: codAmountSchema,
  alternative_phone: z.union([phoneSchema, z.literal("")]).optional(),
  recipient_email: z
    .union([z.string().trim().email("A valid email is required"), z.literal("")])
    .optional(),
  note: z.string().trim().max(500).optional(),
  item_description: z.string().trim().max(500).optional(),
  delivery_type: deliveryTypeSchema,
});

/** A single line item inside a bulk order request. */
export const steadfastBulkOrderItemSchema = z.object({
  invoice: invoiceSchema,
  recipient_name: recipientNameSchema,
  recipient_address: recipientAddressSchema,
  recipient_phone: phoneSchema,
  cod_amount: codAmountSchema,
  note: z.string().trim().max(500).optional(),
});

/** POST /steadfast/orders/bulk */
export const createSteadfastBulkOrderSchema = z.object({
  data: z
    .array(steadfastBulkOrderItemSchema)
    .min(1, "At least one order is required")
    .max(500, "Bulk order supports a maximum of 500 items per request"),
});

/**
 * POST /steadfast/return-requests
 * Exactly one of consignment_id / invoice / tracking_code is required.
 */
export const createSteadfastReturnRequestSchema = z
  .object({
    consignment_id: z.string().trim().optional(),
    invoice: z.string().trim().optional(),
    tracking_code: z.string().trim().optional(),
    reason: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) => Boolean(data.consignment_id || data.invoice || data.tracking_code),
    {
      message: "One of consignment ID, invoice, or tracking code is required",
      path: ["consignment_id"],
    },
  );

/** GET /steadfast/track — one identifier is required to search. */
export const trackSteadfastOrderSchema = z
  .object({
    consignmentId: z.string().trim().optional(),
    invoice: z.string().trim().optional(),
    trackingCode: z.string().trim().optional(),
  })
  .refine(
    (data) => Boolean(data.consignmentId || data.invoice || data.trackingCode),
    {
      message: "Enter a consignment ID, invoice, or tracking code",
      path: ["consignmentId"],
    },
  );

export type CreateSteadfastOrderInput = z.infer<typeof createSteadfastOrderSchema>;
export type SteadfastBulkOrderItemInput = z.infer<typeof steadfastBulkOrderItemSchema>;
export type CreateSteadfastBulkOrderInput = z.infer<typeof createSteadfastBulkOrderSchema>;
export type CreateSteadfastReturnRequestInput = z.infer<
  typeof createSteadfastReturnRequestSchema
>;
export type TrackSteadfastOrderInput = z.infer<typeof trackSteadfastOrderSchema>;
