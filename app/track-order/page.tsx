import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Track Your Order | Glowly BD",
  description:
    "Track your Glowly order easily. Enter your phone number to check delivery status across Bangladesh.",
};

export default function TrackOrderPage() {
  return <TrackOrderForm />;
}
