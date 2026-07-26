import type { RawBlogAuthor, RawBlogPost } from "@/types/blog";
import { photo, avatar } from "@/lib/blog";

/* ------------------------------- Authors -------------------------------- */

const authors: Record<string, RawBlogAuthor> = {
  amara: {
    name: "Dr. Amara Chen",
    role: { en: "Cosmetic Dermatologist", bn: "কসমেটিক ডার্মাটোলজিস্ট" },
    avatar: avatar(47),
  },
  layla: {
    name: "Layla Rahman",
    role: { en: "Skincare Editor", bn: "স্কিনকেয়ার এডিটর" },
    avatar: avatar(45),
  },
  sana: {
    name: "Sana Ahmed",
    role: { en: "Licensed Esthetician", bn: "লাইসেন্সপ্রাপ্ত এসথেটিশিয়ান" },
    avatar: avatar(32),
  },
  noah: {
    name: "Noah Bennett",
    role: { en: "Formulation Scientist", bn: "ফর্মুলেশন সায়েন্টিস্ট" },
    avatar: avatar(12),
  },
  priya: {
    name: "Priya Das",
    role: { en: "Wellness Coach", bn: "ওয়েলনেস কোচ" },
    avatar: avatar(20),
  },
};

/* -------------------------------- Posts --------------------------------- */

