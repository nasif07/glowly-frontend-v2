"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import glowlyColored from "@/public/glowly-colored.png";

/**
 * Right-side drawer shell for the auth screens (login / register). Replaces the
 * old two-panel layout: the branding column is gone and the form slides in from
 * the right over a dimmed, blurred backdrop. Clicking the backdrop or the close
 * button returns the user to where they came from.
 *
 * Normally this is rendered through the `@modal` slot in the site layout (see
 * `app/(site)/@modal/(.)login`), so the page the user came from stays mounted
 * and shows through the scrim. On a hard load of /login or /register — direct
 * URL, refresh, expired-session redirect — there is no page underneath, so
 * `standalone` paints the site chrome as a stand-in instead of a flat slab.
 */
export function AuthDrawer({
  children,
  standalone = false,
}: {
  children: ReactNode;
  standalone?: boolean;
}) {
  const router = useRouter();

  const close = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="font-montserrat fixed inset-0 z-[100]">
      {/* Stand-in page, hard loads only — the scrim below sits on top of it.
          `isolate` is load-bearing: the Navbar is `sticky z-50`, and without a
          stacking context here that z-50 would paint over the scrim instead of
          being dimmed and blurred by it. */}
      {standalone && (
        <div
          aria-hidden
          className="bg-background absolute inset-0 isolate overflow-hidden"
        >
          <Navbar />
          <div className="absolute inset-x-0 top-1/4 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_center,#D9C5B2_0%,transparent_65%)] opacity-60" />
        </div>
      )}

      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="animate-in fade-in absolute inset-0 bg-[#300332]/45 backdrop-blur-lg duration-300"
      />

      {/* Right-side drawer */}
      <div className="animate-in slide-in-from-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-[#FAF9F6] shadow-2xl duration-500 ease-out">
        <div className="flex items-center justify-between px-8 pt-6 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src={glowlyColored} alt="Glowly" className="h-12 w-auto" />
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-full p-2 text-[#300332]/50 transition-colors hover:bg-[#300332]/5 hover:text-[#300332]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center px-8 py-10 lg:px-12">
          <div className="mx-auto w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
