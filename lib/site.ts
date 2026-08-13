/** Canonical production origin, shared by layout metadata, sitemap.ts and robots.ts. */
export const SITE_URL = "https://glowlybd.com";
export const SITE_NAME = "Glowly";

/** Single source of truth for the contact details repeated across policy pages. */
export const CONTACT = {
  phone: "01575808878",
  phoneIntl: "+8801575808878",
  email: "glowlybd@gmail.com",
  whatsapp:
    "https://wa.me/+8801575808878?text=Hello! I have a question about Glowly products.",
  city: "Chattogram, Bangladesh",
} as const;
