import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
  PolicyList,
} from "@/components/legal/policy-page";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Terms & Conditions | Glowly Bangladesh" },
  description:
    "Read Glowly's Terms & Conditions for ordering, payments, delivery, returns, product authenticity, and customer responsibilities in Bangladesh.",
  alternates: { canonical: "/terms-condition" },
  openGraph: {
    title: "Terms & Conditions | Glowly",
    description:
      "Read Glowly's Terms & Conditions for ordering, payments, delivery, returns, product authenticity, and customer responsibilities in Bangladesh.",
    type: "website",
    url: "/terms-condition",
  },
};

const linkClass = "font-bold text-[#8E1454] underline underline-offset-4";

export default function TermsConditionPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="Welcome to Glowly (glowlybd.com). By accessing or purchasing from our website, you agree to the terms below. Please read them carefully before placing an order."
    >
      <PolicySection title="1. About us">
        <p>
          Glowly is an online skincare retailer based in Bangladesh, founded in
          2026. We sell skincare products sourced directly from authorized
          distributors of the brands we carry.
        </p>
        <p>
          Business name: Glowly | Original Skincare Products in Bangladesh
          <br />
          Contact: {CONTACT.phone}
        </p>
      </PolicySection>

      <PolicySection title="2. Eligibility">
        <p>
          You must be at least 16 years old, or have the permission of a parent
          or guardian, to place an order with us.
        </p>
      </PolicySection>

      <PolicySection title="3. Product information">
        <p>
          We do our best to describe our products accurately, including
          ingredients, origin, and manufacturing details where applicable.
          Product images are for illustration; actual packaging may vary slightly
          by batch.
        </p>
        <p>
          All products sold on Glowly are sourced directly from authorized
          distributors, never from unauthorized resellers. Every item includes a
          batch code that can be verified against the brand&apos;s official
          website.
        </p>
      </PolicySection>

      <PolicySection title="4. Pricing & payment">
        <p>
          All prices are listed in BDT (Bangladeshi Taka) and exclude delivery
          charges, which are calculated at checkout.
        </p>
        <p>
          Accepted payment methods: Cash on Delivery (COD), Mobile Banking, and
          Online Card Payments (where available).
        </p>
        <p>
          We reserve the right to correct pricing errors before an order is
          confirmed.
        </p>
      </PolicySection>

      <PolicySection title="5. Orders">
        <p>
          Placing an order is an offer to purchase, which we may accept or
          decline (for example, in cases of stock unavailability or suspected
          fraud). You&apos;ll receive confirmation once your order is accepted.
        </p>
      </PolicySection>

      <PolicySection title="6. Delivery">
        <PolicyList
          items={[
            <>
              <strong className="text-[#300332]">Same-city delivery:</strong>{" "}
              within 1–5 business days.
            </>,
            <>
              <strong className="text-[#300332]">Other-city delivery:</strong>{" "}
              within 2–10 business days.
            </>,
            <>
              <strong className="text-[#300332]">Delivery charges:</strong>{" "}
              calculated at checkout and may vary depending on your location.
            </>,
          ]}
        />
        <p>
          Delays can occur due to circumstances outside our control (courier
          delays, weather, force majeure); we&apos;ll notify you if this happens.
          See our{" "}
          <Link href="/shipping-delivery-policy" className={linkClass}>
            Shipping &amp; Delivery Policy
          </Link>{" "}
          for full details.
        </p>
      </PolicySection>

      <PolicySection title="7. Returns, refunds & replacement">
        <PolicyList
          items={[
            <>
              <strong className="text-[#300332]">Return window:</strong> within 7
              days of delivery.
            </>,
            <>
              <strong className="text-[#300332]">Condition required:</strong> the
              product must be unused, unopened, and in its original packaging.
            </>,
            <>
              <strong className="text-[#300332]">
                Refund method and timeline:
              </strong>{" "}
              approved refunds will be processed through the original payment
              method or another mutually agreed method within 7–14 business days.
            </>,
            <>
              <strong className="text-[#300332]">Non-returnable items:</strong>{" "}
              opened, used, or damaged products (unless received damaged,
              incorrect, expired, or found to be non-authentic).
            </>,
          ]}
        />
        <p>
          If a product arrives damaged, incorrect, or fails our authenticity
          verification, contact us at {CONTACT.phone}, and we will investigate
          the issue and arrange a replacement or refund where applicable. Full
          details are in our{" "}
          <Link href="/return-exchange-policy" className={linkClass}>
            Return &amp; Exchange Policy
          </Link>
          .
        </p>
      </PolicySection>

      <PolicySection title="8. Product authenticity">
        <p>
          We guarantee that every product sold on Glowly is authentic and sourced
          from an authorized distributor. If you believe a product you received
          is not genuine, contact us immediately so we can investigate and make
          it right.
        </p>
      </PolicySection>

      <PolicySection title="9. Your personal data">
        <p>
          We collect personal information (such as name, address, and phone
          number) only as needed to process and deliver your order. We do not
          share your data with third parties except as required to fulfill your
          order (e.g., courier partners) or as required by law.
        </p>
        <p>
          For full details on what we collect, how long we keep it, and your
          rights, see our{" "}
          <Link href="/privacy-policy" className={linkClass}>
            Privacy Policy
          </Link>
          .
        </p>
      </PolicySection>

      <PolicySection title="10. Prohibited use">
        <p>
          You agree not to use Glowly for any unlawful purpose, to attempt
          fraudulent orders, or to interfere with the site&apos;s normal
          operation.
        </p>
      </PolicySection>

      <PolicySection title="11. Intellectual property">
        <p>
          All content on glowlybd.com, including text, images, and logos, belongs
          to Glowly or its licensors and may not be copied or reused without
          permission.
        </p>
      </PolicySection>

      <PolicySection title="12. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Glowly is not liable for
          indirect or incidental damages arising from the use of our products or
          website. Nothing in these Terms limits any right you have under
          Bangladeshi consumer protection law.
        </p>
      </PolicySection>

      <PolicySection title="13. Complaints & dispute resolution">
        <p>
          If you have a complaint, contact us at {CONTACT.phone}, and we will aim
          to resolve it within 7 business days.
        </p>
      </PolicySection>

      <PolicySection title="14. Governing law">
        <p>
          These Terms are governed by the laws of the People&apos;s Republic of
          Bangladesh. Any disputes will be subject to the jurisdiction of the
          courts of Chattogram, Bangladesh.
        </p>
      </PolicySection>

      <PolicySection title="15. Changes to these terms">
        <p>
          We may update these Terms from time to time. Continued use of the site
          after changes means you accept the updated Terms.
        </p>
      </PolicySection>

      <PolicySection title="16. Contact us">
        <p>
          Questions about these Terms? Reach us at {CONTACT.phone} or{" "}
          {CONTACT.email}.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
