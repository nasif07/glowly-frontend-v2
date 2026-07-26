"use client";

import { useState } from "react";
import { Instagram, Facebook, Heart, Bookmark, Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";

function PinterestIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.37 9.31-.09-.79-.17-2 .03-2.86.19-.82 1.2-5.2 1.2-5.2s-.31-.61-.31-1.52c0-1.42.83-2.48 1.85-2.48.87 0 1.29.66 1.29 1.44 0 .88-.56 2.2-.85 3.42-.24 1.02.51 1.86 1.52 1.86 1.83 0 3.23-1.93 3.23-4.71 0-2.46-1.77-4.18-4.3-4.18-2.93 0-4.65 2.2-4.65 4.47 0 .89.34 1.84.77 2.36.08.1.09.19.07.29-.08.32-.25 1.02-.29 1.16-.05.19-.15.23-.35.14-1.3-.6-2.11-2.5-2.11-4.02 0-3.27 2.38-6.28 6.86-6.28 3.6 0 6.4 2.57 6.4 6 0 3.58-2.26 6.46-5.39 6.46-1.05 0-2.04-.55-2.38-1.19l-.65 2.47c-.23.9-.86 2.03-1.29 2.72.97.3 2 .46 3.07.46 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

export function ShareButtons({ title }: { title: string }) {
  const { lang } = useLang();
  const share = (network: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(title);
    const enc = encodeURIComponent(url);
    const links: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${enc}&description=${text}`,
      instagram: "https://instagram.com",
    };
    if (typeof window !== "undefined") {
      window.open(links[network], "_blank", "noopener,noreferrer");
    }
  };

  const copyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("linkCopied", lang));
    }
  };

  const base =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#300332]/10 text-[#300332] transition-all hover:-translate-y-0.5 hover:text-white";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => share("instagram")}
        aria-label="Share on Instagram"
        className={`${base} hover:bg-[#C06B58]`}
      >
        <Instagram size={18} />
      </button>
      <button
        onClick={() => share("pinterest")}
        aria-label="Share on Pinterest"
        className={`${base} hover:bg-[#C8232C]`}
      >
        <PinterestIcon size={18} />
      </button>
      <button
        onClick={() => share("facebook")}
        aria-label="Share on Facebook"
        className={`${base} hover:bg-[#1877F2]`}
      >
        <Facebook size={18} />
      </button>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className={`${base} hover:bg-[#300332]`}
      >
        <Link2 size={18} />
      </button>
    </div>
  );
}

export function PostActions({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const size = compact ? 18 : 20;
  const btn = compact
    ? "flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90"
    : "flex items-center gap-2 rounded-full border border-[#300332]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest font-montserrat transition-all active:scale-95";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setLiked((v) => !v);
        }}
        aria-pressed={liked}
        aria-label="Like this post"
        className={`${btn} ${
          liked
            ? "bg-[#F5E6E0] text-[#C06B58]"
            : "text-[#300332] hover:bg-[#F5E6E0]/50"
        }`}
      >
        <Heart size={size} fill={liked ? "currentColor" : "none"} />
        {!compact && <span>{liked ? t("liked", lang) : t("like", lang)}</span>}
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setSaved((v) => !v);
        }}
        aria-pressed={saved}
        aria-label="Bookmark this post"
        className={`${btn} ${
          saved
            ? "bg-[#E8DFF5] text-[#6D4FA3]"
            : "text-[#300332] hover:bg-[#E8DFF5]/50"
        }`}
      >
        {saved ? <Check size={size} /> : <Bookmark size={size} />}
        {!compact && <span>{saved ? t("saved", lang) : t("save", lang)}</span>}
      </button>
    </div>
  );
}