export const BLOG_POSTS: RawBlogPost[] = [
  {
    id: "1",
    slug: "korean-10-step-skincare-routine",
    title: {
      en: "The Complete 10-Step Korean Skincare Routine for Glowing Skin",
      bn: "উজ্জ্বল ত্বকের জন্য সম্পূর্ণ ১০ ধাপের কোরিয়ান স্কিনকেয়ার রুটিন",
    },
    excerpt: {
      en: "The famous K-beauty routine isn't about doing more for the sake of it — it's about layering intention. Here's how each step works and how to make it your own.",
      bn: "বিখ্যাত কে-বিউটি রুটিন শুধু বেশি কিছু করার জন্য নয় — এটি যত্ন সহকারে স্তরে স্তরে সাজানোর ব্যাপার। প্রতিটি ধাপ কীভাবে কাজ করে আর কীভাবে একে নিজের মতো করে নেবেন, তা এখানে।",
    },
    featuredImage: photo("k-routine-hero", 1200, 600),
    category: "skincare-tips",
    author: authors.sana,
    date: "2024-07-22",
    views: 18420,
    content: [
      {
        type: "paragraph",
        text: {
          en: "The Korean skincare philosophy treats your complexion as a long-term investment rather than an overnight fix. The celebrated ten-step routine looks intimidating on paper, but at its heart it is simply a thoughtful sequence: cleanse thoroughly, treat gently, and seal in hydration. Once you understand the logic behind each layer, you can scale it up on a slow Sunday evening or trim it down to the essentials on a busy weekday morning.",
          bn: "কোরিয়ান স্কিনকেয়ার দর্শন ত্বককে রাতারাতি সমাধানের বদলে দীর্ঘমেয়াদি বিনিয়োগ হিসেবে দেখে। বিখ্যাত দশ ধাপের রুটিন কাগজে ভীতিকর মনে হলেও, মূলত এটি একটি যত্নে সাজানো ক্রম: ভালোভাবে পরিষ্কার করুন, যত্নের সাথে ট্রিট করুন, আর আর্দ্রতা আটকে রাখুন। প্রতিটি স্তরের যুক্তি বুঝে গেলে, অলস রবিবার সন্ধ্যায় আপনি এটি বাড়াতে পারেন, আবার ব্যস্ত কর্মদিবসের সকালে শুধু প্রয়োজনীয় ধাপগুলোতে নামিয়ে আনতে পারেন।",
        },
      },
      {
        type: "image",
        src: photo("k-routine-flatlay", 480, 360),
        alt: {
          en: "A minimalist flat lay of skincare bottles and cotton pads on a cream surface",
          bn: "ক্রিম রঙের পৃষ্ঠে স্কিনকেয়ার বোতল আর তুলার প্যাডের একটি ছিমছাম সাজানো ছবি",
        },
        layout: "right",
        caption: {
          en: "Lay your products out in order — it keeps the routine fast.",
          bn: "পণ্যগুলো ক্রম অনুযায়ী সাজিয়ে রাখুন — এতে রুটিন দ্রুত হয়।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Start with the double cleanse. An oil-based cleanser dissolves sunscreen, makeup and the sebum your skin produces throughout the day, while a gentle water-based cleanser follows to clear away sweat and any remaining residue. This two-part approach leaves your skin genuinely clean without stripping the moisture barrier — the single most common mistake we see in the treatment room.",
          bn: "শুরু করুন ডাবল ক্লিনজিং দিয়ে। তেলভিত্তিক ক্লিনজার সানস্ক্রিন, মেকআপ আর সারাদিনে ত্বকের তৈরি সিবাম গলিয়ে দেয়, এরপর মৃদু পানিভিত্তিক ক্লিনজার ঘাম আর অবশিষ্ট ময়লা পরিষ্কার করে। এই দুই ধাপের পদ্ধতি ময়েশ্চার ব্যারিয়ার নষ্ট না করেই ত্বক সত্যিকারভাবে পরিষ্কার করে — ট্রিটমেন্ট রুমে আমরা যে সবচেয়ে সাধারণ ভুলটি দেখি, সেটি এড়ানো যায়।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Next comes exfoliation, but only two or three times a week. A mild chemical exfoliant with AHAs or BHAs lifts away dead cells so the products that follow can actually absorb. Over-exfoliation causes far more damage than it prevents, so resist the urge to scrub daily.",
          bn: "এরপর আসে এক্সফোলিয়েশন, তবে সপ্তাহে মাত্র দুই বা তিনবার। AHA বা BHA যুক্ত মৃদু কেমিক্যাল এক্সফোলিয়েন্ট মৃত কোষ তুলে দেয় যাতে পরের পণ্যগুলো ঠিকভাবে শোষিত হতে পারে। অতিরিক্ত এক্সফোলিয়েশন উপকারের চেয়ে অনেক বেশি ক্ষতি করে, তাই প্রতিদিন ঘষার ইচ্ছা দমন করুন।",
        },
      },
      {
        type: "heading",
        text: {
          en: "Layering treatments: toner, essence and serum",
          bn: "ট্রিটমেন্ট স্তরে সাজানো: টোনার, এসেন্স আর সিরাম",
        },
      },
      {
        type: "image",
        src: photo("k-routine-toner", 480, 360),
        alt: {
          en: "Hands patting toner into the cheeks with a cotton round",
          bn: "তুলার প্যাড দিয়ে গালে টোনার আলতো করে চাপছে এমন হাত",
        },
        layout: "left",
        caption: {
          en: "Press, don't wipe — patting drives hydration deeper.",
          bn: "মুছবেন না, চাপ দিন — আলতো চাপে আর্দ্রতা গভীরে যায়।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "A hydrating toner rebalances your skin's pH and preps it to receive moisture. Follow with an essence — the quiet hero of K-beauty — a lightweight, watery layer packed with humectants that plump the skin from within. Then apply your treatment serum, chosen for your specific concern: brightening vitamin C in the morning, or barrier-repairing niacinamide in the evening.",
          bn: "একটি হাইড্রেটিং টোনার ত্বকের pH ভারসাম্য ফিরিয়ে আনে আর আর্দ্রতা গ্রহণের জন্য প্রস্তুত করে। এরপর ব্যবহার করুন এসেন্স — কে-বিউটির নীরব নায়ক — হালকা, জলীয় একটি স্তর যা হিউমেক্ট্যান্টে ভরপুর এবং ভেতর থেকে ত্বককে টানটান করে। তারপর আপনার নির্দিষ্ট সমস্যার জন্য বেছে নেওয়া ট্রিটমেন্ট সিরাম লাগান: সকালে উজ্জ্বলতার জন্য ভিটামিন সি, অথবা সন্ধ্যায় ব্যারিয়ার মেরামতের জন্য নিয়াসিনামাইড।",
        },
      },
      {
        type: "quote",
        text: {
          en: "Great skin is not about the number of products. It is about applying the right ingredient, in the right order, consistently.",
          bn: "সুন্দর ত্বক পণ্যের সংখ্যার ওপর নির্ভর করে না। এটি নির্ভর করে সঠিক উপাদান, সঠিক ক্রমে, নিয়মিত ব্যবহারের ওপর।",
        },
        cite: {
          en: "Sana Ahmed, Licensed Esthetician",
          bn: "সানা আহমেদ, লাইসেন্সপ্রাপ্ত এসথেটিশিয়ান",
        },
      },
      {
        type: "image",
        src: photo("k-routine-fullwidth", 1000, 560),
        alt: {
          en: "Overhead view of a full skincare shelf arranged by routine step",
          bn: "রুটিনের ধাপ অনুযায়ী সাজানো একটি পূর্ণ স্কিনকেয়ার তাকের উপর থেকে তোলা ছবি",
        },
        layout: "full",
        caption: {
          en: "The full ten-step line-up — build up to it gradually rather than all at once.",
          bn: "সম্পূর্ণ দশ ধাপের সারি — একসাথে নয়, ধীরে ধীরে এতে পৌঁছান।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "The final steps lock everything in. A dedicated eye cream addresses the delicate skin around the eyes, a moisturiser seals in every layer beneath it, and — in the morning — a broad-spectrum SPF protects all of that hard work from UV damage. Sunscreen is non-negotiable; it is the closest thing skincare has to a guarantee.",
          bn: "শেষ ধাপগুলো সবকিছু আটকে রাখে। একটি আলাদা আই ক্রিম চোখের চারপাশের সূক্ষ্ম ত্বকের যত্ন নেয়, ময়েশ্চারাইজার নিচের প্রতিটি স্তর সিল করে দেয়, আর — সকালে — একটি ব্রড-স্পেকট্রাম SPF এই সব পরিশ্রমকে UV ক্ষতি থেকে রক্ষা করে। সানস্ক্রিন বাদ দেওয়ার নয়; স্কিনকেয়ারে এটিই নিশ্চয়তার সবচেয়ে কাছের জিনিস।",
        },
      },
      {
        type: "productCta",
        title: {
          en: "Build your ritual with Glowly",
          bn: "Glowly-র সাথে আপনার রুটিন গড়ুন",
        },
        description: {
          en: "Our curated cleansers, essences and serums are formulated to layer beautifully — no pilling, no overwhelm.",
          bn: "আমাদের বাছাই করা ক্লিনজার, এসেন্স আর সিরাম সুন্দরভাবে স্তরে স্তরে বসার জন্য তৈরি — পিলিং নেই, জটিলতা নেই।",
        },
        href: "/shop",
        image: photo("k-routine-product", 400, 400),
      },
      {
        type: "paragraph",
        text: {
          en: "Give any new routine at least four weeks before you judge it. Skin cell turnover takes roughly 28 days, so real, visible change simply needs time. Start with the four essentials — cleanse, treat, moisturise, protect — and add the extra layers as they earn their place on your shelf.",
          bn: "যেকোনো নতুন রুটিনকে বিচার করার আগে অন্তত চার সপ্তাহ সময় দিন। ত্বকের কোষ পুনর্গঠনে প্রায় ২৮ দিন লাগে, তাই সত্যিকারের দৃশ্যমান পরিবর্তনের জন্য কেবল সময় প্রয়োজন। চারটি প্রয়োজনীয় ধাপ দিয়ে শুরু করুন — পরিষ্কার, ট্রিট, ময়েশ্চারাইজ, সুরক্ষা — আর অতিরিক্ত স্তরগুলো যোগ করুন যখন সেগুলো আপনার তাকে জায়গা করে নেওয়ার যোগ্যতা প্রমাণ করে।",
        },
      },
    ],
  },
  {
    id: "2",
    slug: "choose-the-right-moisturizer",
    title: {
      en: "How to Choose the Right Moisturizer for Your Skin Type",
      bn: "আপনার ত্বকের ধরন অনুযায়ী সঠিক ময়েশ্চারাইজার বেছে নেবেন যেভাবে",
    },
    excerpt: {
      en: "Dry, oily, combination or sensitive — the wrong moisturizer can undo an entire routine. Here's how to read your skin and match it to the right texture.",
      bn: "শুষ্ক, তৈলাক্ত, মিশ্র বা সংবেদনশীল — ভুল ময়েশ্চারাইজার পুরো রুটিন নষ্ট করে দিতে পারে। আপনার ত্বক পড়ে সঠিক টেক্সচারের সাথে মেলানোর উপায় এখানে।",
    },
    featuredImage: photo("moisturizer-hero", 1200, 600),
    category: "product-reviews",
    author: authors.layla,
    date: "2024-07-18",
    views: 12240,
    content: [
      {
        type: "paragraph",
        text: {
          en: "Moisturizer is the step most people get wrong — not because they skip it, but because they choose a formula that fights their skin instead of supporting it. The good news is that matching texture to skin type is far simpler than the beauty aisle makes it seem.",
          bn: "ময়েশ্চারাইজার হলো সেই ধাপ যা বেশিরভাগ মানুষ ভুল করে — এড়িয়ে যাওয়ার কারণে নয়, বরং এমন একটি ফর্মুলা বেছে নেওয়ার কারণে যা ত্বককে সহায়তা করার বদলে তার বিরুদ্ধে কাজ করে। ভালো খবর হলো, ত্বকের ধরনের সাথে টেক্সচার মেলানো বিউটি আইলের দেখানো জটিলতার চেয়ে অনেক সহজ।",
        },
      },
      {
        type: "image",
        src: photo("moisturizer-types", 480, 360),
        alt: {
          en: "Four small jars showing gel, lotion, cream and balm textures side by side",
          bn: "জেল, লোশন, ক্রিম আর বাম টেক্সচার পাশাপাশি দেখানো চারটি ছোট জার",
        },
        layout: "right",
        caption: {
          en: "Gel to balm: texture is the clue to the right match.",
          bn: "জেল থেকে বাম: সঠিক মিল খুঁজতে টেক্সচারই মূল সূত্র।",
        },
      },
      {
        type: "heading",
        text: {
          en: "First, identify your skin type honestly",
          bn: "প্রথমে, সৎভাবে আপনার ত্বকের ধরন চিনুন",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Wash your face with a gentle cleanser and wait an hour without applying anything. If your skin feels tight and looks flaky, you're dry. If there's shine across your forehead, nose and chin, you're oily. Shine in the T-zone with dry cheeks means combination, and redness or stinging points to a sensitive barrier.",
          bn: "একটি মৃদু ক্লিনজার দিয়ে মুখ ধুয়ে কিছু না লাগিয়ে এক ঘণ্টা অপেক্ষা করুন। যদি ত্বক টানটান লাগে আর খসখসে দেখায়, তবে আপনার ত্বক শুষ্ক। কপাল, নাক আর থুতনিতে চকচকে ভাব থাকলে ত্বক তৈলাক্ত। টি-জোনে চকচকে ভাব আর গাল শুষ্ক হলে মিশ্র ত্বক, আর লালচে ভাব বা জ্বালাপোড়া সংবেদনশীল ব্যারিয়ারের ইঙ্গিত দেয়।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Dry skin thrives on rich creams and balms with ceramides and shea butter that rebuild the barrier. Oily skin does best with oil-free gel moisturizers that hydrate without adding grease — yes, oily skin still needs moisture. Combination skin can multi-moisturize, using a lighter gel on the T-zone and something richer on the cheeks.",
          bn: "শুষ্ক ত্বক সিরামাইড আর শিয়া বাটার যুক্ত সমৃদ্ধ ক্রিম আর বামে ভালো থাকে, যা ব্যারিয়ার পুনর্গঠন করে। তৈলাক্ত ত্বকের জন্য তেলমুক্ত জেল ময়েশ্চারাইজার সবচেয়ে ভালো, যা চিটচিটে না করেই আর্দ্রতা দেয় — হ্যাঁ, তৈলাক্ত ত্বকেরও আর্দ্রতা দরকার। মিশ্র ত্বকে দুই ধরনের ময়েশ্চারাইজার ব্যবহার করা যায়, টি-জোনে হালকা জেল আর গালে কিছুটা সমৃদ্ধ কিছু।",
        },
      },
      {
        type: "image",
        src: photo("moisturizer-texture", 1000, 560),
        alt: {
          en: "Close-up of a moisturizer being swatched on skin, showing a glossy texture",
          bn: "ত্বকে ময়েশ্চারাইজার লাগানোর ক্লোজ-আপ, চকচকে টেক্সচার দেখাচ্ছে",
        },
        layout: "full",
        caption: {
          en: "A quick swatch test reveals how a formula sits on the skin.",
          bn: "একটি দ্রুত সোয়াচ টেস্ট দেখিয়ে দেয় ফর্মুলাটি ত্বকে কেমন বসে।",
        },
      },
      {
        type: "quote",
        text: {
          en: "Oily skin producing excess sebum is often a barrier crying out for hydration. Strip it and it fights back harder.",
          bn: "অতিরিক্ত সিবাম তৈরি করা তৈলাক্ত ত্বক প্রায়ই আসলে আর্দ্রতার জন্য কাঁদতে থাকা একটি ব্যারিয়ার। একে শুকিয়ে ফেললে সে আরও জোরে পাল্টা লড়াই করে।",
        },
        cite: {
          en: "Layla Rahman, Skincare Editor",
          bn: "লায়লা রহমান, স্কিনকেয়ার এডিটর",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Sensitive skin needs the shortest ingredient list you can find — fragrance-free, with calming actives like centella asiatica or oat. When in doubt, patch test on your inner arm for two days before committing it to your face.",
          bn: "সংবেদনশীল ত্বকের জন্য যত ছোট উপাদান তালিকা পাওয়া যায় ততই ভালো — সুগন্ধিমুক্ত, সেন্টেলা এশিয়াটিকা বা ওটের মতো প্রশান্তিদায়ক অ্যাক্টিভসহ। সন্দেহ হলে, মুখে ব্যবহার করার আগে হাতের ভেতরের অংশে দুই দিন প্যাচ টেস্ট করুন।",
        },
      },
      {
        type: "productCta",
        title: {
          en: "Find your texture match",
          bn: "আপনার টেক্সচার খুঁজে নিন",
        },
        description: {
          en: "From feather-light gels to barrier-repair creams, the Glowly moisturizer edit is sorted by skin type so you can shop with confidence.",
          bn: "পালকের মতো হালকা জেল থেকে ব্যারিয়ার-মেরামত ক্রিম পর্যন্ত, Glowly-র ময়েশ্চারাইজার কালেকশন ত্বকের ধরন অনুযায়ী সাজানো, যাতে আপনি আত্মবিশ্বাসের সাথে কিনতে পারেন।",
        },
        href: "/shop",
        image: photo("moisturizer-product", 400, 400),
      },
      {
        type: "paragraph",
        text: {
          en: "Whatever you choose, apply it to slightly damp skin — it locks in the water still sitting on the surface and dramatically improves hydration. A great moisturizer shouldn't announce itself; it should simply leave your skin comfortable, supple and quietly glowing.",
          bn: "যা-ই বেছে নিন, সামান্য ভেজা ত্বকে লাগান — এতে পৃষ্ঠে থাকা পানি আটকে যায় আর আর্দ্রতা অনেক বেড়ে যায়। একটি ভালো ময়েশ্চারাইজার নিজের উপস্থিতি জানান দেয় না; এটি কেবল ত্বককে আরামদায়ক, নরম আর নিঃশব্দে উজ্জ্বল রাখে।",
        },
      },
    ],
  },
  {
    id: "3",
    slug: "science-of-hyaluronic-acid",
    title: {
      en: "The Science Behind Hyaluronic Acid: Why Your Skin Needs It",
      bn: "হায়ালুরনিক অ্যাসিডের পেছনের বিজ্ঞান: কেন আপনার ত্বকের এটি দরকার",
    },
    excerpt: {
      en: "It holds up to a thousand times its weight in water — but only if you use it correctly. A clear look at how hyaluronic acid actually works.",
      bn: "এটি নিজের ওজনের হাজার গুণ পর্যন্ত পানি ধরে রাখে — তবে শুধু সঠিকভাবে ব্যবহার করলেই। হায়ালুরনিক অ্যাসিড আসলে কীভাবে কাজ করে তার একটি স্পষ্ট চিত্র।",
    },
    featuredImage: photo("ha-hero", 1200, 600),
    category: "ingredients-101",
    author: authors.noah,
    date: "2024-07-14",
    views: 20110,
    content: [
      {
        type: "paragraph",
        text: {
          en: "Hyaluronic acid has become skincare shorthand for hydration, and for good reason. It is a humectant — a molecule that binds water — and it occurs naturally in your skin, where it keeps tissue plump and cushioned. As we age, our natural stores decline, which is part of why mature skin looks less bouncy over time.",
          bn: "হায়ালুরনিক অ্যাসিড এখন স্কিনকেয়ারে আর্দ্রতার সমার্থক হয়ে উঠেছে, আর যথেষ্ট কারণেই। এটি একটি হিউমেক্ট্যান্ট — এমন একটি অণু যা পানি ধরে রাখে — এবং এটি স্বাভাবিকভাবেই আপনার ত্বকে থাকে, যেখানে এটি টিস্যুকে টানটান আর কোমল রাখে। বয়স বাড়ার সাথে আমাদের প্রাকৃতিক ভাণ্ডার কমে যায়, যা পরিণত ত্বক সময়ের সাথে কম টানটান দেখানোর একটি কারণ।",
        },
      },
      {
        type: "image",
        src: photo("ha-molecule", 480, 360),
        alt: {
          en: "Stylised diagram of a hyaluronic acid molecule binding water droplets",
          bn: "পানির ফোঁটা ধরে রাখা একটি হায়ালুরনিক অ্যাসিড অণুর নকশাকৃত চিত্র",
        },
        layout: "left",
        caption: {
          en: "Each molecule acts like a sponge, pulling water into the skin.",
          bn: "প্রতিটি অণু স্পঞ্জের মতো কাজ করে, ত্বকের ভেতরে পানি টেনে আনে।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "A single gram of hyaluronic acid can hold up to six litres of water. In a serum, molecules of different sizes work at different depths: larger molecules hydrate the surface and smooth fine lines instantly, while smaller, low-molecular-weight fragments travel deeper for longer-lasting plumpness.",
          bn: "এক গ্রাম হায়ালুরনিক অ্যাসিড ছয় লিটার পর্যন্ত পানি ধরে রাখতে পারে। একটি সিরামে বিভিন্ন আকারের অণু বিভিন্ন গভীরতায় কাজ করে: বড় অণু পৃষ্ঠকে আর্দ্র করে আর সঙ্গে সঙ্গে সূক্ষ্ম রেখা মসৃণ করে, আর ছোট, কম আণবিক ওজনের অংশগুলো গভীরে গিয়ে দীর্ঘস্থায়ী টানটান ভাব দেয়।",
        },
      },
      {
        type: "heading",
        text: {
          en: "The one mistake that dries you out",
          bn: "যে একটি ভুল আপনাকে শুষ্ক করে দেয়",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Here is the catch most people miss: because hyaluronic acid pulls water toward itself, applying it to bone-dry skin in a dry climate can backfire. With no ambient moisture to draw from, it can pull water up from the deeper layers of your skin and then evaporate — leaving you drier than before.",
          bn: "এখানে বেশিরভাগ মানুষ যে ব্যাপারটি মিস করে: যেহেতু হায়ালুরনিক অ্যাসিড নিজের দিকে পানি টানে, শুষ্ক আবহাওয়ায় একদম শুকনো ত্বকে এটি লাগালে উল্টো ফল হতে পারে। চারপাশে কোনো আর্দ্রতা না থাকায় এটি ত্বকের গভীর স্তর থেকে পানি টেনে তুলে বাষ্প হয়ে যেতে পারে — আপনাকে আগের চেয়েও শুষ্ক করে রেখে।",
        },
      },
      {
        type: "quote",
        text: {
          en: "Always apply hyaluronic acid to damp skin, then seal it with a moisturizer. That single habit is the difference between plump and parched.",
          bn: "সবসময় ভেজা ত্বকে হায়ালুরনিক অ্যাসিড লাগান, তারপর একটি ময়েশ্চারাইজার দিয়ে আটকে দিন। এই একটি অভ্যাসই টানটান আর শুষ্ক হওয়ার মধ্যে পার্থক্য গড়ে দেয়।",
        },
        cite: {
          en: "Noah Bennett, Formulation Scientist",
          bn: "নোয়াহ বেনেট, ফর্মুলেশন সায়েন্টিস্ট",
        },
      },
      {
        type: "image",
        src: photo("ha-application", 1000, 560),
        alt: {
          en: "A serum dropper releasing a clear droplet onto a fingertip",
          bn: "আঙুলের ডগায় স্বচ্ছ ফোঁটা ফেলছে এমন একটি সিরাম ড্রপার",
        },
        layout: "full",
        caption: {
          en: "Apply to damp skin and lock it in within sixty seconds.",
          bn: "ভেজা ত্বকে লাগান আর ষাট সেকেন্ডের মধ্যে আটকে দিন।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "In terms of results, expect an immediate difference in how hydrated and smooth your skin looks within days, and a visible softening of fine lines with consistent use over four to six weeks. Hyaluronic acid plays well with almost everything — vitamin C, retinol, niacinamide — which makes it one of the safest, most universally flattering actives you can add to a routine.",
          bn: "ফলাফলের ক্ষেত্রে, কয়েক দিনের মধ্যেই ত্বক কতটা আর্দ্র আর মসৃণ দেখায় তাতে সঙ্গে সঙ্গে পার্থক্য আশা করুন, আর চার থেকে ছয় সপ্তাহ নিয়মিত ব্যবহারে সূক্ষ্ম রেখা দৃশ্যত নরম হবে। হায়ালুরনিক অ্যাসিড প্রায় সবকিছুর সাথেই ভালো মেশে — ভিটামিন সি, রেটিনল, নিয়াসিনামাইড — যা একে রুটিনে যোগ করার মতো সবচেয়ে নিরাপদ, সর্বজনীনভাবে মানানসই অ্যাক্টিভগুলোর একটি করে তোলে।",
        },
      },
      {
        type: "productCta",
        title: {
          en: "Multi-weight hydration, bottled",
          bn: "বহু-স্তরের আর্দ্রতা, এক বোতলে",
        },
        description: {
          en: "Our hydrating serum blends three molecular weights of hyaluronic acid for hydration at every layer of the skin.",
          bn: "আমাদের হাইড্রেটিং সিরাম তিনটি আণবিক ওজনের হায়ালুরনিক অ্যাসিড মিশিয়ে ত্বকের প্রতিটি স্তরে আর্দ্রতা দেয়।",
        },
        href: "/shop",
        image: photo("ha-product", 400, 400),
      },
      {
        type: "paragraph",
        text: {
          en: "Think of hyaluronic acid as the foundation of hydration rather than a miracle in a bottle. Paired with a good moisturizer and daily SPF, it keeps skin looking dewy, resilient and healthy — the quiet groundwork that makes every other product perform better.",
          bn: "হায়ালুরনিক অ্যাসিডকে বোতলবন্দি অলৌকিক কিছু নয়, বরং আর্দ্রতার ভিত্তি হিসেবে ভাবুন। একটি ভালো ময়েশ্চারাইজার আর প্রতিদিনের SPF-এর সাথে মিলে এটি ত্বককে রাখে সতেজ, দৃঢ় আর সুস্থ — সেই নীরব ভিত্তি যা অন্য প্রতিটি পণ্যকে আরও ভালো কাজ করায়।",
        },
      },
    ],
  },
  {
    id: "4",
    slug: "natural-vs-synthetic-ingredients",
    title: {
      en: "Natural Ingredients vs Synthetic: What Actually Works",
      bn: "প্রাকৃতিক বনাম কৃত্রিম উপাদান: আসলে কোনটি কাজ করে",
    },
    excerpt: {
      en: "'Natural' and 'clean' sound reassuring, but your skin only recognises molecules — not marketing. A calm, evidence-based look at the real debate.",
      bn: "'প্রাকৃতিক' আর 'ক্লিন' শুনতে ভরসাদায়ক, কিন্তু আপনার ত্বক শুধু অণু চেনে — বিপণন নয়। আসল বিতর্কের একটি শান্ত, প্রমাণভিত্তিক পর্যালোচনা।",
    },
    featuredImage: photo("natural-hero", 1200, 600),
    category: "ingredients-101",
    author: authors.amara,
    date: "2024-07-10",
    views: 9870,
    content: [
      {
        type: "paragraph",
        text: {
          en: "Few topics generate more heat and less light than the natural-versus-synthetic debate. The uncomfortable truth is that your skin cannot tell whether a molecule was extracted from a plant or synthesised in a lab. It only responds to the molecule itself — its structure, concentration and stability.",
          bn: "খুব কম বিষয়ই প্রাকৃতিক-বনাম-কৃত্রিম বিতর্কের চেয়ে বেশি উত্তাপ আর কম আলো তৈরি করে। অস্বস্তিকর সত্য হলো, একটি অণু গাছ থেকে নেওয়া হয়েছে না ল্যাবে তৈরি হয়েছে, আপনার ত্বক তা বুঝতে পারে না। এটি কেবল অণুটির নিজের প্রতিই সাড়া দেয় — এর গঠন, ঘনত্ব আর স্থিতিশীলতা।",
        },
      },
      {
        type: "image",
        src: photo("natural-botanical", 480, 360),
        alt: {
          en: "Fresh botanical ingredients arranged beside laboratory glassware",
          bn: "ল্যাবরেটরির কাচের পাত্রের পাশে সাজানো তাজা উদ্ভিজ্জ উপাদান",
        },
        layout: "right",
        caption: {
          en: "Botanical or lab-made — the skin reads structure, not origin.",
          bn: "উদ্ভিজ্জ হোক বা ল্যাবে তৈরি — ত্বক গঠন পড়ে, উৎস নয়।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Natural ingredients can be wonderful. Plant oils, oat extracts and green tea polyphenols are genuinely soothing and antioxidant-rich. But 'natural' also includes poison ivy and essential oils that are among the most common causes of skin irritation. Natural is not a synonym for gentle.",
          bn: "প্রাকৃতিক উপাদান দারুণ হতে পারে। উদ্ভিজ্জ তেল, ওট নির্যাস আর গ্রিন টি পলিফেনল সত্যিই প্রশান্তিদায়ক আর অ্যান্টিঅক্সিডেন্টে সমৃদ্ধ। কিন্তু 'প্রাকৃতিক'-এর মধ্যে পয়জন আইভি আর কিছু এসেনশিয়াল অয়েলও পড়ে, যা ত্বকের জ্বালার সবচেয়ে সাধারণ কারণগুলোর একটি। প্রাকৃতিক মানেই মৃদু নয়।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Synthetic ingredients, meanwhile, are often more stable, more consistent and better studied. A lab-made version of vitamin C can be engineered to resist oxidation far longer than a raw botanical extract — which means it actually still works by the time it reaches your skin.",
          bn: "অন্যদিকে কৃত্রিম উপাদান প্রায়ই বেশি স্থিতিশীল, বেশি সামঞ্জস্যপূর্ণ আর ভালোভাবে গবেষিত। ভিটামিন সি-র একটি ল্যাব-তৈরি সংস্করণকে এমনভাবে বানানো যায় যেন এটি কাঁচা উদ্ভিজ্জ নির্যাসের চেয়ে অনেক বেশি সময় ধরে জারণ প্রতিরোধ করে — যার মানে আপনার ত্বকে পৌঁছানোর সময় এটি আসলেই কাজ করে।",
        },
      },
      {
        type: "image",
        src: photo("natural-compare", 1000, 560),
        alt: {
          en: "Side-by-side comparison of a botanical extract and its purified active",
          bn: "একটি উদ্ভিজ্জ নির্যাস আর তার বিশুদ্ধ অ্যাক্টিভের পাশাপাশি তুলনা",
        },
        layout: "full",
        caption: {
          en: "The best formulas borrow from both worlds — botanical comfort, engineered stability.",
          bn: "সেরা ফর্মুলা দুই জগৎ থেকেই নেয় — উদ্ভিজ্জ আরাম, প্রকৌশলে গড়া স্থিতিশীলতা।",
        },
      },
      {
        type: "quote",
        text: {
          en: "The dose makes the poison, and the formulation makes the ingredient. Origin is the least interesting part of the story.",
          bn: "মাত্রাই বিষ নির্ধারণ করে, আর ফর্মুলেশনই উপাদানকে গড়ে তোলে। উৎস গল্পের সবচেয়ে কম আকর্ষণীয় অংশ।",
        },
        cite: {
          en: "Dr. Amara Chen, Cosmetic Dermatologist",
          bn: "ডাঃ আমারা চেন, কসমেটিক ডার্মাটোলজিস্ট",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "The most effective products are rarely purist about it. They pair well-tolerated botanicals with precisely dosed, lab-verified actives, then test the finished formula for safety and efficacy. That combination — not a label — is what delivers results.",
          bn: "সবচেয়ে কার্যকর পণ্যগুলো এ ব্যাপারে খুব কমই বিশুদ্ধতাবাদী। এরা ভালোভাবে সহনীয় উদ্ভিজ্জ উপাদানকে নিখুঁতভাবে মাপা, ল্যাবে যাচাই করা অ্যাক্টিভের সাথে জোড়া লাগায়, তারপর তৈরি ফর্মুলাটির নিরাপত্তা আর কার্যকারিতা পরীক্ষা করে। সেই সংমিশ্রণ — কোনো লেবেল নয় — ফলাফল এনে দেয়।",
        },
      },
      {
        type: "productCta",
        title: {
          en: "Formulated, not fashionable",
          bn: "ফর্মুলেটেড, ফ্যাশন নয়",
        },
        description: {
          en: "Every Glowly product is built on evidence, blending gentle botanicals with clinically studied actives at effective concentrations.",
          bn: "প্রতিটি Glowly পণ্য প্রমাণের ওপর গড়া, মৃদু উদ্ভিজ্জ উপাদানকে কার্যকর ঘনত্বে ক্লিনিক্যালি গবেষিত অ্যাক্টিভের সাথে মিশিয়ে।",
        },
        href: "/shop",
        image: photo("natural-product", 400, 400),
      },
      {
        type: "paragraph",
        text: {
          en: "So the next time a label promises purity, look past the buzzword to the ingredient list and the concentration. Ask what a product contains and whether it is proven to work — not merely where its components were born.",
          bn: "তাই পরের বার কোনো লেবেল যখন বিশুদ্ধতার প্রতিশ্রুতি দেয়, বাজওয়ার্ড পেরিয়ে উপাদান তালিকা আর ঘনত্বের দিকে তাকান। জিজ্ঞেস করুন একটি পণ্যে কী আছে আর তা কাজ করে বলে প্রমাণিত কিনা — শুধু এর উপাদানগুলো কোথায় জন্মেছে তা নয়।",
        },
      },
    ],
  },
  {
    id: "5",
    slug: "summer-spf-guide",
    title: {
      en: "Summer Skincare: The SPF Guide and Lightweight Products You Need",
      bn: "গরমের স্কিনকেয়ার: আপনার প্রয়োজনীয় SPF গাইড আর হালকা পণ্য",
    },
    excerpt: {
      en: "Sunscreen is the highest-return step in any routine. Here's how to pick a formula you'll actually enjoy wearing every single day.",
      bn: "সানস্ক্রিন যেকোনো রুটিনের সবচেয়ে বেশি প্রতিদান দেওয়া ধাপ। প্রতিদিন সত্যিকারভাবে পরতে ভালো লাগবে এমন একটি ফর্মুলা বেছে নেওয়ার উপায় এখানে।",
    },
    featuredImage: photo("spf-hero", 1200, 600),
    category: "skincare-tips",
    author: authors.sana,
    date: "2024-07-06",
    views: 15630,
    content: [
      {
        type: "paragraph",
        text: {
          en: "If you do only one thing for your skin, make it daily sunscreen. Up to ninety percent of visible ageing — fine lines, uneven tone, loss of firmness — is driven by UV exposure. No serum can out-perform the simple act of protecting your skin from the sun.",
          bn: "আপনি যদি ত্বকের জন্য কেবল একটি কাজই করেন, সেটি হোক প্রতিদিনের সানস্ক্রিন। দৃশ্যমান বয়সের ছাপের নব্বই শতাংশ পর্যন্ত — সূক্ষ্ম রেখা, অসম রঙ, দৃঢ়তা হারানো — UV সংস্পর্শের কারণে হয়। কোনো সিরামই ত্বককে সূর্য থেকে রক্ষা করার সহজ কাজটিকে ছাড়িয়ে যেতে পারে না।",
        },
      },
      {
        type: "image",
        src: photo("spf-outdoor", 480, 360),
        alt: {
          en: "A person applying sunscreen outdoors in soft morning light",
          bn: "নরম সকালের আলোয় বাইরে সানস্ক্রিন লাগাচ্ছেন এমন একজন",
        },
        layout: "left",
        caption: {
          en: "Reapply every two hours when you're outdoors.",
          bn: "বাইরে থাকলে প্রতি দুই ঘণ্টায় আবার লাগান।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Choose a broad-spectrum formula of at least SPF 30 — 'broad-spectrum' means it defends against both UVB rays, which burn, and UVA rays, which age and penetrate deeper. Summer's heat and humidity call for lightweight, non-greasy textures, so look for fluid or gel-cream sunscreens that sit comfortably under makeup.",
          bn: "অন্তত SPF ৩০-এর একটি ব্রড-স্পেকট্রাম ফর্মুলা বেছে নিন — 'ব্রড-স্পেকট্রাম' মানে এটি UVB রশ্মি, যা পোড়ায়, আর UVA রশ্মি, যা বয়স বাড়ায় আর গভীরে ঢোকে, দুটোর বিরুদ্ধেই রক্ষা করে। গরমের তাপ আর আর্দ্রতার জন্য হালকা, চিটচিটে-নয় এমন টেক্সচার দরকার, তাই ফ্লুইড বা জেল-ক্রিম সানস্ক্রিন খুঁজুন যা মেকআপের নিচে আরামে বসে।",
        },
      },
      {
        type: "heading",
        text: {
          en: "The amount matters more than the number",
          bn: "সংখ্যার চেয়ে পরিমাণ বেশি গুরুত্বপূর্ণ",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Most people apply only a quarter of the sunscreen they need, which quietly slashes the actual protection they get. Aim for roughly two finger-lengths of product for your face and neck, and reapply every two hours of sun exposure. A high SPF applied too thinly protects less than a modest SPF applied properly.",
          bn: "বেশিরভাগ মানুষ প্রয়োজনের মাত্র এক-চতুর্থাংশ সানস্ক্রিন লাগায়, যা নীরবে আসল সুরক্ষা অনেক কমিয়ে দেয়। মুখ আর গলার জন্য প্রায় দুই আঙুল-দৈর্ঘ্য পণ্যের লক্ষ্য রাখুন, আর রোদে থাকলে প্রতি দুই ঘণ্টায় আবার লাগান। পাতলা করে লাগানো উচ্চ SPF, ঠিকভাবে লাগানো মাঝারি SPF-এর চেয়ে কম সুরক্ষা দেয়।",
        },
      },
      {
        type: "quote",
        text: {
          en: "Sunscreen is the only anti-ageing product with decades of evidence behind it. Everything else is a supporting act.",
          bn: "সানস্ক্রিনই একমাত্র বয়স-প্রতিরোধী পণ্য যার পেছনে কয়েক দশকের প্রমাণ আছে। বাকি সবকিছু সহকারী ভূমিকায়।",
        },
        cite: {
          en: "Sana Ahmed, Licensed Esthetician",
          bn: "সানা আহমেদ, লাইসেন্সপ্রাপ্ত এসথেটিশিয়ান",
        },
      },
      {
        type: "image",
        src: photo("spf-products", 1000, 560),
        alt: {
          en: "A row of lightweight summer sunscreen and mist products on a bright surface",
          bn: "উজ্জ্বল পৃষ্ঠে হালকা গরমের সানস্ক্রিন আর মিস্ট পণ্যের একটি সারি",
        },
        layout: "full",
        caption: {
          en: "Keep a mist or stick in your bag for effortless reapplication.",
          bn: "সহজে আবার লাগানোর জন্য ব্যাগে একটি মিস্ট বা স্টিক রাখুন।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Pair your SPF with lightweight, water-based hydration and a vitamin C serum in the morning — antioxidants and sunscreen are a powerful team, neutralising the free radicals that slip past your protection. Skip heavy occlusive creams in peak heat; they can feel suffocating and encourage breakouts.",
          bn: "সকালে আপনার SPF-এর সাথে হালকা, পানিভিত্তিক আর্দ্রতা আর একটি ভিটামিন সি সিরাম জুড়ে দিন — অ্যান্টিঅক্সিডেন্ট আর সানস্ক্রিন একটি শক্তিশালী দল, যা আপনার সুরক্ষা পেরিয়ে আসা ফ্রি র‍্যাডিকেল নিষ্ক্রিয় করে। প্রচণ্ড গরমে ভারী অক্লুসিভ ক্রিম এড়িয়ে চলুন; এগুলো দমবন্ধ লাগতে পারে আর ব্রেকআউট বাড়াতে পারে।",
        },
      },
      {
        type: "productCta",
        title: {
          en: "Sun protection you'll want to wear",
          bn: "যে সূর্য-সুরক্ষা পরতে ইচ্ছে করবে",
        },
        description: {
          en: "Our featherweight daily SPF leaves no white cast and layers invisibly under everything. Shop the summer edit.",
          bn: "আমাদের পালকের মতো হালকা প্রতিদিনের SPF কোনো সাদা ছাপ রাখে না আর সবকিছুর নিচে অদৃশ্যভাবে বসে। গরমের কালেকশন দেখুন।",
        },
        href: "/shop",
        image: photo("spf-product", 400, 400),
      },
      {
        type: "paragraph",
        text: {
          en: "The best sunscreen is the one you enjoy enough to use every day. Find a texture you love, keep it by your toothbrush as a reminder, and your future self will thank you for years to come.",
          bn: "সেরা সানস্ক্রিন হলো সেটাই যা আপনি প্রতিদিন ব্যবহার করার মতো যথেষ্ট পছন্দ করেন। এমন একটি টেক্সচার খুঁজুন যা আপনার ভালো লাগে, মনে রাখার জন্য এটি টুথব্রাশের পাশে রাখুন, আর ভবিষ্যতের আপনি বছরের পর বছর আপনাকে কৃতজ্ঞতা জানাবে।",
        },
      },
    ],
  },
  {
    id: "6",
    slug: "ingredients-to-combine-and-avoid",
    title: {
      en: "Best Skincare Ingredients to Combine — and What to Avoid",
      bn: "সেরা যেসব স্কিনকেয়ার উপাদান একসাথে মেশাবেন — আর যা এড়াবেন",
    },
    excerpt: {
      en: "Some actives amplify each other; others cancel out or cause irritation. Your simple compatibility cheat-sheet for a smarter routine.",
      bn: "কিছু অ্যাক্টিভ একে অপরকে বাড়িয়ে তোলে; অন্যরা একে অপরকে বাতিল করে বা জ্বালা তৈরি করে। স্মার্ট রুটিনের জন্য আপনার সহজ সামঞ্জস্য গাইড।",
    },
    featuredImage: photo("combine-hero", 1200, 600),
    category: "ingredients-101",
    author: authors.noah,
    date: "2024-07-02",
    views: 13380,
    content: [
      {
        type: "paragraph",
        text: {
          en: "As routines grow, so does the risk of mixing actives that work against each other. Some combinations are a match made in heaven; others irritate your skin or quietly deactivate the very ingredients you paid for. A little knowledge here saves both your skin and your budget.",
          bn: "রুটিন যত বড় হয়, একে অপরের বিরুদ্ধে কাজ করে এমন অ্যাক্টিভ মেশানোর ঝুঁকিও তত বাড়ে। কিছু সংমিশ্রণ স্বর্গে তৈরি জুটি; আবার কিছু আপনার ত্বকে জ্বালা করে বা নীরবে সেই উপাদানগুলোকেই নিষ্ক্রিয় করে দেয় যেগুলোর জন্য আপনি টাকা দিয়েছেন। এখানে সামান্য জ্ঞানই আপনার ত্বক আর বাজেট দুটোই বাঁচায়।",
        },
      },
      {
        type: "image",
        src: photo("combine-chart", 480, 360),
        alt: {
          en: "A simple grid showing which skincare actives pair well together",
          bn: "কোন স্কিনকেয়ার অ্যাক্টিভগুলো একসাথে ভালো মেশে তা দেখানো একটি সহজ গ্রিড",
        },
        layout: "right",
        caption: {
          en: "Keep a compatibility chart on your bathroom mirror.",
          bn: "আপনার বাথরুমের আয়নায় একটি সামঞ্জস্য চার্ট রাখুন।",
        },
      },
      {
        type: "heading",
        text: {
          en: "Pairings that work beautifully",
          bn: "যেসব জুটি চমৎকার কাজ করে",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Vitamin C and vitamin E are a classic duo — together they neutralise more free radicals than either does alone. Hyaluronic acid pairs with almost anything, boosting hydration alongside retinol or acids. And niacinamide is the great peacemaker of skincare, calming and strengthening the barrier while playing nicely with nearly every other active.",
          bn: "ভিটামিন সি আর ভিটামিন ই একটি ক্লাসিক জুটি — একসাথে এরা যে কোনো একটির চেয়ে বেশি ফ্রি র‍্যাডিকেল নিষ্ক্রিয় করে। হায়ালুরনিক অ্যাসিড প্রায় সবকিছুর সাথেই মেশে, রেটিনল বা অ্যাসিডের পাশাপাশি আর্দ্রতা বাড়ায়। আর নিয়াসিনামাইড স্কিনকেয়ারের মহান শান্তিদূত, ব্যারিয়ার শান্ত আর মজবুত করে, একই সাথে প্রায় অন্য প্রতিটি অ্যাক্টিভের সাথে সুন্দরভাবে মেশে।",
        },
      },
      {
        type: "heading",
        text: {
          en: "Combinations to keep apart",
          bn: "যেসব সংমিশ্রণ আলাদা রাখবেন",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Retinol and strong exfoliating acids used together can overwhelm the barrier and trigger redness and peeling — alternate them on different nights instead. Layering multiple potent acids at once invites irritation. And benzoyl peroxide can oxidise a pure vitamin C serum, so keep those two to opposite ends of the day.",
          bn: "রেটিনল আর শক্তিশালী এক্সফোলিয়েটিং অ্যাসিড একসাথে ব্যবহার করলে ব্যারিয়ার বিপর্যস্ত হতে পারে আর লালচে ভাব ও খোসা ওঠা শুরু হতে পারে — বরং আলাদা রাতে পালা করে ব্যবহার করুন। একসাথে একাধিক শক্তিশালী অ্যাসিড স্তরে স্তরে দিলে জ্বালা ডেকে আনে। আর বেনজয়েল পারঅক্সাইড একটি বিশুদ্ধ ভিটামিন সি সিরামকে জারিত করতে পারে, তাই এই দুটিকে দিনের দুই প্রান্তে রাখুন।",
        },
      },
      {
        type: "quote",
        text: {
          en: "When in doubt, separate your actives by time of day. Morning for protection, evening for renewal.",
          bn: "সন্দেহ হলে, আপনার অ্যাক্টিভগুলোকে দিনের সময় অনুযায়ী আলাদা করুন। সকাল সুরক্ষার জন্য, সন্ধ্যা পুনর্গঠনের জন্য।",
        },
        cite: {
          en: "Noah Bennett, Formulation Scientist",
          bn: "নোয়াহ বেনেট, ফর্মুলেশন সায়েন্টিস্ট",
        },
      },
      {
        type: "image",
        src: photo("combine-warning", 1000, 560),
        alt: {
          en: "Two serum bottles placed apart with a subtle warning graphic between them",
          bn: "দুটি সিরাম বোতল আলাদা রাখা, মাঝে একটি মৃদু সতর্কতা গ্রাফিক",
        },
        layout: "full",
        caption: {
          en: "Alternate potent actives rather than layering them all at once.",
          bn: "সব শক্তিশালী অ্যাক্টিভ একসাথে না দিয়ে পালা করে ব্যবহার করুন।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "A reliable framework: antioxidants and SPF in the morning, gentle renewal actives at night, and hydration at every step. Introduce one new active at a time and give it two weeks before adding another, so you can tell what your skin actually loves.",
          bn: "একটি নির্ভরযোগ্য কাঠামো: সকালে অ্যান্টিঅক্সিডেন্ট আর SPF, রাতে মৃদু পুনর্গঠনকারী অ্যাক্টিভ, আর প্রতিটি ধাপে আর্দ্রতা। একবারে একটি নতুন অ্যাক্টিভ যোগ করুন আর আরেকটি যোগ করার আগে দুই সপ্তাহ সময় দিন, যাতে আপনার ত্বক আসলে কোনটি পছন্দ করে তা বুঝতে পারেন।",
        },
      },
      {
        type: "productCta",
        title: {
          en: "Actives that play well together",
          bn: "যেসব অ্যাক্টিভ একসাথে ভালো মেশে",
        },
        description: {
          en: "The Glowly serum range is designed to layer without conflict — clear guidance on every bottle. Explore the collection.",
          bn: "Glowly-র সিরাম রেঞ্জ দ্বন্দ্ব ছাড়াই স্তরে স্তরে বসার জন্য তৈরি — প্রতিটি বোতলে স্পষ্ট নির্দেশনা। কালেকশনটি ঘুরে দেখুন।",
        },
        href: "/shop",
        image: photo("combine-product", 400, 400),
      },
      {
        type: "paragraph",
        text: {
          en: "Skincare should feel calm, not like chemistry homework. Master a handful of trusted pairings, respect the ones to keep apart, and your routine becomes both simpler and more effective.",
          bn: "স্কিনকেয়ার শান্ত মনে হওয়া উচিত, রসায়নের হোমওয়ার্কের মতো নয়। কয়েকটি বিশ্বস্ত জুটি আয়ত্ত করুন, আলাদা রাখার মতোগুলোকে সম্মান করুন, আর আপনার রুটিন একই সাথে সহজ ও বেশি কার্যকর হয়ে ওঠে।",
        },
      },
    ],
  },
  {
    id: "7",
    slug: "acne-myths-vs-facts",
    title: {
      en: "Acne-Prone Skin: Myths vs Facts",
      bn: "ব্রণ-প্রবণ ত্বক: মিথ বনাম সত্য",
    },
    excerpt: {
      en: "Toothpaste on spots? Sun 'dries out' acne? Let's separate the persistent myths from what the evidence actually says.",
      bn: "ব্রণে টুথপেস্ট? রোদ ব্রণ 'শুকিয়ে দেয়'? আসুন প্রমাণ আসলে যা বলে তা থেকে চিরস্থায়ী মিথগুলোকে আলাদা করি।",
    },
    featuredImage: photo("acne-hero", 1200, 600),
    category: "wellness",
    author: authors.amara,
    date: "2024-06-28",
    views: 17240,
    content: [
      {
        type: "paragraph",
        text: {
          en: "Acne is the most common skin condition in the world, and also the most misunderstood. Well-meaning advice passed down through generations often does more harm than good. Let's clear up the myths that keep breakouts coming back.",
          bn: "ব্রণ বিশ্বের সবচেয়ে সাধারণ ত্বকের সমস্যা, আবার সবচেয়ে ভুল-বোঝা সমস্যাও। প্রজন্ম থেকে প্রজন্মে চলে আসা শুভাকাঙ্ক্ষী পরামর্শ প্রায়ই উপকারের চেয়ে বেশি ক্ষতি করে। আসুন সেই মিথগুলো পরিষ্কার করি যেগুলো ব্রণকে বারবার ফিরিয়ে আনে।",
        },
      },
      {
        type: "image",
        src: photo("acne-diagram", 480, 360),
        alt: {
          en: "An educational cross-section diagram of a clogged pore",
          bn: "একটি বন্ধ হয়ে যাওয়া লোমকূপের শিক্ষামূলক প্রস্থচ্ছেদ চিত্র",
        },
        layout: "left",
        caption: {
          en: "A breakout begins deep in the pore, not on the surface.",
          bn: "ব্রণ পৃষ্ঠে নয়, লোমকূপের গভীরে শুরু হয়।",
        },
      },
      {
        type: "heading",
        text: {
          en: "Myth: acne means your skin is dirty",
          bn: "মিথ: ব্রণ মানে আপনার ত্বক নোংরা",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Breakouts are driven by hormones, excess sebum, bacteria and clogged pores — not by poor hygiene. In fact, over-washing and aggressive scrubbing strip the barrier and trigger more oil production, making things worse. Gentle cleansing twice a day is plenty.",
          bn: "ব্রণ হরমোন, অতিরিক্ত সিবাম, ব্যাকটেরিয়া আর বন্ধ লোমকূপের কারণে হয় — খারাপ পরিচ্ছন্নতার কারণে নয়। বরং অতিরিক্ত ধোয়া আর জোরে ঘষা ব্যারিয়ার নষ্ট করে আর আরও তেল উৎপাদন ঘটায়, যা অবস্থা খারাপ করে। দিনে দুবার মৃদু ক্লিনজিংই যথেষ্ট।",
        },
      },
      {
        type: "heading",
        text: {
          en: "Myth: sun exposure clears acne",
          bn: "মিথ: রোদ ব্রণ সারায়",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "The sun may temporarily dry out spots, but it damages the barrier and drives post-inflammatory pigmentation — those stubborn dark marks left behind after a breakout heals. Sunscreen is essential for acne-prone skin, not optional.",
          bn: "রোদ সাময়িকভাবে ব্রণ শুকিয়ে দিতে পারে, কিন্তু এটি ব্যারিয়ার ক্ষতিগ্রস্ত করে আর প্রদাহ-পরবর্তী পিগমেন্টেশন বাড়ায় — ব্রণ সেরে যাওয়ার পর রয়ে যাওয়া সেই একগুঁয়ে কালো দাগ। ব্রণ-প্রবণ ত্বকের জন্য সানস্ক্রিন অপরিহার্য, ঐচ্ছিক নয়।",
        },
      },
      {
        type: "quote",
        text: {
          en: "You cannot scrub away acne. Consistency with gentle, proven actives beats aggression every single time.",
          bn: "আপনি ব্রণ ঘষে তুলে ফেলতে পারবেন না। মৃদু, প্রমাণিত অ্যাক্টিভের সাথে ধারাবাহিকতা প্রতিবারই আক্রমণাত্মকতাকে হারায়।",
        },
        cite: {
          en: "Dr. Amara Chen, Cosmetic Dermatologist",
          bn: "ডাঃ আমারা চেন, কসমেটিক ডার্মাটোলজিস্ট",
        },
      },
      {
        type: "image",
        src: photo("acne-results", 1000, 560),
        alt: {
          en: "A calm, clear complexion photographed in soft natural light",
          bn: "নরম প্রাকৃতিক আলোয় তোলা একটি শান্ত, পরিষ্কার ত্বক",
        },
        layout: "full",
        caption: {
          en: "Patience and the right actives — not harshness — clear skin.",
          bn: "ধৈর্য আর সঠিক অ্যাক্টিভ — কঠোরতা নয় — ত্বক পরিষ্কার করে।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "What actually works: salicylic acid to keep pores clear, benzoyl peroxide or a gentle retinoid to address bacteria and cell turnover, and — always — a non-comedogenic moisturizer and SPF. Give any treatment eight to twelve weeks. Acne is a marathon of consistency, not a sprint of quick fixes.",
          bn: "যা আসলে কাজ করে: লোমকূপ পরিষ্কার রাখতে স্যালিসাইলিক অ্যাসিড, ব্যাকটেরিয়া আর কোষ পুনর্গঠনের জন্য বেনজয়েল পারঅক্সাইড বা একটি মৃদু রেটিনয়েড, আর — সবসময় — একটি নন-কমেডোজেনিক ময়েশ্চারাইজার ও SPF। যেকোনো ট্রিটমেন্টকে আট থেকে বারো সপ্তাহ সময় দিন। ব্রণ দ্রুত সমাধানের দৌড় নয়, ধারাবাহিকতার ম্যারাথন।",
        },
      },
      {
        type: "productCta",
        title: {
          en: "Calm, clear, confident",
          bn: "শান্ত, পরিষ্কার, আত্মবিশ্বাসী",
        },
        description: {
          en: "Our blemish-care range targets breakouts without stripping your barrier — non-comedogenic and dermatologist-informed.",
          bn: "আমাদের ব্লেমিশ-কেয়ার রেঞ্জ ব্যারিয়ার নষ্ট না করেই ব্রণকে লক্ষ্য করে — নন-কমেডোজেনিক আর ডার্মাটোলজিস্ট-অনুমোদিত।",
        },
        href: "/shop",
        image: photo("acne-product", 400, 400),
      },
      {
        type: "paragraph",
        text: {
          en: "If breakouts are painful, scarring or persistent despite a solid routine, see a dermatologist. Modern treatments are genuinely effective, and no one should suffer through severe acne believing they simply have to live with it.",
          bn: "ভালো রুটিন সত্ত্বেও যদি ব্রণ যন্ত্রণাদায়ক, দাগ ফেলে বা একগুঁয়ে হয়, তবে একজন ডার্মাটোলজিস্টের পরামর্শ নিন। আধুনিক চিকিৎসা সত্যিই কার্যকর, আর কারো এই বিশ্বাস নিয়ে তীব্র ব্রণে ভোগা উচিত নয় যে এটি নিয়েই বাঁচতে হবে।",
        },
      },
    ],
  },
  {
    id: "8",
    slug: "anti-aging-serums-guide",
    title: {
      en: "Anti-Aging Serums: A Complete Guide to Retinol, Peptides and Vitamin C",
      bn: "অ্যান্টি-এজিং সিরাম: রেটিনল, পেপটাইড আর ভিটামিন সি-র সম্পূর্ণ গাইড",
    },
    excerpt: {
      en: "Three ingredients dominate the anti-ageing conversation for good reason. Here's what each one does and how to build them into a routine that lasts.",
      bn: "তিনটি উপাদান যথেষ্ট কারণেই অ্যান্টি-এজিং আলোচনায় আধিপত্য করে। প্রতিটি কী করে আর কীভাবে এগুলোকে দীর্ঘস্থায়ী রুটিনে সাজাবেন, তা এখানে।",
    },
    featuredImage: photo("aging-hero", 1200, 600),
    category: "product-reviews",
    author: authors.layla,
    date: "2024-06-24",
    views: 22890,
    content: [
      {
        type: "paragraph",
        text: {
          en: "If you narrow the vast anti-ageing market down to what genuinely holds up under scientific scrutiny, three ingredients rise to the top: retinol, peptides and vitamin C. Each works differently, and together they form a routine that supports firmer, brighter, more resilient skin over time.",
          bn: "বিশাল অ্যান্টি-এজিং বাজারকে যদি বৈজ্ঞানিক যাচাইয়ে সত্যিই টিকে থাকা জিনিসে সংকুচিত করেন, তিনটি উপাদান শীর্ষে ওঠে: রেটিনল, পেপটাইড আর ভিটামিন সি। প্রতিটি ভিন্নভাবে কাজ করে, আর একসাথে এরা এমন একটি রুটিন গড়ে যা সময়ের সাথে আরও দৃঢ়, উজ্জ্বল আর সহনশীল ত্বককে সহায়তা করে।",
        },
      },
      {
        type: "image",
        src: photo("aging-serums", 480, 360),
        alt: {
          en: "Three amber serum bottles labelled retinol, peptides and vitamin C",
          bn: "রেটিনল, পেপটাইড আর ভিটামিন সি লেখা তিনটি অ্যাম্বার সিরাম বোতল",
        },
        layout: "right",
        caption: {
          en: "The proven trio — used at the right time of day.",
          bn: "প্রমাণিত ত্রয়ী — দিনের সঠিক সময়ে ব্যবহৃত।",
        },
      },
      {
        type: "heading",
        text: {
          en: "Retinol: the gold standard",
          bn: "রেটিনল: সোনার মানদণ্ড",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Retinol, a form of vitamin A, speeds up cell turnover and stimulates collagen — the protein that keeps skin firm. It has decades of research behind it for softening fine lines and refining texture. Start low and slow: a pea-sized amount two nights a week, building up as your skin adapts, always at night and always followed by SPF in the morning.",
          bn: "রেটিনল, ভিটামিন এ-র একটি রূপ, কোষ পুনর্গঠন দ্রুত করে আর কোলাজেন উদ্দীপিত করে — সেই প্রোটিন যা ত্বককে দৃঢ় রাখে। সূক্ষ্ম রেখা নরম করা আর টেক্সচার উন্নত করার জন্য এর পেছনে কয়েক দশকের গবেষণা আছে। কম মাত্রায় আর ধীরে শুরু করুন: সপ্তাহে দুই রাত মটরদানার সমান পরিমাণ, ত্বক মানিয়ে নেওয়ার সাথে বাড়াতে থাকুন, সবসময় রাতে আর সবসময় সকালে SPF দিয়ে।",
        },
      },
      {
        type: "heading",
        text: {
          en: "Peptides and vitamin C",
          bn: "পেপটাইড আর ভিটামিন সি",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "Peptides are short chains of amino acids that signal your skin to produce more collagen — gentle enough for daily use and a wonderful partner to retinol. Vitamin C, meanwhile, is a morning antioxidant that brightens tone, fades dark spots and shields against the daily assault of pollution and UV.",
          bn: "পেপটাইড হলো অ্যামিনো অ্যাসিডের ছোট শৃঙ্খল যা আপনার ত্বককে আরও কোলাজেন তৈরির সংকেত দেয় — প্রতিদিন ব্যবহারের জন্য যথেষ্ট মৃদু আর রেটিনলের চমৎকার সঙ্গী। অন্যদিকে ভিটামিন সি একটি সকালের অ্যান্টিঅক্সিডেন্ট যা রঙ উজ্জ্বল করে, কালো দাগ হালকা করে আর দূষণ ও UV-র প্রতিদিনের আক্রমণ থেকে রক্ষা করে।",
        },
      },
      {
        type: "quote",
        text: {
          en: "You don't need ten anti-ageing products. You need three proven ones, used consistently, for a very long time.",
          bn: "আপনার দশটি অ্যান্টি-এজিং পণ্য দরকার নেই। দরকার তিনটি প্রমাণিত পণ্য, ধারাবাহিকভাবে, অনেক দীর্ঘ সময় ধরে ব্যবহৃত।",
        },
        cite: {
          en: "Layla Rahman, Skincare Editor",
          bn: "লায়লা রহমান, স্কিনকেয়ার এডিটর",
        },
      },
      {
        type: "image",
        src: photo("aging-timeline", 1000, 560),
        alt: {
          en: "An illustrated timeline showing gradual skin improvement over twelve weeks",
          bn: "বারো সপ্তাহে ত্বকের ক্রমশ উন্নতি দেখানো একটি চিত্রিত টাইমলাইন",
        },
        layout: "full",
        caption: {
          en: "Results build over months, not days — consistency is everything.",
          bn: "ফলাফল দিনে নয়, মাসে গড়ে ওঠে — ধারাবাহিকতাই সবকিছু।",
        },
      },
      {
        type: "paragraph",
        text: {
          en: "A simple, sustainable structure: vitamin C and SPF in the morning to protect, retinol at night to renew, and peptides layered in whenever your skin needs extra support. Hydration and sunscreen tie the whole routine together and let each active perform at its best.",
          bn: "একটি সহজ, টেকসই কাঠামো: রক্ষার জন্য সকালে ভিটামিন সি আর SPF, পুনর্গঠনের জন্য রাতে রেটিনল, আর যখন ত্বকের বাড়তি সহায়তা দরকার তখন পেপটাইড যোগ করুন। আর্দ্রতা আর সানস্ক্রিন পুরো রুটিনকে বেঁধে রাখে আর প্রতিটি অ্যাক্টিভকে সেরাভাবে কাজ করতে দেয়।",
        },
      },
      {
        type: "productCta",
        title: {
          en: "Age well, glow always",
          bn: "সুন্দরভাবে বয়স বাড়ুক, গ্লো থাকুক সবসময়",
        },
        description: {
          en: "Discover the Glowly anti-ageing edit — retinol, peptide and vitamin C serums formulated to work in harmony.",
          bn: "Glowly-র অ্যান্টি-এজিং কালেকশন আবিষ্কার করুন — রেটিনল, পেপটাইড আর ভিটামিন সি সিরাম, একসাথে সুরেলাভাবে কাজ করার জন্য তৈরি।",
        },
        href: "/shop",
        image: photo("aging-product", 400, 400),
      },
      {
        type: "paragraph",
        text: {
          en: "The real secret to ageing skin gracefully isn't a single hero product — it's consistency, patience and protection over years. Start where you are, keep it simple, and let time and good habits do the quiet, remarkable work.",
          bn: "সুন্দরভাবে বয়স বাড়ার আসল রহস্য কোনো একক নায়ক পণ্য নয় — এটি বছরের পর বছর ধরে ধারাবাহিকতা, ধৈর্য আর সুরক্ষা। যেখানে আছেন সেখান থেকেই শুরু করুন, সহজ রাখুন, আর সময় ও ভালো অভ্যাসকে সেই নীরব, অসাধারণ কাজটি করতে দিন।",
        },
      },
    ],
  },
];

/* ------------------------------ Selectors ------------------------------- */

export function getAllPosts(): RawBlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getFeaturedPost(): RawBlogPost {
  // Most-viewed post headlines the hero.
  return [...BLOG_POSTS].sort((a, b) => b.views - a.views)[0];
}

export function getPostBySlug(slug: string): RawBlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPopularPosts(limit = 4): RawBlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function getRelatedPosts(post: RawBlogPost, limit = 3): RawBlogPost[] {
  const sameCategory = BLOG_POSTS.filter(
    (p) => p.id !== post.id && p.category === post.category,
  );
  const others = BLOG_POSTS.filter(
    (p) => p.id !== post.id && p.category !== post.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
