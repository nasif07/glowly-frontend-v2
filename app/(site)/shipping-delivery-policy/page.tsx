import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
  PolicyList,
} from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: { absolute: "Shipping & Delivery Policy | Glowly Bangladesh" },
  description:
    "View Glowly's shipping policy, delivery times, delivery areas, order processing, and tracking information for customers across Bangladesh.",
  alternates: { canonical: "/shipping-delivery-policy" },
  openGraph: {
    title: "Shipping & Delivery Policy | Glowly",
    description:
      "View Glowly's shipping policy, delivery times, delivery areas, order processing, and tracking information for customers across Bangladesh.",
    type: "website",
    url: "/shipping-delivery-policy",
  },
};

export default function ShippingDeliveryPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Customer Support"
      title="Shipping & Delivery Policy"
      intro="Delivery times, charges, and coverage for orders across Bangladesh."
    >
      <PolicySection title="Delivery areas">
        <p>We currently deliver to all districts across Bangladesh.</p>
      </PolicySection>

      <PolicySection title="Delivery time">
        <PolicyList
          items={[
            <>
              <strong className="text-[#300332]">Inside Chattogram:</strong>{" "}
              within 1–3 business days.
            </>,
            <>
              <strong className="text-[#300332]">Outside Chattogram:</strong>{" "}
              within 2–10 business days.
            </>,
          ]}
        />
        <p>
          Delivery times are estimates and can occasionally be affected by
          courier delays, weather conditions, public holidays, or high order
          volumes. If this happens, we&apos;ll do our best to keep you informed.
        </p>
      </PolicySection>

      <PolicySection title="Track your order">
        <p>
          Once your order has been processed, you can check its delivery status
          at any time by visiting our{" "}
          <Link
            href="/track-order"
            className="font-bold text-[#8E1454] underline underline-offset-4"
          >
            Track Your Order
          </Link>{" "}
          page. Simply enter your Order Number and the phone number or email
          address you used during checkout to view the latest status of your
          order.
        </p>
      </PolicySection>

      <PolicySection title="Delivery charges">
        <p>
          Delivery charges vary depending on your delivery location and will be
          calculated and displayed at checkout before you complete your order.
        </p>
      </PolicySection>

      <PolicySection title="Order processing time">
        <p>
          Orders are typically processed and handed over to our courier partner
          within 1–2 business days after order confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Failed delivery">
        <p>
          If a delivery attempt fails due to an incorrect address, an unavailable
          recipient, or an unreachable phone number, our courier partner or
          customer support team will contact you to arrange another delivery
          attempt. If the order cannot be delivered after multiple attempts, it
          may be returned to us, and additional delivery charges may apply for
          re-delivery.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
