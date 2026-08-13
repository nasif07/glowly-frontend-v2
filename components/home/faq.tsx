"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { GlowButton } from "@/components/forms/glow-button";

const faqs = [
  {
    question: "How do I know if my skincare is authentic?",
    answer:
      "At Glowly, we guarantee 100% originality. Every product from The Ordinary, CosRx, and CeraVe is sourced from authorized distributors. You can verify authenticity by checking the batch code on the bottle against official brand websites.",
  },
  {
    question: "What is the correct order to apply my skincare?",
    answer:
      "Follow the thinnest-to-thickest rule in your routine. Cleanse with a gentle wash like Simple, prep with an essence such as COSRX Snail Mucin, treat with a serum like The Ordinary Niacinamide, and moisturize with CeraVe Moisturizing Cream. In the morning, always finish with SPF for protection.",
  },
  {
    question: "Is CosRx Snail Mucin good for acne-prone skin?",
    answer:
      "Yes! It’s very lightweight and won't block your pores. It’s specially made to soothe redness and help heal acne scars, making it perfect for sensitive skin.",
  },
  {
    question: "Can I mix products from The Ordinary and CeraVe?",
    answer:
      "Definitely. They work perfectly together. Use The Ordinary for targeted treatments like Vitamin C or Retinol and follow up with CeraVe moisturizers, which contain essential ceramides to protect and hydrate your skin.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "Results take time. While The Ordinary Hyaluronic Acid hydrates instantly, clearing acne or improving skin texture usually takes 4–6 weeks of daily use to see a real change.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    /* Section Background: Oatmeal (#D9C5B2) at a low opacity for a soft feel */
    <section className="bg-[#D9C5B2]/20 py-8 md:py-24 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <span className="text-[#300332] text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
            Support Concierge
          </span>
          <h2 className="text-[#300332] text-3xl md:text-5xl mb-4">
            Common <span>Inquiries</span>
          </h2>
          <div className="w-12 h-[1px] bg-[#300332]/20 mx-auto"></div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`transition-all duration-500 rounded-lg ${
                openIndex === index
                  ? "bg-white shadow-[#300332]/5"
                  : "bg-white/50 hover:bg-white"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                className="w-full px-4 md:px-8 py-3 md:py-6 flex items-center justify-between text-left group"
              >
                <span
                  className={`text-md md:text-lg font-bold tracking-wide transition-colors ${
                    openIndex === index ? "text-[#300332]" : "text-[#300332]/70"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`p-1 rounded-full transition-all duration-300 ${openIndex === index ? "bg-[#300332] text-white rotate-180" : "text-[#300332]/40"}`}
                >
                  <ChevronDown size={18} strokeWidth={1.5} />
                </div>
              </button>

              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-60 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 md:px-8 pb-8 text-[#300332]/60 text-sm font-bold leading-relaxed">
                  <div className="pt-2 border-t border-[#300332]/5">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA: Modernized to be more subtle */}
        <div className="mt-10 md:mt-20 flex flex-col md:flex-row items-center justify-between p-8 bg-linear-to-br from-[#360718] via-[#8E1454] to-[#360718] rounded-2xl text-white overflow-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9C5B2]/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

          <div className="text-center md:text-left mb-6 md:mb-0 relative z-10">
            <h3 className="text-xl mb-1">Still seeking clarity?</h3>
            <p className="text-xs text-[#D9C5B2] opacity-70 uppercase tracking-widest">
              Our skin experts are available 24/7
            </p>
          </div>

          <GlowButton
            href="https://wa.me/+8801575808878?text=Hello! I have a question about Glowly products."
            target="_blank"
            variant="secondary"
            className="z-10"
          >
            <MessageCircle size={18} />
            Chat With Us
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
