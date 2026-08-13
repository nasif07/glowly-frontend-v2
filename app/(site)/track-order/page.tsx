import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/forms";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Track Your Order | Glowly Bangladesh" },
  description:
    "Track your Glowly skincare order using the phone number you used at checkout. Get real-time updates on your delivery status across Bangladesh.",
  alternates: { canonical: "/track-order" },
  openGraph: {
    title: "Track Your Order | Glowly",
    description:
      "Track your Glowly skincare order using the phone number you used at checkout. Get real-time updates on your delivery status.",
    type: "website",
    url: "/track-order",
  },
};

const orderStatuses = [
  { label: "Order Placed", desc: "We've received your order." },
  {
    label: "Confirmed",
    desc: "Your order has been confirmed and is being prepared.",
  },
  {
    label: "Shipped",
    desc: "Your order has been handed over to our courier partner.",
  },
  {
    label: "Out for Delivery",
    desc: "Your order is on its way and will arrive soon.",
  },
  { label: "Delivered", desc: "Your order has been successfully delivered." },
];

export default function TrackOrderPage() {
  return (
    <>
      <TrackOrderForm />

      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-[#300332]/40">
            Order Status
          </h2>

          <ol className="space-y-4">
            {orderStatuses.map((status, i) => (
              <li key={status.label} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D9C5B2]/40 text-[11px] font-bold text-[#300332]">
                  {i + 1}
                </span>
                <span className="text-[#300332]/70">
                  <strong className="text-[#300332]">{status.label}:</strong>{" "}
                  {status.desc}
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-10 rounded-2xl bg-[#D9C5B2]/20 p-6 text-center text-[#300332]/70">
            If you can&apos;t find your order or your delivery is taking longer
            than expected, please contact us with your Order Number.
            <br />
            <span className="mt-2 block text-[#300332]">
              Phone: {CONTACT.phone} · Email: {CONTACT.email}
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
