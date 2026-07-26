import type { Lang } from "@/hooks/use-language";

export type { Lang };

/**
 * A value available in both languages. The data layer stores these; the UI
 * resolves them for the active language via `pick()`.
 */
export type Localized = { en: string; bn: string };

export function pick(value: Localized, lang: Lang): string {
  return value[lang];
}

/* ---------------------------- UI string table ---------------------------- */
/**
 * Every piece of chrome the blog renders, in both languages. Post *content*
 * lives in `blog-data.ts`; this is only labels, buttons and placeholders.
 */
export const UI = {
  // Page header
  journalKicker: { en: "The Glowly Journal", bn: "দ্য Glowly জার্নাল" },
  journalTitle: { en: "Skincare, decoded.", bn: "স্কিনকেয়ার, সহজভাবে।" },
  journalSubtitle: {
    en: "Evidence-based rituals, ingredient science and honest product guides — everything you need for skin that glows with intention.",
    bn: "বিজ্ঞানভিত্তিক রুটিন, উপাদানের বিজ্ঞান আর সৎ প্রোডাক্ট গাইড — উজ্জ্বল ত্বকের জন্য যা যা দরকার, সবই এক জায়গায়।",
  },

  // Listing chrome
  latestArticles: { en: "Latest Articles", bn: "সর্বশেষ লেখা" },
  featured: { en: "Featured", bn: "ফিচার্ড" },
  post: { en: "post", bn: "লেখা" },
  posts: { en: "posts", bn: "লেখা" },
  readMore: { en: "Read More", bn: "আরও পড়ুন" },
  minRead: { en: "min read", bn: "মিনিট পড়া" },
  min: { en: "min", bn: "মিনিট" },
  noResultsTitle: { en: "No articles found", bn: "কোনো লেখা পাওয়া যায়নি" },
  noResultsBody: {
    en: "Try a different search term or category.",
    bn: "অন্য কোনো শব্দ বা ক্যাটাগরি দিয়ে খুঁজে দেখুন।",
  },

  // Sidebar
  search: { en: "Search", bn: "খুঁজুন" },
  searchPlaceholder: {
    en: "Search articles...",
    bn: "লেখা খুঁজুন...",
  },
  categories: { en: "Categories", bn: "ক্যাটাগরি" },
  all: { en: "All", bn: "সব" },
  popularPosts: { en: "Popular Posts", bn: "জনপ্রিয় লেখা" },
  glowNotes: { en: "Glow Notes", bn: "গ্লো নোটস" },
  glowNotesBody: {
    en: "Skincare science and rituals, delivered fortnightly.",
    bn: "স্কিনকেয়ার বিজ্ঞান আর রুটিন, প্রতি দুই সপ্তাহে আপনার ইনবক্সে।",
  },

  // Newsletter
  emailPlaceholder: { en: "your@email.com", bn: "your@email.com" },
  subscribe: { en: "Subscribe", bn: "সাবস্ক্রাইব" },
  emailInvalid: {
    en: "Please enter a valid email address.",
    bn: "দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন।",
  },
  subscribedTitle: {
    en: "You're in! Watch your inbox for our next edit.",
    bn: "যুক্ত হয়ে গেছেন! পরবর্তী লেখার জন্য ইনবক্সে চোখ রাখুন।",
  },
  joinRitual: { en: "Join the ritual", bn: "রুটিনে যোগ দিন" },
  newsletterCtaTitle: {
    en: "Glow notes, straight to your inbox",
    bn: "গ্লো নোটস, সরাসরি আপনার ইনবক্সে",
  },
  newsletterCtaBody: {
    en: "Skincare science, new-product edits and members-only offers — no spam, just glow.",
    bn: "স্কিনকেয়ার বিজ্ঞান, নতুন প্রোডাক্ট আর শুধু সদস্যদের জন্য অফার — কোনো স্প্যাম নয়, শুধু গ্লো।",
  },

  // Single post
  home: { en: "Home", bn: "হোম" },
  journal: { en: "Journal", bn: "জার্নাল" },
  share: { en: "Share", bn: "শেয়ার" },
  writtenBy: { en: "Written by", bn: "লিখেছেন" },
  atGlowly: { en: "at Glowly", bn: "Glowly-তে" },
  relatedReading: { en: "Related Reading", bn: "সম্পর্কিত লেখা" },
  shopTheEdit: { en: "Shop the Edit", bn: "কালেকশন দেখুন" },
  shopNow: { en: "Shop Now", bn: "এখনই কিনুন" },

  // Post actions
  like: { en: "Like", bn: "লাইক" },
  liked: { en: "Liked", bn: "লাইকড" },
  save: { en: "Save", bn: "সেভ" },
  saved: { en: "Saved", bn: "সেভড" },
  linkCopied: {
    en: "Link copied to clipboard",
    bn: "লিংক কপি হয়েছে",
  },

  // Comments
  comments: { en: "Comments", bn: "মন্তব্য" },
  yourName: { en: "Your name", bn: "আপনার নাম" },
  yourThoughts: {
    en: "Share your thoughts...",
    bn: "আপনার মতামত লিখুন...",
  },
  postComment: { en: "Post Comment", bn: "মন্তব্য করুন" },
  justNow: { en: "Just now", bn: "এইমাত্র" },

  // Language toggle
  language: { en: "Language", bn: "ভাষা" },
} as const satisfies Record<string, Localized>;

export type UIKey = keyof typeof UI;

/** Resolve a UI label for the active language. */
export function t(key: UIKey, lang: Lang): string {
  return UI[key][lang];
}

/* --------------------------- Numbers and dates --------------------------- */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert ASCII digits in a string to Bengali numerals (no-op for English). */
export function localizeDigits(input: string | number, lang: Lang): string {
  const s = String(input);
  if (lang !== "bn") return s;
  return s.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** "2024-07-26" -> "July 26, 2024" / "২৬ জুলাই, ২০২৪". */
export function formatDate(iso: string, lang: Lang): string {
  const date = new Date(iso);
  if (lang === "bn") {
    // Explicit Bengali month names keep output consistent across environments
    // that may lack full `bn-BD` locale data.
    const months = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর",
    ];
    const day = localizeDigits(date.getDate(), "bn");
    const year = localizeDigits(date.getFullYear(), "bn");
    return `${day} ${months[date.getMonth()]}, ${year}`;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 18420 -> "18.4k" / "১৮.৪ক". */
export function formatViews(views: number, lang: Lang): string {
  if (views >= 1000) {
    const value = (views / 1000).toFixed(1);
    return lang === "bn"
      ? `${localizeDigits(value, "bn")}ক`
      : `${value}k`;
  }
  return localizeDigits(views, lang);
}
