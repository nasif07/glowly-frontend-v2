"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FlaskConical,
  UserCheck,
  Info,
  Plus,
  Minus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import ProductCard from "@/components/common/product-card";
import ProductDetailSkeleton from "@/components/products/product-detail-skeleton";
import Button from "@/components/common/button";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useCartStore } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { trackAddToCart, trackViewContent } from "@/lib/track-event";
import type { Category, ProductVariant } from "@/types";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

export default function ProductDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuth();

  const { data: product, isLoading, isError } = useProduct(slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Pick the first in-stock variant once the product loads.
  useEffect(() => {
    if (product) {
      const firstInStock = product.variants?.find((v) => v.stock > 0);
      setSelectedVariant(firstInStock || product.variants?.[0] || null);
      window.scrollTo(0, 0);
      trackViewContent(product, user);
    }
    // Only re-fire when the product itself changes, not on every user/session update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Reset quantity when the product or variant changes.
  useEffect(() => {
    setQuantity(1);
  }, [slug, selectedVariant]);

  const categoryId =
    product && typeof product.category === "object"
      ? (product.category as Category)?._id
      : (product?.category as string | undefined);

  const { data: suggestedRes } = useProducts(
    { category: categoryId, limit: 5 },
    { enabled: !!categoryId },
  );
  const suggestedProducts = (suggestedRes?.data ?? []).filter(
    (p) => p._id !== product?._id,
  );

  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || !product)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Product not found.
      </div>
    );

  const isOutOfStock = selectedVariant
    ? selectedVariant.stock <= 0
    : product.stockStatus === "Out of Stock";

  const handleQuantityChange = (type: "plus" | "minus") => {
    if (type === "plus") {
      const maxStock = selectedVariant?.stock || 99;
      if (quantity < maxStock) {
        setQuantity((prev) => prev + 1);
      } else {
        toast.error("Maximum stock reached");
      }
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddToCart = (showToast = true) => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    trackAddToCart(product, quantity, user);
    if (showToast) toast.success(`${quantity} item(s) added to cart!`);
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12">
          {/* IMAGE SECTION */}
          <div className="space-y-6">
            <Swiper
              spaceBetween={0}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Thumbs, Autoplay]}
              className="rounded-[2.5rem] bg-white aspect-square shadow-sm border border-[#E8D8C3]/30 overflow-hidden"
            >
              {product.images?.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full aspect-square">
                    <Image
                      src={img.url}
                      alt={img.altText || product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={16}
              slidesPerView={4.5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Thumbs]}
              className="thumbs-swiper px-2"
            >
              {product.images?.map((img, i) => (
                <SwiperSlide key={i} className="cursor-pointer">
                  {({ isActive }) => (
                    <div
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isActive ? "border-[#A67B5B] scale-100" : "border-transparent opacity-50 scale-90"}`}
                    >
                      <Image
                        src={img.url}
                        alt="thumb"
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* DETAILS SECTION */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-[13px] uppercase tracking-[0.25em] text-[#A67B5B] font-bold mb-3">
                {(typeof product.brand === "object" && product.brand?.name) ||
                  "Glowly Exclusive"}{" "}
                •{" "}
                {typeof product.category === "object"
                  ? product.category?.displayName || product.category?.name
                  : null}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2D1B14] mb-4 tracking-tight leading-tight">
                {product.title}
              </h1>

              <div className=" gap-2 font-montserrat">
                <span className="text-[#300332] text-xl md:text-3xl font-semibold md:font-bold">
                  <span className="">৳</span>
                  {(product.discountPrice || product.price)?.toLocaleString()}
                </span>

                {product.price && product.discountPrice ? (
                  <span className="text-[#300332]/30 text-[20px] line-through font-medium ml-2">
                    ৳{product.price.toLocaleString()}
                  </span>
                ) : null}
              </div>
            </div>

            {/* QUICK INFO GRID */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-white rounded-2xl border border-[#E8D8C3]/40">
                <div className="flex items-center gap-2 text-[#A67B5B] mb-1">
                  <Truck size={16} />{" "}
                  <span className="text-[12px] font-bold uppercase tracking-wider">
                    Shipping
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#5D4037]">
                  Standard Delivery{" "}
                  <span className="font-montserrat inline-flex">( 3-4 )</span>{" "}
                  Days
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#E8D8C3]/40">
                <div className="flex items-center gap-2 text-[#A67B5B] mb-1">
                  <ShieldCheck size={16} />{" "}
                  <span className="text-[12px] font-bold uppercase tracking-wider">
                    Origin
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#5D4037]">
                  {product.countryOfOrigin || "Imported"}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase mb-3 text-[#A67B5B] tracking-widest">
                <Info size={14} /> Product Overview
              </h3>
              <p
                className={`text-[#5D4037] leading-relaxed transition-all duration-500 text-lg font-semibold ${!showFullDescription && "line-clamp-3"}`}
              >
                {product.shortDescription}
              </p>
              {product.fullDescription && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 text-[#2D1B14] text-xs font-extrabold flex items-center gap-1 hover:text-[#A67B5B] transition-colors"
                >
                  {showFullDescription ? (
                    <>
                      <ChevronUp size={14} /> View Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} /> Read Full Description
                    </>
                  )}
                </button>
              )}
              {showFullDescription && product.fullDescription && (
                <p className="mt-4 text-[#5D4037] leading-relaxed animate-in fade-in slide-in-from-top-2">
                  {product.fullDescription}
                </p>
              )}
            </div>

            {/* VARIANTS */}
            {product.variants?.length > 0 && (
              <div className="mb-4 flex items-center gap-6">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#A67B5B]">
                  Available Options
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <Button
                      key={v._id}
                      onClick={() => setSelectedVariant(v)}
                      variant={
                        selectedVariant?._id === v._id
                          ? "primary"
                          : v.stock <= 0
                            ? "secondary"
                            : "outline"
                      }
                      className={`!px-4 !py-2 !tracking-[0.1em] font-montserrat ${selectedVariant?._id === v._id ? "shadow-lg shadow-[#2D1B14]/20" : ""}`}
                    >
                      {v.color} {v.size} {v.weight}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY SELECTOR */}
            {!isOutOfStock && (
              <div className="mb-4 hidden md:flex items-center gap-3">
                <div className="flex items-center w-fit bg-white border-2 border-[#E8D8C3]/40 rounded-2xl p-1">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="w-10 h-10 flex items-center justify-center text-[#2D1B14] hover:bg-[#FDF8F3] rounded-xl transition-colors active:scale-90"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-[#2D1B14]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="w-10 h-10 flex items-center justify-center text-[#2D1B14] hover:bg-[#FDF8F3] rounded-xl transition-colors active:scale-90"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* DESKTOP ACTIONS */}
            <div className="hidden lg:flex gap-4">
              <Button
                disabled={isOutOfStock}
                onClick={() => {
                  handleAddToCart();
                }}
                variant={isOutOfStock ? "secondary" : "outline"}
                className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 border-2 font-bold"
              >
                <ShoppingBag size={20} />{" "}
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                disabled={isOutOfStock}
                onClick={() => {
                  handleAddToCart(false);
                  router.push("/cart");
                }}
                variant={isOutOfStock ? "secondary" : "primary"}
                className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-[#2D1B14]/10"
              >
                {isOutOfStock ? "Unavailable" : "Instant Checkout"}
              </Button>
            </div>
          </div>
        </div>

        {/* RICH CONTENT SECTION */}
        <div className="md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#E8D8C3]/50 pt-8 md:pt-16">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-[#2D1B14] uppercase text-lg md:text-xl tracking-widest">
              <Sparkles className="text-[#A67B5B]" size={18} /> Key Benefits
            </h4>
            <ul className="space-y-3">
              {product.keyBenefits?.map((benefit, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-lg font-semibold text-[#5D4037] leading-snug"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A67B5B] mt-1.5 shrink-0" />{" "}
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-[#2D1B14] uppercase text-lg md:text-xl tracking-widest">
              <FlaskConical className="text-[#A67B5B]" size={18} /> Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.keyIngredients?.map((ing, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#F3E9DC] text-[#8C6A5E] text-[13px] font-bold rounded-xl uppercase"
                >
                  {ing}
                </span>
              ))}
            </div>
            {product.fullIngredientList && (
              <p className="text-md font-semibold text-gray-400 mt-4 leading-relaxed line-clamp-4 hover:line-clamp-none cursor-help">
                INCI: {product.fullIngredientList}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-[#2D1B14] uppercase text-lg md:text-xl tracking-widest">
              <UserCheck className="text-[#A67B5B]" size={18} /> Ideal For
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.whoShouldUse?.map((who, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-[#A67B5B]/30 text-[#A67B5B] text-[15px] font-semibold font-bold rounded-lg"
                >
                  {who}
                </span>
              ))}
            </div>
            {product.howToUse && (
              <div className="mt-6 p-4 bg-[#FDF8F3] rounded-2xl border border-[#F3E9DC]">
                <p className="text-[12px] font-black uppercase text-[#8C6A5E] mb-2">
                  How to use:
                </p>
                <p className="text-md text-[#5D4037] italic leading-relaxed">
                  {product.howToUse}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        {suggestedProducts.length > 0 && (
          <div className="mt-5 md:mt-24">
            <div className="flex items-center justify-between mb-3  md:mb-10">
              <h2 className="text-2xl font-bold text-[#2D1B14] tracking-tight">
                You Might Also Love
              </h2>
              <div className="h-[1px] flex-1 bg-[#E8D8C3]/50 mx-8 hidden md:block" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {suggestedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY FOOTER */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#E8D8C3]/30 p-4 flex gap-3 z-50">
        {!isOutOfStock && (
          <div className="flex items-center bg-[#FDF8F3] rounded-xl border border-[#E8D8C3] px-2">
            <button
              onClick={() => handleQuantityChange("minus")}
              className="p-2"
            >
              <Minus size={14} />
            </button>
            <span className="font-bold px-2">{quantity}</span>
            <button onClick={() => handleQuantityChange("plus")} className="p-2">
              <Plus size={14} />
            </button>
          </div>
        )}

        <Button
          disabled={isOutOfStock}
          onClick={() => handleAddToCart()}
          variant={isOutOfStock ? "secondary" : "outline"}
          className="flex-1 h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2"
        >
          {isOutOfStock ? (
            "SOLD OUT"
          ) : (
            <>
              <ShoppingBag size={16} /> CART
            </>
          )}
        </Button>
        <Button
          disabled={isOutOfStock}
          fullWidth
          onClick={() => {
            handleAddToCart(false);
            router.push("/cart");
          }}
          variant={isOutOfStock ? "secondary" : "primary"}
          className="flex-1 h-12 rounded-xl font-bold text-xs"
        >
          {isOutOfStock ? "UNAVAILABLE" : "BUY NOW"}
        </Button>
      </div>
    </div>
  );
}
