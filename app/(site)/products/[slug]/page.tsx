import type { Metadata } from "next";
import ProductDetail from "@/components/products/product-detail";
import { api } from "@/lib/axios";
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
  if (!product) return { title: "Product not found" };

  const title = product.metaTitle || product.title;
  const description = product.metaDescription || product.shortDescription;

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: product.images?.map((img) => ({
        url: img.url,
        alt: img.altText || product.title,
      })),
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
