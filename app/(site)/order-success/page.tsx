import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Glowly order has been placed successfully.",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Success Icon */}
      <CheckCircle className="text-green-500 w-24 h-24 mb-6" />

      {/* Success Message */}
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Thank You!</h1>
      <p className="text-gray-600 mb-6 text-center">
        Your order has been placed successfully. <br />
        We are processing it and you will receive updates soon.
      </p>

      {/* Go to Home Button */}
      <Link
        href="/"
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
