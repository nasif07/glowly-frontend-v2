import type { ReactNode } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

// Public storefront chrome — home, shop, cart, checkout, profile, etc.
// Scoped to this route group so /dashboard and /(auth)/* pages (which build
// their own full-bleed layouts) don't inherit it.
//
// `modal` is a parallel slot fed by `@modal/`. It is null on ordinary URLs and
// holds the auth drawer when /login or /register is reached by soft navigation,
// which is what keeps the current page rendered behind the drawer's scrim.
export default function SiteLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {modal}
    </>
  );
}
