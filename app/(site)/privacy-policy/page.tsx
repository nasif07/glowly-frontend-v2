import type { Metadata } from "next";
import {
  PolicyPage,
  PolicySection,
  PolicyCallout,
} from "@/components/legal/policy-page";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | Glowly Bangladesh" },
  description:
    "Learn how Glowly collects, uses, and protects your personal information. Your privacy and data security are important to us.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Glowly",
    description:
      "Learn how Glowly collects, uses, and protects your personal information. Your privacy and data security are important to us.",
    type: "website",
    url: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Your Data"
      title="Privacy Policy"
      intro="Glowly respects your privacy. This page explains what information we collect and how we use it."
    >
      <PolicySection title="What we collect">
        <p>
          When you place an order or contact us, we collect information such as
          your name, phone number, delivery address, and email. We may also
          collect billing information (where applicable), order history, account
          information (if you create an account), and your communication history
          with our customer support team. We only collect information necessary
          to provide our services.
        </p>
      </PolicySection>

      <PolicySection title="How we use it">
        <p>
          We use your information to process and deliver your order, respond to
          inquiries, verify product authenticity claims, improve our customer
          service, and send order-related updates. We do not sell your personal
          information to third parties.
        </p>
      </PolicySection>

      <PolicySection title="Who we share it with">
        <p>
          We share order details only with parties needed to fulfill your order —
          for example, our courier/delivery partner and payment processor. We may
          also share information where required by law or to comply with legal
          obligations.
        </p>
      </PolicySection>

      <PolicySection title="Data retention">
        <p>
          We keep order and account records for as long as required under
          Bangladeshi law (currently a minimum of 6 years for business records),
          or for as long as necessary to provide our services and resolve
          disputes.
        </p>
      </PolicySection>

      <PolicySection title="Cookies">
        <p>
          Glowly may use cookies and similar technologies to enhance your
          browsing experience, remember your preferences, analyze website
          traffic, and measure the effectiveness of our marketing efforts. We may
          use services such as Google Analytics and Meta (Facebook) Pixel for
          analytics and advertising purposes. You can control or disable cookies
          through your browser settings, although some website features may not
          function properly.
        </p>
      </PolicySection>

      <PolicySection title="Your rights">
        <p>
          You can contact us at any time to ask what information we hold about
          you, request a correction, update your information, or request the
          deletion of your personal data where permitted by applicable law.
        </p>
      </PolicySection>

      <PolicyCallout title="Contact">
        <p>Questions about this policy?</p>
        <p>
          Phone: {CONTACT.phone}
          <br />
          Email: {CONTACT.email}
        </p>
      </PolicyCallout>
    </PolicyPage>
  );
}
