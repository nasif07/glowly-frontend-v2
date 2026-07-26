"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { localizeDigits } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const { lang } = useLang();
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const go = (p: number) => {
    onChange(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#300332]/10 text-[#300332] transition-all hover:bg-[#300332] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#300332]";

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={arrow}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-11 w-11 rounded-full text-sm font-bold font-montserrat transition-all ${
            p === page
              ? "bg-[#300332] text-white"
              : "border border-[#300332]/10 text-[#300332] hover:bg-[#F5E6E0]"
          }`}
        >
          {localizeDigits(p, lang)}
        </button>
      ))}

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={arrow}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
