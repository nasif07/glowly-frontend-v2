import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Account/transactional paths that shouldn't be indexed by anyone — applied to
// the AI crawlers too, so an explicit "allow" doesn't quietly widen access.
const DISALLOW = [
  "/api/",
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
];

// Named so AI answer engines are explicitly welcome to cite Glowly's content
// (they inherit `*` otherwise, but stating it avoids ambiguity).
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
