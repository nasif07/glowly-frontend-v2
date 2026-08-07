import type { ReactNode } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

// Public storefront chrome — home, shop, cart, checkout, profile, etc.
// Scoped to this route group so /dashboard and /(auth)/* pages (which build
// their own full-bleed layouts) don't inherit it.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
