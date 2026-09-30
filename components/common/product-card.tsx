"use client";

import { Star, Plus, Palette, SlidersHorizontal, Gift } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { trackAddToCart } from "@/lib/track-event";
import type { Product } from "@/types";
import {
  getUnitPrice,
  getListPrice,
  getDiscountPercentage,
} from "@/lib/pricing";
import { isShadeProduct } from "@/lib/shades";
import { bundleUnitCount, isBundleProduct } from "@/lib/bundle";
import { isSoldOutByStock } from "@/lib/stock";
import { useStockEnforcement } from "@/hooks/use-settings";

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
  const stockEnforced = useStockEnforcement();

  // A shade, or one of several options, has to be picked on the product page,
  // so the quick action opens it instead of adding a line the order would
  // refuse. A product with a single variant quick-adds that variant; a combo
  // has none and quick-adds as it is.
  const isShade = isShadeProduct(product);
  const isCombo = isBundleProduct(product);
  const variants = isCombo ? [] : (product.variants ?? []);
  const needsChoice = isShade || variants.length > 1;
  const comboUnits = isCombo ? bundleUnitCount(product) : 0;
  const reviewCount = product.ratings?.count ?? 0;
  const averageRating = product.ratings?.average ?? 0;
  const onlyVariant = !needsChoice && variants.length === 1 ? variants[0] : null;
  const choiceLabel = isShade ? "Choose Shade" : "Choose Option";
  const ChoiceIcon = isShade ? Palette : SlidersHorizontal;

  // The card quotes the same figure the cart will charge for what quick add
  // puts in it — see `getUnitPrice`.
  const unitPrice = getUnitPrice(product, onlyVariant);
  const listPrice = getListPrice(product, unitPrice);
  const discountPercentage = getDiscountPercentage(product, unitPrice);
  // With stock enforced, sold out follows real stock (and never a pre-order);
  // otherwise exactly the rule the card always used.
  const isSoldOut = stockEnforced
    ? isSoldOutByStock(product)
    : !product.totalStock || product.totalStock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (needsChoice && !isSoldOut) {
      openProduct();
      return;
    }
    if (isSoldOut) {
      toast.error("Ritual currently unavailable", { style: toastStyle });
      return;
    }

    addItem(product, onlyVariant, 1);
    trackAddToCart(product, 1, user);
    toast.success(`${product.title} added to ritual`, { style: toastStyle });
  };

  const openProduct = () =>
    router.push(`/products/${product.slug || product._id}`);

  return (
    // Card-wide click target. It can't be an <a> without nesting the Quick Add
    // button inside it, so it carries link semantics and keyboard handling
    // instead. `e.target === e.currentTarget` keeps Enter/Space on the inner
    // button from also navigating.
    <div
      role="link"
      tabIndex={0}
      aria-label={product.title}
      onClick={openProduct}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProduct();
        }
      }}
      className="group relative cursor-pointer bg-white rounded p-1.5 md:p-3 border border-stone-200 transition-all duration-500 hover:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#300332]"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded bg-[#FAF9F6]">
        {/* Luminous Tag (Left) */}
        {isCombo ? (
          <span className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-2xl bg-white/85 px-2.5 py-1 text-[9px] font-black tracking-widest text-[#300332] uppercase shadow-sm backdrop-blur-md md:top-3 md:left-3">
            <Gift size={11} /> Combo
            {comboUnits > 0 && ` · ${comboUnits} items`}
          </span>
        ) : (
          product.tag && (
            <span className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-md text-[#300332] text-[9px] font-black px-3 py-1 rounded-2xl uppercase tracking-widest shadow-sm">
              {product.tag}
            </span>
          )
        )}

        {/* Discount Tag (Right) */}
        {discountPercentage !== null && (
          <span className="absolute right-0 z-10 bg-[#300332] text-white text-[12px] font-semibold px-2 py-1 rounded font-montserrat">
            -{discountPercentage}%
          </span>
        )}

        {/* No placeholder asset exists, and pointing next/image at a missing
            file 500s the optimizer — fall back to the tinted container above. */}
        {product.images?.[0]?.url && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].altText || product.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />
        )}

        {/* The Shine Streak */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out" />
        </div>

        {/* Quick Add, mobile: a single icon tucked into the corner. There is no
            hover on touch, so the labelled bar below would sit over the product
            shot permanently — which is most of what the card is there to show. */}
        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          aria-label={
            isSoldOut
              ? `${product.title} is sold out`
              : isShade
                ? `Choose a shade of ${product.title}`
                : needsChoice
                  ? `Choose an option of ${product.title}`
                  : `Quick add ${product.title}`
          }
          className={`absolute right-2 bottom-2 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all active:scale-90 md:hidden
            ${
              isSoldOut
                ? "cursor-not-allowed bg-gray-200 text-gray-400 shadow-none"
                : "bg-linear-to-r from-[#360718] via-[#8E1454] to-[#360718] text-white"
            }
          `}
        >
          {needsChoice ? <ChoiceIcon size={17} /> : <Plus size={18} />}
        </button>

        {/* The icon has no room to say why it is disabled, and the bar that used
            to carry "Sold Out" is desktop-only now. */}
        {isSoldOut && (
          <span className="absolute bottom-2 left-2 z-10 rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-black tracking-widest text-[#300332] uppercase backdrop-blur-md md:hidden">
            Sold Out
          </span>
        )}

        {/* Quick Add, md+: the full labelled bar, revealed on hover. */}
        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full p-4 transition-all duration-500 ease-in-out group-hover:translate-y-0 md:block">
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl transition-all
              ${
                isSoldOut
                  ? "cursor-not-allowed bg-gray-200 text-gray-500 shadow-none"
                  : "bg-linear-to-r from-[#360718] via-[#8E1454] to-[#360718] text-white hover:brightness-110"
              }
            `}
          >
            {needsChoice ? <ChoiceIcon size={14} /> : <Plus size={14} />}
            {isSoldOut ? "Sold Out" : needsChoice ? choiceLabel : "Quick Add"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-2 px-1 space-y-2">
        <div className="flex flex-col gap-1">
          {/* Real reviews only — every card used to show five stars. The row
              keeps its height either way so cards stay aligned. */}
          <div
            className="flex h-2.5 items-center gap-1 text-[#D9C5B2] mb-1"
            aria-label={
              reviewCount
                ? `Rated ${averageRating.toFixed(1)} out of 5 from ${reviewCount} reviews`
                : undefined
            }
          >
            {reviewCount > 0 &&
              [...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={i < Math.round(averageRating) ? "currentColor" : "none"}
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
            ৳{unitPrice.toLocaleString()}
          </span>

          {listPrice ? (
            <span className="text-[#300332]/30 text-[16px] line-through font-medium">
              ৳{listPrice.toLocaleString()}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
