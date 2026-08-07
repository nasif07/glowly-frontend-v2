import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Enter the verification code sent to your email.",
  robots: { index: false, follow: false },
};

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
}
