"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";

export default function NewsletterForm({
  variant = "sidebar",
}: {
  variant?: "sidebar" | "wide";
}) {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError(t("emailInvalid", lang));
      return;
    }
    setError("");
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-[#D4E5D9] px-5 py-4 text-[#4A7C59]">
        <Check size={20} className="shrink-0" />
        <p className="text-sm font-semibold font-montserrat">
          {t("subscribedTitle", lang)}
        </p>
      </div>
    );
  }

  const wide = variant === "wide";

  return (
    <form
      onSubmit={handleSubmit}
      className={wide ? "flex flex-col sm:flex-row gap-3" : "space-y-3"}
    >
      <div className={wide ? "relative flex-1" : "relative"}>
        <Mail
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#300332]/30"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder", lang)}
          aria-label={t("emailPlaceholder", lang)}
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#300332]/10 bg-white text-sm font-montserrat outline-none transition-colors focus:border-[#300332]"
        />
      </div>
      <button
        type="submit"
        className={`h-12 rounded-xl bg-[#300332] px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#4a054d] active:scale-95 font-montserrat ${
          wide ? "" : "w-full"
        }`}
      >
        {t("subscribe", lang)}
      </button>
      {error && (
        <p className="text-xs text-rose-500 font-semibold font-montserrat">
          {error}
        </p>
      )}
    </form>
  );
}
