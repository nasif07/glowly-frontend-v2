import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

// Global catch-all for paths that don't match any route at all. Route-group
// `not-found.tsx` files (e.g. app/(site)/not-found.tsx) only cover notFound()
// calls within their own tree, so this one needs its own chrome.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[#300332]">
        <p>Life No Found....404....</p>
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-widest border-b border-[#300332] pb-1"
        >
          Back to Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
