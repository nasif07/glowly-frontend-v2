import type { ReactNode } from "react";

// Login/register/password-reset pages render their own full-bleed,
// min-h-screen two-panel layout — no site Navbar/Footer here.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
