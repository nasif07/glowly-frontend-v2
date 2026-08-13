import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join the Glowly community to unlock conscious beauty.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  // Hard-load fallback; soft navigation is intercepted by
  // `app/(site)/@modal/(.)register`. See the login page for details.
  return (
    <Suspense>
      <RegisterForm standalone />
    </Suspense>
  );
}
