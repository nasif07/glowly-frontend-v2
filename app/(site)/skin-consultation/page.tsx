import type { Metadata } from "next";
import { ConsultationForm } from "@/components/consultation/consultation-form";

export const metadata: Metadata = {
  title: { absolute: "Free Skin Consultation | Glowly Bangladesh" },
  description:
    "Send photos of your skin concern and get free skincare advice from Glowly's team on WhatsApp. Available in English and Bangla.",
  alternates: { canonical: "/skin-consultation" },
  openGraph: {
    title: "Free Skin Consultation | Glowly",
    description:
      "Send photos of your skin concern and get free skincare advice on WhatsApp.",
    type: "website",
    url: "/skin-consultation",
  },
};

export default function SkinConsultationPage() {
  return <ConsultationForm />;
}
