import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  // Hard-load fallback: reached by direct URL, refresh, or an expired-session
  // redirect. Soft navigation from the storefront is intercepted by
  // `app/(site)/@modal/(.)login`, which renders over the live page instead.
  // LoginForm reads `?from=` via useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <LoginForm standalone />
    </Suspense>
  );
}
