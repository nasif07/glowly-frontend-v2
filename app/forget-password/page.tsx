import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Forgot Password | Glowly",
  description: "Reset your Glowly account password.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
