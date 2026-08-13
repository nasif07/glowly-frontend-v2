import type { MetadataRoute } from "next";
import { api } from "@/lib/axios";
import { getAllPosts } from "@/lib/blog-data";
import { SITE_URL } from "@/lib/site";
import type { PaginatedResponse, Product } from "@/types";

// Commercial and trust pages rank higher than the legal boilerplate, which
// still belongs in the sitemap so crawlers can see the policies exist.
const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/transparency", changeFrequency: "monthly", priority: 0.7 },
  { path: "/authenticity-verification", changeFrequency: "monthly", priority: 0.7 },
  { path: "/track-order", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/shipping-delivery-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/return-exchange-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-condition", changeFrequency: "yearly", priority: 0.3 },
];

// `/products` caps `limit` at 100 server-side, so a full slug list needs
// pagination rather than one oversized request.
async function getProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;

  try {
    for (;;) {
      const { data } = await api.get<PaginatedResponse<Product>>("/products", {
        params: { limit: 100, page },
      });
      slugs.push(...(data.data ?? []).map((product) => product.slug));
      if (page >= data.meta.totalPage) break;
      page += 1;
    }
  } catch (error) {
    // The sitemap is generated at build time; a silent failure here ships a
    // sitemap with zero product URLs, so make it loud in the build log.
    console.warn(
      `[sitemap] product fetch failed on page ${page} — sitemap will contain ${slugs.length} product URL(s)`,
      error,
    );
    return slugs;
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, posts] = await Promise.all([
    getProductSlugs(),
    Promise.resolve(getAllPosts()),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/products/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
