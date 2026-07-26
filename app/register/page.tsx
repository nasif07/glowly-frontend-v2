import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Create Account | Glowly",
  description: "Join the Glowly community to unlock conscious beauty.",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
