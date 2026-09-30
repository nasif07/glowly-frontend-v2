/** Canonical production origin, shared by layout metadata, sitemap.ts and robots.ts. */
export const SITE_URL = "https://glowlybd.com";
export const SITE_NAME = "Glowly";

/** Google Analytics 4 measurement id, loaded by the root layout. */
export const GA_MEASUREMENT_ID = "G-01SNNVTV5E";

/** Single source of truth for the contact details repeated across policy pages. */
export const CONTACT = {
  phone: "01575808878",
  phoneIntl: "+8801575808878",
  email: "glowlybd@gmail.com",
  whatsapp:
    "https://wa.me/+8801575808878?text=Hello! I have a question about Glowly products.",
  /** Facebook page, and the Messenger deep link for the same page. */
  facebook: "https://www.facebook.com/glowlyofficial",
  messenger: "https://m.me/glowlyofficial",
  city: "Chattogram, Bangladesh",
} as const;
