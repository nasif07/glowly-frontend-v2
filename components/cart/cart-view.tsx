"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import Button from "@/components/common/button";
import {
  useCartStore,
  useCartSubtotal,
  CART_SHIPPING_CHARGE,
} from "@/hooks/use-cart";

export default function CartView() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartSubtotal();

  // Gate on mount so the localStorage-backed store has hydrated (avoids a
  // hydration mismatch — the server renders an empty cart).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shipping = CART_SHIPPING_CHARGE;
  const total = subtotal + shipping;
  const cartItems = mounted ? items : [];

  return (
    <div className="py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="md:text-2xl sm:text-3xl font-bold text-[#2D1B14] mb-6 sm:mb-8 flex items-center gap-3">
          <ShoppingBag className="text-[#A1887F]" size={25} /> Shopping Bag
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List Section */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-center gap-3 sm:gap-6 bg-white p-3 sm:p-4 rounded-2xl border border-[#EFEBE9]"
                >
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#F5F1EE]">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <h3 className="font-bold text-[#2D1B14] text-sm sm:text-base truncate">
                      {item.title}
                    </h3>
                    {item.variant && (
                      <p className="text-[10px] sm:text-xs text-[#8D6E63] font-medium uppercase tracking-wider mb-1">
                        {item.variant.weight ||
                          item.variant.size ||
                          item.variant.color}
                      </p>
                    )}
                    <p className="text-[#A1887F] font-bold text-sm sm:text-base font-montserrat">
                      ৳{item.price}
                    </p>

                    {/* MOBILE QUANTITY */}
                    <div className="flex sm:hidden items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#EFEBE9] rounded-lg bg-[#FAF9F6] scale-90 -ml-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="p-1"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm font-semibold font-montserrat">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="p-1"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP QUANTITY */}
                  <div className="hidden sm:flex items-center border border-[#EFEBE9] rounded-lg bg-[#FAF9F6]">
                    <button
                      onClick={() => updateQuantity(item.cartId, -1)}
                      className="p-2 hover:text-[#A1887F]"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartId, 1)}
                      className="p-2 hover:text-[#A1887F]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* PRICE & REMOVE */}
                  <div className="flex flex-col items-end justify-between self-stretch font-montserrat">
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                    <p className="font-bold text-[#2D1B14] text-sm sm:text-base">
                      ৳{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                href="/shop"
                className="flex items-center gap-2 text-[#5D4037] text-sm font-semibold mt-4 ml-1 hover:gap-3 transition-all w-max"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFEBE9] sticky top-6">
                <h2 className="text-lg font-bold text-[#2D1B14] mb-4 border-b pb-4 tracking-tight">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-[#8D6E63]">
                    <span>Subtotal</span>
                    <span className="font-montserrat">
                      ৳{subtotal.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#8D6E63]">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium font-montserrat">
                      ৳{shipping.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t font-bold text-lg text-[#2D1B14]">
                    <span>Total</span>
                    <span className="font-montserrat">৳{total.toFixed(0)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/checkout")}
                  className="w-full mt-4"
                >
                  Go to Checkout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#A1887F]/40 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="text-[#A1887F]/50" />
            </div>
            <h2 className="text-lg font-bold text-[#2D1B14]">
              Your bag is empty
            </h2>
            <p className="text-sm text-[#8D6E63] mt-1 mb-6">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Button onClick={() => router.push("/shop")} className="px-10 py-3">
              Explore Shop
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
