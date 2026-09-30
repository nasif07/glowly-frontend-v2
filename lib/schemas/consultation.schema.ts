import { z } from "zod";

import { CONSULT_UI } from "@/lib/consultation-i18n";
import type { Lang } from "@/lib/i18n";
import { AGE_RANGES, SKIN_TYPES } from "@/types";

/**
 * The skin consultation form, with messages in the reader's language. Mirrors
 * submitConsultationSchema on the API (consultation.validation.js); photos are
 * checked separately because they upload before the form is sent.
 */
export const makeConsultationFormSchema = (lang: Lang) => {
  const t = (key: keyof typeof CONSULT_UI) => CONSULT_UI[key][lang];

  return z.object({
    name: z.string().trim().min(2, t("nameRequired")).max(100),
    // Same normalising as checkout: "+880 1812-345678" → "01812345678".
    whatsapp: z
      .string()
      .trim()
      .min(1, t("whatsappRequired"))
      .transform((value) =>
        value.replace(/\D/g, "").replace(/^88(?=01\d{9}$)/, ""),
      )
      .refine((value) => /^01\d{9}$/.test(value), t("whatsappInvalid")),
    ageRange: z.union([z.enum(AGE_RANGES), z.literal("")]).optional(),
    skinType: z.union([z.enum(SKIN_TYPES), z.literal("")]).optional(),
    concern: z
      .string()
      .trim()
      .min(10, t("concernShort"))
      .max(2000, t("concernLong")),
    consent: z.boolean().refine((value) => value, t("consentRequired")),
    // Honeypot, hidden from people. Sent as-is; the API ignores filled ones.
    website: z.string().optional(),
  });
};

export type ConsultationFormInput = z.input<
  ReturnType<typeof makeConsultationFormSchema>
>;
export type ConsultationFormValues = z.output<
  ReturnType<typeof makeConsultationFormSchema>
>;

/** POST /consultations body. */
export interface SubmitConsultationPayload {
  name: string;
  whatsapp: string;
  ageRange?: string;
  skinType?: string;
  concern: string;
  photoTokens: string[];
  consent: true;
  language: Lang;
  website?: string;
}
