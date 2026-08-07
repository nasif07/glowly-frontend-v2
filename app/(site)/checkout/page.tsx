import type { Metadata } from "next";
import { CheckoutForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Glowly order with fast, secure checkout.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
