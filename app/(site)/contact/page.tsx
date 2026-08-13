import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { PolicyPage, PolicySection } from "@/components/legal/policy-page";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Glowly. Call, email, or message us on WhatsApp for help with orders, returns, or product authenticity.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Glowly",
    description:
      "Get in touch with Glowly. Call, email, or message us on WhatsApp for help with orders, returns, or product authenticity.",
    type: "website",
    url: "/contact",
  },
};

const channels = [
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phoneIntl}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT.phone,
    href: CONTACT.whatsapp,
  },
  {
    icon: MapPin,
    label: "Based in",
    value: CONTACT.city,
  },
];

const linkClass = "font-bold text-[#8E1454] underline underline-offset-4";

export default function ContactPage() {
  return (
    <PolicyPage
      eyebrow="We're Here To Help"
      title="Contact Us"
      intro="Questions about an order, a return, or whether a product is genuine? Reach out — we'll get back to you as quickly as we can."
    >
      <section className="grid gap-4 sm:grid-cols-2">
        {channels.map(({ icon: Icon, label, value, href }) => {
          const body = (
            <>
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#300332]/40">
                <Icon size={14} strokeWidth={1.5} />
                {label}
              </span>
              <span className="mt-3 block text-lg text-[#300332]">{value}</span>
            </>
          );
          const className =
            "block rounded-2xl bg-[#D9C5B2]/20 p-6 transition-colors hover:bg-[#D9C5B2]/35";

          return href ? (
            <a
              key={label}
              href={href}
              {...(href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={className}
            >
              {body}
            </a>
          ) : (
            <div key={label} className={className}>
              {body}
            </div>
          );
        })}
      </section>

      <PolicySection title="Before you write to us">
        <p>
          Many questions are answered faster on these pages:{" "}
          <Link href="/track-order" className={linkClass}>
            Track Your Order
          </Link>
          ,{" "}
          <Link href="/shipping-delivery-policy" className={linkClass}>
            Shipping &amp; Delivery
          </Link>
          ,{" "}
          <Link href="/return-exchange-policy" className={linkClass}>
            Returns &amp; Exchanges
          </Link>
          , and{" "}
          <Link href="/authenticity-verification" className={linkClass}>
            Authenticity Verification
          </Link>
          .
        </p>
        <p>
          If you&apos;re contacting us about a specific order, please have your
          Order Number ready — it helps us help you faster.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
