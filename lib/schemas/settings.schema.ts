import { z } from "zod";

/**
 * Store payment policy. `advanceAmount` is always carried, even in cash-on-
 * delivery mode, so an admin who toggles back gets their old figure returned
 * rather than a blank field.
 */
export const storeSettingsSchema = z
  .object({
    advanceRequired: z.boolean(),
    advanceAmount: z.coerce
      .number()
      .nonnegative("Advance amount cannot be negative"),
  })
  .refine((v) => !v.advanceRequired || v.advanceAmount > 0, {
    message: "Enter an advance amount greater than ৳0",
    path: ["advanceAmount"],
  });

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
