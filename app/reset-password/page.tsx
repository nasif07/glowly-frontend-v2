import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Reset Password | Glowly",
  description: "Set a new password for your Glowly account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
