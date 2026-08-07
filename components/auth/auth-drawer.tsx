"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import glowlyColored from "@/public/glowly-colored.png";

/**
 * Right-side drawer shell for the auth screens (login / register). Replaces the
 * old two-panel layout: the branding column is gone and the form slides in from
 * the right over a dimmed, blurred backdrop. Clicking the backdrop or the close
 * button returns the user to where they came from.
 */
export function AuthDrawer({ children }: { children: ReactNode }) {
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
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="animate-in fade-in absolute inset-0 bg-[#300332]/40 backdrop-blur-sm duration-300"
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
