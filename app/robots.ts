import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/cart",
        "/checkout",
        "/profile",
        "/login",
        "/register",
        "/forget-password",
        "/reset-password",
        "/verify-otp",
        "/order-success",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
