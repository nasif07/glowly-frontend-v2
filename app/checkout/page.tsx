import type { Metadata } from "next";
import { CheckoutForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Checkout | Glowly",
  description: "Complete your Glowly order with fast, secure checkout.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
