import type { Metadata } from "next";
import CartView from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description:
    "Review your selected skincare products, update quantities, and proceed to checkout at Glowly BD.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartView />;
}
