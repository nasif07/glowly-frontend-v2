import type { Metadata } from "next";
import ProductDetail from "@/components/products/product-detail";
import { api } from "@/lib/axios";
import { SITE_NAME } from "@/lib/site";
import {
  productShareDescription,
  productShareImages,
  stripBrandSuffix,
} from "@/lib/seo";
import type { ApiResponse, Product } from "@/types";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Product not found", robots: { index: false } };
  }

  // `metaTitle` is often stored with the brand already appended; strip it so
  // the root layout's "%s | Glowly" template applies exactly once.
  const name = stripBrandSuffix(product.metaTitle || product.title);
  const shareTitle = `${name} | ${SITE_NAME}`;
  const description = productShareDescription(product);
  const url = `/products/${slug}`;

  return {
    title: name,
    description,
    alternates: { canonical: url },
    openGraph: {
      // `openGraph` replaces the root object rather than merging into it, so
      // siteName and locale have to be restated here or they go missing from
      // every product share card.
      siteName: SITE_NAME,
      locale: "en_US",
      // Explicit because an og:title set here is used verbatim — the title
      // template is not applied to it the way it is to <title>.
      title: shareTitle,
      description,
      url,
      type: "website",
      images: productShareImages(product),
    },
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ shade?: string | string[] }>;
}) {
  const { slug } = await params;
  // `?shade=<variantId>` preselects that shade (shared links, "choose shade"
  // from checkout). Read here rather than with useSearchParams so the client
  // component needs no Suspense boundary.
  const { shade } = await searchParams;
  return (
    <ProductDetail
      slug={slug}
      initialShadeId={typeof shade === "string" ? shade : undefined}
    />
  );
}
