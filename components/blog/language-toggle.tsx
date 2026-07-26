"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/hooks/use-language";

/**
 * English | বাংলা switch. Reads and writes the persisted language store, so the
 * whole blog re-renders in the chosen language instantly. Rendered in the blog
 * header (listing) and beside the breadcrumb (single post).
 */
export default function LanguageToggle({
  className = "",
}: {
  className?: string;
}) {
  const { lang, setLang, mounted } = useLang();

  const base =
    "px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] rounded-full transition-all";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-[#300332]/12 bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${className}`}
    >
      <Languages size={15} className="ml-1.5 text-[#300332]/40" aria-hidden />
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={mounted && lang === "en"}
        className={`${base} font-montserrat ${
          lang === "en"
            ? "bg-[#300332] text-white"
            : "text-[#300332]/60 hover:text-[#300332]"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("bn")}
        aria-pressed={mounted && lang === "bn"}
        className={`${base} font-bengali ${
          lang === "bn"
            ? "bg-[#300332] text-white"
            : "text-[#300332]/60 hover:text-[#300332]"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
