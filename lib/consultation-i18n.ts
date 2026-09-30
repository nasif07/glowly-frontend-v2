import type { Localized, Lang } from "@/lib/i18n";
import type { AgeRange, SkinType } from "@/types";

/**
 * Every string on the skin consultation page, in English and Bangla. Same
 * `{ en, bn }` + `pick()` scheme as the blog (lib/i18n.ts); only this page and
 * the blog are translated so far.
 */
export const CONSULT_UI = {
  kicker: { en: "Free skin consultation", bn: "বিনামূল্যে ত্বক পরামর্শ" },
  title: { en: "Tell us about your skin", bn: "আপনার ত্বকের কথা আমাদের জানান" },
  subtitle: {
    en: "Share a few photos and what's bothering you. Our skincare team will look at them and message you on WhatsApp with advice and product suggestions.",
    bn: "কয়েকটি ছবি আর আপনার সমস্যার কথা লিখে পাঠান। আমাদের স্কিনকেয়ার টিম ছবিগুলো দেখে হোয়াটসঅ্যাপে পরামর্শ আর উপযুক্ত প্রোডাক্টের কথা জানাবে।",
  },
  notMedical: {
    en: "This is skincare advice, not a medical diagnosis. For pain, bleeding, infection or a spreading rash, please see a doctor.",
    bn: "এটি স্কিনকেয়ার পরামর্শ, চিকিৎসা নির্ণয় নয়। ব্যথা, রক্তপাত, সংক্রমণ বা ছড়িয়ে পড়া র‍্যাশ থাকলে অনুগ্রহ করে ডাক্তার দেখান।",
  },

  // Fields
  name: { en: "Your name", bn: "আপনার নাম" },
  namePlaceholder: { en: "e.g. Nusrat Jahan", bn: "যেমন: নুসরাত জাহান" },
  whatsapp: { en: "WhatsApp number", bn: "হোয়াটসঅ্যাপ নম্বর" },
  whatsappHint: {
    en: "We'll reply here, so please check it's right.",
    bn: "আমরা এই নম্বরে উত্তর দেব, তাই নম্বরটি সঠিক কিনা দেখে নিন।",
  },
  ageRange: { en: "Age range", bn: "বয়সসীমা" },
  skinType: { en: "Skin type", bn: "ত্বকের ধরন" },
  optional: { en: "optional", bn: "ঐচ্ছিক" },
  choose: { en: "Choose…", bn: "বেছে নিন…" },
  concern: { en: "What's bothering your skin?", bn: "আপনার ত্বকের সমস্যা কী?" },
  concernPlaceholder: {
    en: "When did it start, where is it, what have you tried, anything that makes it better or worse…",
    bn: "কবে থেকে, কোথায় হচ্ছে, কী কী ব্যবহার করেছেন, কিসে বাড়ে বা কমে…",
  },

  // Photos
  photos: { en: "Photos of the affected skin", bn: "আক্রান্ত ত্বকের ছবি" },
  photosHint: {
    en: "1 to 4 clear photos in daylight, without filters. JPG, PNG or WebP.",
    bn: "দিনের আলোয় তোলা, ফিল্টার ছাড়া ১ থেকে ৪টি পরিষ্কার ছবি। JPG, PNG বা WebP।",
  },
  addPhoto: { en: "Add photo", bn: "ছবি যোগ করুন" },
  uploading: { en: "Uploading…", bn: "আপলোড হচ্ছে…" },
  uploadFailed: { en: "Upload failed", bn: "আপলোড হয়নি" },
  retry: { en: "Try again", bn: "আবার চেষ্টা করুন" },
  remove: { en: "Remove photo", bn: "ছবি সরান" },
  maxPhotos: { en: "You can add up to 4 photos.", bn: "সর্বোচ্চ ৪টি ছবি দেওয়া যাবে।" },
  notImage: {
    en: "Please choose a JPG, PNG or WebP photo.",
    bn: "অনুগ্রহ করে JPG, PNG বা WebP ছবি বেছে নিন।",
  },
  tooLarge: {
    en: "This photo is too large. Please choose one under 25MB.",
    bn: "ছবিটি অনেক বড়। অনুগ্রহ করে ২৫MB-এর কম একটি ছবি বেছে নিন।",
  },
  waitForUploads: {
    en: "Please wait for your photos to finish uploading.",
    bn: "ছবি আপলোড শেষ হওয়া পর্যন্ত অপেক্ষা করুন।",
  },
  photosPrivate: {
    en: "Your photos are stored privately. Only our skincare team can see them, and they're deleted 90 days after your consultation is closed.",
    bn: "আপনার ছবি গোপনে সংরক্ষিত থাকে। শুধু আমাদের স্কিনকেয়ার টিম দেখতে পারে, আর পরামর্শ শেষ হওয়ার ৯০ দিন পর ছবিগুলো মুছে ফেলা হয়।",
  },

  // Consent + submit
  consent: {
    en: "I agree to share these photos and details with Glowly's skincare team so they can advise me on WhatsApp.",
    bn: "আমি এই ছবি ও তথ্য Glowly-র স্কিনকেয়ার টিমের সাথে শেয়ার করতে সম্মত, যাতে তারা হোয়াটসঅ্যাপে আমাকে পরামর্শ দিতে পারে।",
  },
  submit: { en: "Send for consultation", bn: "পরামর্শের জন্য পাঠান" },
  submitting: { en: "Sending…", bn: "পাঠানো হচ্ছে…" },
  fixFields: {
    en: "Please complete the highlighted fields.",
    bn: "চিহ্নিত ঘরগুলো পূরণ করুন।",
  },

  // Validation
  nameRequired: { en: "Please enter your name", bn: "আপনার নাম লিখুন" },
  whatsappRequired: {
    en: "Please enter your WhatsApp number",
    bn: "আপনার হোয়াটসঅ্যাপ নম্বর লিখুন",
  },
  whatsappInvalid: {
    en: "Enter a valid 11-digit mobile number, e.g. 01812345678",
    bn: "সঠিক ১১ সংখ্যার মোবাইল নম্বর লিখুন, যেমন: 01812345678",
  },
  concernShort: {
    en: "Please describe your concern in a little more detail",
    bn: "সমস্যাটি আরেকটু বিস্তারিত লিখুন",
  },
  concernLong: {
    en: "Please keep it under 2000 characters",
    bn: "অনুগ্রহ করে ২০০০ অক্ষরের মধ্যে লিখুন",
  },
  photosRequired: { en: "Add at least one photo", bn: "অন্তত একটি ছবি যোগ করুন" },
  consentRequired: {
    en: "Please agree before sending your photos",
    bn: "ছবি পাঠানোর আগে সম্মতি দিন",
  },

  // Done
  doneTitle: { en: "Thank you — we've got it!", bn: "ধন্যবাদ — আমরা পেয়েছি!" },
  doneBody: {
    en: "Our skincare team will look at your photos and message you on WhatsApp soon.",
    bn: "আমাদের স্কিনকেয়ার টিম আপনার ছবিগুলো দেখে শীঘ্রই হোয়াটসঅ্যাপে মেসেজ করবে।",
  },
  reference: { en: "Your reference", bn: "আপনার রেফারেন্স" },
  newRequest: { en: "Send another request", bn: "আরেকটি অনুরোধ পাঠান" },
  sendFailed: {
    en: "We couldn't send your request. Please try again.",
    bn: "অনুরোধ পাঠানো যায়নি। আবার চেষ্টা করুন।",
  },
  photosExpired: {
    en: "Your photos have expired. Please add them again.",
    bn: "আপনার ছবিগুলোর মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার যোগ করুন।",
  },
  tooManyRequests: {
    en: "Too many attempts. Please try again in an hour.",
    bn: "অনেকবার চেষ্টা করা হয়েছে। এক ঘণ্টা পর আবার চেষ্টা করুন।",
  },
} satisfies Record<string, Localized>;

export const AGE_RANGE_LABEL: Record<AgeRange, Localized> = {
  "under-18": { en: "Under 18", bn: "১৮-এর কম" },
  "18-24": { en: "18–24", bn: "১৮–২৪" },
  "25-34": { en: "25–34", bn: "২৫–৩৪" },
  "35-44": { en: "35–44", bn: "৩৫–৪৪" },
  "45+": { en: "45 or older", bn: "৪৫ বা তার বেশি" },
};

export const SKIN_TYPE_LABEL: Record<SkinType, Localized> = {
  oily: { en: "Oily", bn: "তৈলাক্ত" },
  dry: { en: "Dry", bn: "শুষ্ক" },
  combination: { en: "Combination", bn: "মিশ্র" },
  normal: { en: "Normal", bn: "স্বাভাবিক" },
  sensitive: { en: "Sensitive", bn: "সংবেদনশীল" },
  "not-sure": { en: "Not sure", bn: "নিশ্চিত নই" },
};

/** `t(key)` for the current language. */
export const consultT =
  (lang: Lang) =>
  (key: keyof typeof CONSULT_UI): string =>
    CONSULT_UI[key][lang];
