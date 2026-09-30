"use client";

import { useEffect, useMemo, useState } from "react";
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
  Gift,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { getUnitPrice, getListPrice } from "@/lib/pricing";
import { isShadeProduct } from "@/lib/shades";
import {
  isPreOrder,
  isSoldOutByStock,
  isVariantSoldOutByStock,
} from "@/lib/stock";
import { useStockEnforcement } from "@/hooks/use-settings";
import { isRichTextEmpty } from "@/lib/rich-text";
import { RichText } from "@/components/common/rich-text";
import {
  bundleItems,
  bundleWorth,
  isBundleProduct,
  variantName,
} from "@/lib/bundle";
import { skinConcernLabel, skinTypeLabel } from "@/lib/skin";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

export default function ProductDetail({
  slug,
  initialShadeId,
}: {
  slug: string;
  /** From `?shade=<variantId>` — the only way a shade is preselected. */
  initialShadeId?: string;
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuth();

  const { data: product, isLoading, isError } = useProduct(slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isShade = isShadeProduct(product);
  const isCombo = isBundleProduct(product);
  const stockEnforced = useStockEnforcement();

  // With stock enforced a variant is sold out by its real stock, and never on
  // a pre-order product; otherwise the rule the page always used.
  const variantSoldOut = (v: ProductVariant) =>
    stockEnforced && product
      ? isVariantSoldOutByStock(product, v)
      : v.stock <= 0;

  // The gallery plus every shade's own image, so picking a shade can slide to
  // its shot without swapping slides under Swiper.
  const gallery = useMemo(() => {
    if (!product) return [];
    const images = [...(product.images ?? [])];
    // A combo without photos of its own shows its products'.
    if (!images.length && isBundleProduct(product)) {
      for (const { product: item } of bundleItems(product)) {
        const first = item.images?.[0];
        if (first?.url) images.push({ url: first.url, altText: item.title });
      }
    }
    if (isShadeProduct(product)) {
      for (const v of product.variants ?? []) {
        const url = v.image?.url;
        if (url && !images.some((img) => img.url === url)) {
          images.push({ url, altText: `${product.title} – ${v.color}` });
        }
      }
    }
    return images;
  }, [product]);

  // Once the product loads: a standard product preselects its first in-stock
  // variant. A shade product preselects nothing — the customer picks — unless
  // the link named an in-stock shade.
  useEffect(() => {
    if (product) {
      if (isShadeProduct(product)) {
        const requested = product.variants?.find(
          (v) => v._id === initialShadeId && !variantSoldOut(v),
        );
        setSelectedVariant(requested ?? null);
      } else {
        const firstInStock = product.variants?.find((v) => !variantSoldOut(v));
        setSelectedVariant(firstInStock || product.variants?.[0] || null);
      }
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

  // Show the picked shade's own image. Autoplay stops so it stays in view.
  useEffect(() => {
    const url = selectedVariant?.image?.url;
    if (!isShade || !url || !mainSwiper || mainSwiper.destroyed) return;
    const index = gallery.findIndex((img) => img.url === url);
    if (index === -1) return;
    mainSwiper.autoplay?.stop();
    mainSwiper.slideTo(index);
  }, [isShade, selectedVariant, mainSwiper, gallery]);

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

  const inStockShades = isShade
    ? (product.variants ?? []).filter((v) => !variantSoldOut(v))
    : [];
  // A shade product is sold out only when every shade is. A product without
  // variants goes by its label — or, with stock enforced, by its real stock.
  const isOutOfStock = isShade
    ? selectedVariant
      ? variantSoldOut(selectedVariant)
      : inStockShades.length === 0
    : selectedVariant
      ? variantSoldOut(selectedVariant)
      : stockEnforced
        ? isSoldOutByStock(product)
        : // A combo's stock is what its products make up (the API works it
          // out), so it goes by that even when stock isn't enforced.
          product.stockStatus === "Out of Stock" ||
          (isCombo && !isPreOrder(product) && !(Number(product.totalStock) > 0));
  const needsShade = isShade && !selectedVariant && !isOutOfStock;
  const cannotBuy = isOutOfStock || needsShade;

  const selectShade = (shade: ProductVariant) => {
    if (variantSoldOut(shade)) return;
    setSelectedVariant(shade);
    // Keep the URL shareable without a server round trip.
    if (shade._id) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?shade=${shade._id}`,
      );
    }
  };

  // What the cart will actually charge for the current selection.
  const unitPrice = getUnitPrice(product, selectedVariant);
  // Strike the list price only when it really is above what is being charged.
  const listPrice = getListPrice(product, unitPrice);
  // Rich text: an "empty" body is often "<p></p>", which is truthy but shows
  // nothing — so the toggle has to test the text, not the string.
  const hasFullDescription = !isRichTextEmpty(product.fullDescription);

  const comboItems = isCombo ? bundleItems(product) : [];
  const comboWorth = isCombo ? bundleWorth(product) : null;
  const comboSaving =
    comboWorth !== null && comboWorth > unitPrice ? comboWorth - unitPrice : 0;

  // Tagged skin types; products tagged the old way show their free text.
  const skinTypes = product.skinTypes ?? [];
  const skinConcerns = product.skinConcerns ?? [];
  const legacyIdealFor = skinTypes.length ? [] : (product.whoShouldUse ?? []);
  const hasIdealFor =
    skinTypes.length > 0 ||
    skinConcerns.length > 0 ||
    legacyIdealFor.length > 0 ||
    !isRichTextEmpty(product.howToUse);
  const hasBenefits = (product.keyBenefits?.length ?? 0) > 0;
  const hasIngredients =
    (product.keyIngredients?.length ?? 0) > 0 || !!product.fullIngredientList;

  const handleQuantityChange = (type: "plus" | "minus") => {
    if (type === "plus") {
      // Enforced stock caps the quantity (a pre-order doesn't); unenforced,
      // the cap the page always had.
      const maxStock = !stockEnforced
        ? selectedVariant?.stock || 99
        : isPreOrder(product)
          ? 99
          : (selectedVariant ? selectedVariant.stock : product.totalStock) || 0;
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
    if (cannotBuy) return;
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
              onSwiper={setMainSwiper}
              className="rounded-[2.5rem] bg-white aspect-square shadow-sm border border-[#E8D8C3]/30 overflow-hidden"
            >
              {gallery.map((img, i) => (
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
              {gallery.map((img, i) => (
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
          <div className="flex flex-col min-w-0">
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
                  {unitPrice.toLocaleString()}
                </span>

                {listPrice ? (
                  <span className="text-[#300332]/30 text-[20px] line-through font-medium ml-2">
                    ৳{listPrice.toLocaleString()}
                  </span>
                ) : null}
              </div>
            </div>

            {/* COMBO CONTENTS */}
            {isCombo && comboItems.length > 0 && (
              <div className="mb-6 rounded-3xl border border-[#E8D8C3] bg-[#FDF8F3] p-4 md:p-5">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-[#A67B5B]">
                    <Gift size={14} /> What&apos;s in this combo
                  </h3>
                  {comboSaving > 0 && (
                    <span className="rounded-full bg-[#300332] px-3 py-1 font-montserrat text-[11px] font-semibold text-white">
                      Save ৳{comboSaving.toLocaleString()} vs. buying separately
                    </span>
                  )}
                </div>
                <ul className="divide-y divide-[#E8D8C3]/60">
                  {comboItems.map(({ product: item, variant, quantity: qty }) => (
                    <li key={`${item._id}-${variant?._id ?? ""}`}>
                      <Link
                        href={`/products/${item.slug || item._id}${
                          variant?._id && item.variantType === "shade"
                            ? `?shade=${variant._id}`
                            : ""
                        }`}
                        className="group flex items-center gap-3 py-3"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                          {(variant?.image?.url || item.images?.[0]?.url) && (
                            <Image
                              src={variant?.image?.url || item.images[0].url}
                              alt={item.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold text-[#2D1B14] group-hover:text-[#A67B5B]">
                            {item.title}
                          </p>
                          {variant && variantName(variant) && (
                            <p className="flex items-center gap-1.5 text-xs text-[#8D6E63]">
                              {variant.hex && (
                                <span
                                  aria-hidden
                                  className="h-3 w-3 rounded-full border border-white ring-1 ring-[#E8D8C3]"
                                  style={{ backgroundColor: variant.hex }}
                                />
                              )}
                              {variantName(variant)}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 font-montserrat text-sm font-bold text-[#300332]">
                          ×{qty}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {comboWorth !== null && comboSaving > 0 && (
                  <p className="mt-2 font-montserrat text-xs text-[#8D6E63]">
                    Worth ৳{comboWorth.toLocaleString()} bought one by one.
                  </p>
                )}
              </div>
            )}

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
              {hasFullDescription && (
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
              {showFullDescription && hasFullDescription && (
                <RichText
                  html={product.fullDescription}
                  className="mt-4 animate-in fade-in slide-in-from-top-2"
                />
              )}
            </div>

            {/* SHADES */}
            {isShade && product.variants?.length > 0 && (
              <div className="mb-4">
                <div className="mb-3 flex items-baseline gap-3">
                  <h3 className="shrink-0 text-[13px] font-bold uppercase tracking-widest text-[#A67B5B]">
                    Shade
                  </h3>
                  <span className="min-w-0 truncate text-sm font-semibold text-[#2D1B14]">
                    {selectedVariant?.color ?? "Select a shade"}
                  </span>
                </div>
                <div
                  role="radiogroup"
                  aria-label="Shade"
                  className="flex flex-wrap gap-3"
                >
                  {product.variants.map((v) => {
                    const soldOut = variantSoldOut(v);
                    const selected = selectedVariant?._id === v._id;
                    return (
                      <button
                        key={v._id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={soldOut ? `${v.color} (out of stock)` : v.color}
                        title={soldOut ? `${v.color} — out of stock` : v.color}
                        disabled={soldOut}
                        onClick={() => selectShade(v)}
                        style={{ backgroundColor: v.hex }}
                        className={`relative h-10 w-10 overflow-hidden rounded-full border-2 border-white transition-all ${
                          selected
                            ? "scale-110 ring-2 ring-[#300332] ring-offset-2"
                            : "ring-1 ring-[#E8D8C3]"
                        } ${
                          soldOut
                            ? "cursor-not-allowed opacity-40"
                            : "cursor-pointer hover:scale-105"
                        }`}
                      >
                        {/* Struck through: shown so the range is visible,
                            but it can't be picked. */}
                        {soldOut && (
                          <span
                            aria-hidden
                            className="absolute top-1/2 left-1/2 h-0.5 w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#2D1B14]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                {needsShade && (
                  <p className="mt-3 text-xs font-semibold text-[#8D6E63]">
                    Pick a shade to add this to your bag.
                  </p>
                )}
              </div>
            )}

            {/* VARIANTS */}
            {!isShade && product.variants?.length > 0 && (
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <h3 className="shrink-0 text-[13px] font-bold uppercase tracking-widest text-[#A67B5B]">
                  Available Options
                </h3>
                <div className="flex min-w-0 flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <Button
                      key={v._id}
                      onClick={() => setSelectedVariant(v)}
                      // Unenforced, a sold-out option stays pickable, as it
                      // always was; enforced, it's marked and can't be.
                      disabled={stockEnforced && variantSoldOut(v)}
                      variant={
                        selectedVariant?._id === v._id
                          ? "primary"
                          : variantSoldOut(v)
                            ? "secondary"
                            : "outline"
                      }
                      className={`max-w-full whitespace-normal text-center leading-snug px-4! py-2! tracking-widest! font-montserrat ${selectedVariant?._id === v._id ? "shadow-lg shadow-[#2D1B14]/20" : ""}`}
                    >
                      {[v.color, v.size, v.weight].filter(Boolean).join(" · ")}
                      {stockEnforced && variantSoldOut(v) && (
                        <span className="ml-1.5 text-[10px] opacity-70">
                          · Sold out
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY SELECTOR — below lg the sticky footer carries one. */}
            {!isOutOfStock && (
              <div className="mb-4 hidden lg:flex items-center gap-3">
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
                disabled={cannotBuy}
                onClick={() => {
                  handleAddToCart();
                }}
                variant={cannotBuy ? "secondary" : "outline"}
                className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 border-2 font-bold"
              >
                <ShoppingBag size={20} />{" "}
                {isOutOfStock
                  ? "Out of Stock"
                  : needsShade
                    ? "Select a Shade"
                    : "Add to Cart"}
              </Button>
              <Button
                disabled={cannotBuy}
                onClick={() => {
                  handleAddToCart(false);
                  router.push("/cart");
                }}
                variant={cannotBuy ? "secondary" : "primary"}
                className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-[#2D1B14]/10"
              >
                {isOutOfStock ? "Unavailable" : "Instant Checkout"}
              </Button>
            </div>
          </div>
        </div>

        {/* RICH CONTENT SECTION — a column with nothing in it is left out. */}
        {(hasBenefits || hasIngredients || hasIdealFor) && (
        <div className="md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#E8D8C3]/50 pt-8 md:pt-16">
          {hasBenefits && (
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
          )}

          {hasIngredients && (
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
          )}

          {hasIdealFor && (
          <div className="space-y-4">
            {(skinTypes.length > 0 || legacyIdealFor.length > 0) && (
              <>
                <h4 className="flex items-center gap-2 font-bold text-[#2D1B14] uppercase text-lg md:text-xl tracking-widest">
                  <UserCheck className="text-[#A67B5B]" size={18} /> Ideal For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {/* Each skin type opens the shop filtered to it. */}
                  {skinTypes.map((type) => (
                    <Link
                      key={type}
                      href={type === "all" ? "/shop" : `/shop?skinType=${type}`}
                      className="px-3 py-1 border border-[#A67B5B]/30 text-[#A67B5B] text-[15px] font-bold rounded-lg transition-colors hover:bg-[#A67B5B] hover:text-white"
                    >
                      {skinTypeLabel(type)}
                    </Link>
                  ))}
                  {legacyIdealFor.map((who, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 border border-[#A67B5B]/30 text-[#A67B5B] text-[15px] font-bold rounded-lg"
                    >
                      {who}
                    </span>
                  ))}
                </div>
              </>
            )}
            {skinConcerns.length > 0 && (
              <>
                <h4 className="flex items-center gap-2 pt-2 font-bold text-[#2D1B14] uppercase text-lg md:text-xl tracking-widest">
                  <Target className="text-[#A67B5B]" size={18} /> Targets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skinConcerns.map((concern) => (
                    <Link
                      key={concern}
                      href={`/shop?skinConcern=${concern}`}
                      className="px-3 py-1 bg-[#F3E9DC] text-[#8C6A5E] text-[13px] font-bold rounded-xl uppercase transition-colors hover:bg-[#A67B5B] hover:text-white"
                    >
                      {skinConcernLabel(concern)}
                    </Link>
                  ))}
                </div>
              </>
            )}
            {!isRichTextEmpty(product.howToUse) && (
              <div className="mt-6 p-4 bg-[#FDF8F3] rounded-2xl border border-[#F3E9DC]">
                <p className="text-[12px] font-black uppercase text-[#8C6A5E] mb-2">
                  How to use:
                </p>
                <RichText html={product.howToUse} className="text-md" />
              </div>
            )}
          </div>
          )}
        </div>
        )}

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
          disabled={cannotBuy}
          onClick={() => handleAddToCart()}
          variant={cannotBuy ? "secondary" : "outline"}
          className="flex-1 h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2"
        >
          {isOutOfStock ? (
            "SOLD OUT"
          ) : needsShade ? (
            "SELECT SHADE"
          ) : (
            <>
              <ShoppingBag size={16} /> CART
            </>
          )}
        </Button>
        <Button
          disabled={cannotBuy}
          fullWidth
          onClick={() => {
            handleAddToCart(false);
            router.push("/cart");
          }}
          variant={cannotBuy ? "secondary" : "primary"}
          className="flex-1 h-12 rounded-xl font-bold text-xs"
        >
          {isOutOfStock ? "UNAVAILABLE" : "BUY NOW"}
        </Button>
      </div>
    </div>
  );
}
