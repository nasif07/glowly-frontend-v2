import type { MetadataRoute } from "next";
import { api } from "@/lib/axios";
import { getAllPosts } from "@/lib/blog-data";
import { SITE_URL } from "@/lib/site";
import type { PaginatedResponse, Product } from "@/types";

const STATIC_ROUTES = ["", "/about", "/shop", "/blog", "/track-order"];

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
  } catch {
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
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
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
