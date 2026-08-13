import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Music2, // Used for TikTok
  Share2,
  ArrowUpRight,
  Info,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import glowlyLogo from "@/public/glowly.png";

interface FooterLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface FooterSection {
  title: string;
  icon: LucideIcon;
  links: FooterLink[];
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections: FooterSection[] = [
    {
      title: "Footer",
      icon: Info,
      links: [
        { label: "About us", href: "/about" },
        { label: "Our Transparency", href: "/transparency" },
        { label: "Terms & Condition", href: "/terms-condition" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Contact Us", href: "/contact" },
        { label: "Blogs", href: "/blog" },
      ],
    },
    {
      title: "Customer Support",
      icon: LifeBuoy,
      links: [
        { label: "Track Your Order", href: "/track-order" },
        { label: "Shipping & Delivery Policy", href: "/shipping-delivery-policy" },
        { label: "Return & Exchange Policy", href: "/return-exchange-policy" },
        { label: "Authenticity Verification", href: "/authenticity-verification" },
        {
          label: "WhatsApp",
          href: "https://wa.me/+8801575808878?text=Hello! I have a question about Glowly products.",
        },
      ],
    },
    {
      title: "Join the Glowly Circle",
      icon: Share2,
      links: [
        {
          label: "Facebook",
          href: "https://www.facebook.com/glowlybd",
          icon: Facebook,
        },
        {
          label: "Instagram",
          href: "https://instagram.com/glowly",
          icon: Instagram,
        },
        { label: "Tiktok", href: "https://tiktok.com/@glowly", icon: Music2 },
        {
          label: "Youtube",
          href: "https://youtube.com/@glowly",
          icon: Youtube,
        },
        { label: "Pinterest", href: "https://pinterest.com/glowly" },
      ],
    },
  ];

  return (
    <footer className="bg-linear-to-br from-[#360718] via-[#8E1454] to-[#360718] text-[#D9C5B2] w-full overflow-hidden">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-24 pb-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12 border-b border-[#D9C5B2]/10 pb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <Image
              src={glowlyLogo}
              alt="Glowly Logo"
              className="h-12 md:h-16 object-contain mb-4 w-auto"
            />
            <p className="text-lg  opacity-70 mb-8 leading-relaxed">
              Experience the glow with our curated botanical skincare rituals
              designed for your unique skin needs.
            </p>
          </div>

          {/* Dynamic Links Grid */}
          {/* Changed to 4 columns on desktop to fit everything properly */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12 w-full lg:w-auto">
            {sections.map((section, index) => {
              const SectionIcon = section.icon;
              return (
                <div key={index} className="flex flex-col gap-4">
                  <p className="flex items-center gap-2 text-[10px] md:text-[12px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    <SectionIcon size={14} />
                    {section.title}
                  </p>

                  <div className="flex flex-col gap-3">
                    {section.links.map((link, i) => {
                      const LinkIcon = link.icon;
                      const isExternal = link.href.startsWith("http");
                      // Restored your text-lg font size preference
                      const className =
                        "flex items-center gap-2 md:text-lg font-medium hover:text-white transition group w-fit";
                      const content = (
                        <>
                          {LinkIcon && (
                            <LinkIcon size={14} className="opacity-60" />
                          )}
                          {link.label}
                          <ArrowUpRight
                            size={12}
                            className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                          />
                        </>
                      );
                      return isExternal ? (
                        <a key={i} href={link.href} className={className}>
                          {content}
                        </a>
                      ) : (
                        <Link key={i} href={link.href} className={className}>
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Huge Background Text */}
        <div className="relative mt-12">
          <h1 className="text-[14vw] font-serif text-white/[0.03] leading-none pointer-events-none select-none text-center -mb-6">
            GLOWLY
          </h1>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-linear-to-r from-[#240512] via-[#5C0F3A] to-[#240512] py-8 px-6 pb-30 md:pb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[12px] uppercase tracking-widest opacity-40">
              © {currentYear} Glowly. All Rights Reserved.
            </p>

            {/* Added Softaura Credit */}
            <div className="h-[1px] w-4 bg-white/10 hidden md:block" />
            <a
              href="https://softaura.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-white transition-all">
              Design & Developed by{" "}
              <span className="font-bold text-white">Softaura</span>
            </a>
          </div>

          <div className="flex items-center gap-4 px-4 py-2 bg-white/[0.03] rounded-full border border-white/5">
            <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">
              Payments
            </span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span className="text-[12px] font-black text-[#D9C5B2]">
              bKash / COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
