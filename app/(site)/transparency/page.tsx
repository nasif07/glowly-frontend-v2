import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
  PolicyCallout,
} from "@/components/legal/policy-page";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute:
      "Our Transparency | Glowly | 100% Original Skincare Products in Bangladesh",
  },
  description:
    "Learn how Glowly ensures every skincare product is 100% authentic. We source directly from authorized distributors for complete transparency and customer trust.",
  alternates: { canonical: "/transparency" },
  openGraph: {
    title: "Our Transparency | Glowly",
    description:
      "Learn how Glowly ensures every skincare product is 100% authentic. We source directly from authorized distributors for complete transparency and customer trust.",
    type: "website",
    url: "/transparency",
  },
};

const faqs = [
  {
    question: "How do I know a product is real?",
    answer:
      "Check the batch code on your product against the brand's official website. It should match, every time.",
  },
  {
    question: "Where do your products come from?",
    answer:
      "Directly from authorized distributors — the same channels the brands themselves use.",
  },
  {
    question: "What if a product seems off?",
    answer:
      "Reach out to us right away. We'll help you verify it and make it right.",
  },
  {
    question: "Why trust Glowly over other sellers?",
    answer:
      "We don't sell anything we can't trace back to an authorized source. If we can't verify it, we don't carry it.",
  },
  {
    question: "What brands do you carry?",
    answer:
      "Brands like The Ordinary, CosRx, CeraVe, Simple, Purito, and Beauty of Joseon.",
  },
];

export default function TransparencyPage() {
  return (
    <PolicyPage
      eyebrow="Trust & Transparency"
      title="Our Transparency"
      intro="Authenticity is at the heart of everything we do. Every product on Glowly is carefully checked before it's added to our store."
    >
      <PolicySection title="How we source">
        <p>
          We source our products directly from authorized distributors of trusted
          brands like The Ordinary, COSRX, and CeraVe, never from unauthorized
          sellers.
        </p>
        <p>
          Every product comes with a batch code that you can verify on the
          brand&apos;s official website. If we can&apos;t confirm a product is
          authentic, we simply don&apos;t sell it.
        </p>
      </PolicySection>

      <PolicySection title="FAQs">
        <dl className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="space-y-2">
              <dt className="font-bold text-[#300332]">{faq.question}</dt>
              <dd>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </PolicySection>

      <PolicyCallout title="Still have questions?">
        <p>
          Read more about{" "}
          <Link
            href="/authenticity-verification"
            className="font-bold text-[#8E1454] underline underline-offset-4"
          >
            verifying your product
          </Link>
          , or reach us directly.
        </p>
        <p>
          Phone: {CONTACT.phone} · Email: {CONTACT.email}
        </p>
      </PolicyCallout>
    </PolicyPage>
  );
}
