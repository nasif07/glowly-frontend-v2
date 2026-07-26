"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { avatar } from "@/lib/blog";
import { t, pick, localizeDigits, type Localized } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";

interface Comment {
  id: number;
  name: string;
  avatar: string;
  /** Bilingual relative date, or a plain string for freshly-posted comments. */
  date: Localized | string;
  text: Localized | string;
}

const seed: Comment[] = [
  {
    id: 1,
    name: "Mariam K.",
    avatar: avatar(5),
    date: { en: "3 days ago", bn: "৩ দিন আগে" },
    text: {
      en: "This finally made the whole routine click for me. I was definitely over-exfoliating — cutting back to twice a week made a huge difference.",
      bn: "এই লেখাটা পড়ে অবশেষে পুরো রুটিনটা আমার কাছে পরিষ্কার হলো। আমি নিশ্চিতভাবেই অতিরিক্ত এক্সফোলিয়েট করছিলাম — সপ্তাহে দুবারে নামিয়ে আনায় বিরাট পার্থক্য হয়েছে।",
    },
  },
  {
    id: 2,
    name: "Tanvir H.",
    avatar: avatar(15),
    date: { en: "1 week ago", bn: "১ সপ্তাহ আগে" },
    text: {
      en: "Loved the note about applying hyaluronic acid on damp skin. Total game changer, thank you Glowly team!",
      bn: "ভেজা ত্বকে হায়ালুরনিক অ্যাসিড লাগানোর পরামর্শটা দারুণ লেগেছে। পুরো ব্যাপারটাই বদলে দিয়েছে, ধন্যবাদ Glowly টিম!",
    },
  },
];

export default function BlogComments() {
  const { lang } = useLang();
  const [comments, setComments] = useState<Comment[]>(seed);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const resolve = (value: Localized | string): string =>
    typeof value === "string" ? value : pick(value, lang);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        name: name.trim(),
        avatar: avatar(((Date.now() % 60) + 1) as number),
        date: t("justNow", lang),
        text: text.trim(),
      },
      ...prev,
    ]);
    setName("");
    setText("");
  };

  return (
    <section className="mt-14 border-t border-[#300332]/10 pt-10">
      <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-[#2D1B14]">
        <MessageCircle size={22} className="text-[#D4A574]" />
        {t("comments", lang)} ({localizeDigits(comments.length, lang)})
      </h3>

      {/* Form */}
      <form
        onSubmit={submit}
        className="mb-10 rounded-2xl border border-[#300332]/8 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("yourName", lang)}
          aria-label={t("yourName", lang)}
          className="mb-3 w-full rounded-xl border border-[#300332]/10 bg-[#FAF9F6] px-4 py-3 text-sm font-montserrat outline-none focus:border-[#300332]"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("yourThoughts", lang)}
          rows={3}
          aria-label={t("yourThoughts", lang)}
          className="mb-3 w-full resize-none rounded-xl border border-[#300332]/10 bg-[#FAF9F6] px-4 py-3 text-sm font-montserrat outline-none focus:border-[#300332]"
        />
        <button
          type="submit"
          className="rounded-full bg-[#300332] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#4a054d] active:scale-95 font-montserrat"
        >
          {t("postComment", lang)}
        </button>
      </form>

      {/* List */}
      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4">
            <Image
              src={c.avatar}
              alt={c.name}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
            <div className="flex-1 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="mb-1 flex items-center gap-2">
                <p className="text-sm font-bold text-[#2D1B14] font-montserrat">
                  {c.name}
                </p>
                <span className="text-[11px] text-[#300332]/40 font-montserrat">
                  {resolve(c.date)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#5D4037]/85 font-montserrat">
                {resolve(c.text)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
