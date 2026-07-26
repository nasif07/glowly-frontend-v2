"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "bn";

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

/**
 * Blog language preference. Persisted to localStorage under `glowly-lang` so the
 * choice survives reloads. Kept separate from the UI store because it is a
 * content concern (which language the reader wants), not a transient toggle.
 */
export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
      toggle: () => set((s) => ({ lang: s.lang === "en" ? "bn" : "en" })),
    }),
    { name: "glowly-lang" },
  ),
);

/**
 * Hydration-safe language accessor.
 *
 * The server (and the very first client paint) always renders English, then we
 * flip to the persisted value once mounted. Returning `en` until `mounted` is
 * true keeps the first client render identical to the server markup, avoiding a
 * hydration mismatch while still honouring the saved preference.
 */
export function useLang() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const toggle = useLangStore((s) => s.toggle);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return {
    lang: (mounted ? lang : "en") as Lang,
    mounted,
    setLang,
    toggle,
  } as const;
}
