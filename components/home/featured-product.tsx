"use client";

import ProductCard from "@/components/common/product-card";
import SectionTitle from "@/components/common/section-title";
import { useFeaturedProducts } from "@/hooks/use-products";

export default function FeaturedProduct() {
  const { data, isLoading } = useFeaturedProducts();

  // Filter only featured products
  const products = (data || []).filter(
    (product) => product.isFeatured === true,
  );

  // Hide the entire section if no featured products exist
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <SectionTitle
          className=" mb-6 md:mb-10"
          title="Featured Products"
          subtitle="Crafted to Stand Out"
        />

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-[#300332]/5 rounded-[2rem]" />
                <div className="h-3 w-2/3 bg-[#300332]/5 rounded-full mx-auto" />
                <div className="h-3 w-1/2 bg-[#300332]/5 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
