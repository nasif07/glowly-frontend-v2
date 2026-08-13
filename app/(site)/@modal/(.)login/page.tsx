import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

/**
 * Intercepts soft navigation to /login from anywhere in the storefront. The
 * page the user was on stays mounted underneath, so the drawer's scrim dims a
 * real page instead of an empty background. A refresh drops the interception
 * and falls through to `app/(auth)/login`.
 */
export default function LoginModal() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
