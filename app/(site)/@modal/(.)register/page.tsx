import { Suspense } from "react";
import { RegisterForm } from "@/components/forms";

/**
 * Intercepts soft navigation to /register. See `(.)login` for the details —
 * this keeps the "Register here" link inside the login drawer swapping the
 * panel contents rather than blanking the page behind it.
 */
export default function RegisterModal() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
