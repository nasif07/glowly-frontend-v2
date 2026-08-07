"use client";

import { Star, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { trackAddToCart } from "@/lib/track-event";
import type { Product } from "@/types";

const toastStyle = {
  background: "#300332",
  color: "#D9C5B2",
  fontSize: "12px",
  borderRadius: "99px",
};

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuth();

  // Calculate discount percentage
  const discountPercentage =
    product.price && product.discountPrice
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.totalStock || product.totalStock <= 0) {
      toast.error("Ritual currently unavailable", { style: toastStyle });
      return;
    }

    addItem(product, null, 1);
    trackAddToCart(product, 1, user);
    toast.success(`${product.title} added to ritual`, { style: toastStyle });
  };

  return (
    <div
      onClick={() => router.push(`/products/${product.slug || product._id}`)}
      className="group relative cursor-pointer bg-white rounded p-1.5 md:p-3 border border-stone-200 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded bg-[#FAF9F6]">
        {/* Luminous Tag (Left) */}
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-md text-[#300332] text-[9px] font-black px-3 py-1 rounded-2xl uppercase tracking-widest shadow-sm">
            {product.tag}
          </span>
        )}

        {/* Discount Tag (Right) */}
        {discountPercentage !== null && discountPercentage > 0 && (
          <span className="absolute right-0 z-10 bg-[#300332] text-white text-[12px] font-semibold px-2 py-1 rounded font-montserrat">
            -{discountPercentage}%
          </span>
        )}

        <Image
          src={product.images?.[0]?.url || "/placeholder.jpg"}
          alt={product.images?.[0]?.altText || product.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />

        {/* The Shine Streak */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out" />
        </div>

        {/* Quick Add Button — always visible on mobile (no hover state to reveal it there); hover-reveal on md+ */}
        <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-all duration-500 ease-in-out">
          <button
            onClick={handleAddToCart}
            disabled={!product.totalStock || product.totalStock <= 0}
            className={`w-full py-2.5 md:py-4 rounded-xl md:rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl transition-all text-[9px] md:text-[10px]
              ${
                !product.totalStock || product.totalStock <= 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-linear-to-r from-[#360718] via-[#8E1454] to-[#360718] text-white hover:brightness-110"
              }
            `}
          >
            <Plus size={14} />
            {product.totalStock && product.totalStock > 0
              ? "Quick Add"
              : "Sold Out"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-2 px-1 space-y-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[#D9C5B2] mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                fill={i < (product.rating || 5) ? "currentColor" : "none"}
                stroke="currentColor"
              />
            ))}
          </div>
          <h3 className="text-[#300332] font-bold text-lg md:text-md tracking-tight line-clamp-1 transition-colors group-hover:text-[#300332]/60">
            {product.title}
          </h3>
        </div>

        <div className="flex items-baseline gap-2 font-montserrat">
          <span className="text-[#300332] text-xl font-semibold">
            ৳{(product.discountPrice || product.price)?.toLocaleString()}
          </span>

          {product.price && product.discountPrice ? (
            <span className="text-[#300332]/30 text-[16px] line-through font-medium">
              ৳{product.price.toLocaleString()}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
