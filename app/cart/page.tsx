import type { Metadata } from "next";
import CartView from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart | Glowly BD",
  description:
    "Review your selected skincare products, update quantities, and proceed to checkout at Glowly BD.",
};

export default function CartPage() {
  return <CartView />;
}
