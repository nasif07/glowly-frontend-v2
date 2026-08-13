import { Suspense } from "react";
import ProductListing from "@/components/products/product-listing";
import ProductCardSkeleton from "@/components/products/product-card-skeleton";

export const metadata = {
  title: "Shop",
  // /products and /shop render the identical listing. /shop is the canonical
  // storefront (it's what the navbar, home and sitemap all point at), so this
  // alias points there rather than competing with it for the same content.
  alternates: { canonical: "/shop" },
  description:
    "Buy trusted skincare products directly from global origins. Trending serums, moisturizers & routines for radiant skin in Bangladesh.",
};

function ListingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {[...Array(9)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  // useSearchParams (in ProductListing) requires a Suspense boundary.
  return (
    <Suspense fallback={<ListingFallback />}>
      <ProductListing />
    </Suspense>
  );
}
