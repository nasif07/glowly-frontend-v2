import type { Metadata } from "next";
import {
  PolicyPage,
  PolicySection,
  PolicyCallout,
} from "@/components/legal/policy-page";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Return & Exchange Policy | Glowly Bangladesh" },
  description:
    "Read Glowly's return and exchange policy, including eligibility, refunds, damaged products, and replacement guidelines.",
  alternates: { canonical: "/return-exchange-policy" },
  openGraph: {
    title: "Return & Exchange Policy | Glowly",
    description:
      "Read Glowly's return and exchange policy, including eligibility, refunds, damaged products, and replacement guidelines.",
    type: "website",
    url: "/return-exchange-policy",
  },
};

export default function ReturnExchangePolicyPage() {
  return (
    <PolicyPage
      eyebrow="Customer Support"
      title="Return & Exchange Policy"
      intro="We want you to be confident in every purchase. Here's how returns and exchanges work."
    >
      <PolicySection title="Return window">
        <p>
          You can request a return or exchange within 7 days of delivery.
        </p>
      </PolicySection>

      <PolicySection title="Conditions">
        <p>
          To be eligible, the product must be unused, unopened, in its original
          packaging, and with all seals intact.
        </p>
      </PolicySection>

      <PolicySection title="Non-returnable items">
        <p>
          For hygiene and safety reasons, opened, used, or damaged products are
          not eligible for return or exchange unless they were received damaged,
          incorrect, expired, or are confirmed to be non-authentic.
        </p>
      </PolicySection>

      <PolicySection title="How to start a return">
        <p>
          Contact us on WhatsApp at {CONTACT.phone} or email {CONTACT.email} with
          your Order Number and the reason for your return or exchange request.
          Our customer support team will guide you through the next steps.
        </p>
      </PolicySection>

      <PolicySection title="Refunds">
        <p>
          Once we receive and inspect the returned item, approved refunds will be
          issued via the original payment method or another mutually agreed
          payment method within 7–14 business days.
        </p>
      </PolicySection>

      <PolicySection title="Damaged, wrong, or non-authentic items">
        <p>
          If your order arrives damaged, incorrect, expired, or you believe it is
          not authentic, please contact us immediately with your Order Number and
          clear photos of the product.
        </p>
        <p>
          These cases are treated as a priority. If our investigation confirms
          the issue, we will arrange a replacement, exchange, or full refund, and
          the standard return conditions above will not apply.
        </p>
      </PolicySection>

      <PolicySection title="Return shipping">
        <p>
          If the return is due to a damaged, incorrect, expired, or non-authentic
          product, Glowly will cover the return shipping cost. For all other
          approved returns, the customer may be responsible for the return
          shipping charges unless otherwise agreed.
        </p>
      </PolicySection>

      <PolicyCallout title="Report issues early">
        <p>
          Please report these issues as soon as possible after receiving your
          order so we can resolve them quickly.
        </p>
        <p>
          Phone: {CONTACT.phone} · Email: {CONTACT.email}
        </p>
      </PolicyCallout>
    </PolicyPage>
  );
}
