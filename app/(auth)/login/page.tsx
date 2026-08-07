import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  // LoginForm reads `?from=` via useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
