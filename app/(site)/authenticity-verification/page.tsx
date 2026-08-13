import type { Metadata } from "next";
import {
  PolicyPage,
  PolicySection,
  PolicyCallout,
} from "@/components/legal/policy-page";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute:
      "Authenticity Verification | Glowly | Original Skincare Products Bangladesh",
  },
  description:
    "Learn how to verify your Glowly skincare products. Check batch codes, understand our sourcing process, and shop with confidence.",
  alternates: { canonical: "/authenticity-verification" },
  openGraph: {
    title: "Authenticity Verification | Glowly",
    description:
      "Learn how to verify your Glowly skincare products. Check batch codes, understand our sourcing process, and shop with confidence.",
    type: "website",
    url: "/authenticity-verification",
  },
};

export default function AuthenticityVerificationPage() {
  return (
    <PolicyPage
      eyebrow="Shop With Confidence"
      title="Authenticity Verification"
      intro="Every product sold on Glowly is sourced directly from authorized distributors, never unauthorized resellers. Here's how to confirm your product is genuine."
    >
      <PolicySection title="1. Find the batch code">
        <p>
          Look for the batch code printed on your product&apos;s packaging or the
          product itself — usually on the bottom or back.
        </p>
      </PolicySection>

      <PolicySection title="2. Verify the product">
        <p>
          Visit the brand&apos;s official website or contact their customer
          support for guidance on verifying your product. Some brands provide
          verification tools or authentication methods, while others may verify
          products through their customer service.
        </p>
      </PolicySection>

      <PolicySection title="3. Contact us if something's off">
        <p>
          If you&apos;re unable to verify your product or anything about it seems
          unusual, contact us immediately at {CONTACT.phone} or {CONTACT.email}.
          We&apos;ll investigate your concern and work with you to resolve it as
          quickly as possible.
        </p>
      </PolicySection>

      <PolicyCallout title="Why we do this">
        <p>
          Counterfeit skincare is a real problem in Bangladesh&apos;s market.
          That&apos;s why Glowly sources products exclusively from authorized
          distributors, ensuring every product we sell is authentic and safe for
          our customers.
        </p>
      </PolicyCallout>
    </PolicyPage>
  );
}
