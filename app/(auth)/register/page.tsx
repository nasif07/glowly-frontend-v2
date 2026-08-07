import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join the Glowly community to unlock conscious beauty.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
