"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { CONTACT } from "@/lib/site";

/**
 * Floating "get in touch" button for the storefront.
 *
 * Collapsed it is a single round button in the bottom-right; tapping it opens a
 * small panel with the two channels Glowly actually answers on. Mounted from
 * the (site) layout, so it never appears over the dashboard or the auth drawer.
 *
 * lucide dropped its brand glyphs, so the WhatsApp and Messenger marks are
 * inlined below rather than pulling in an icon package.
 */

const channels = [
  {
    label: "WhatsApp",
    hint: "Chat with us",
    href: CONTACT.whatsapp,
    // WhatsApp brand green — recognisable at this size in a way a tinted
    // brand-palette chip would not be.
    className: "bg-[#25D366]",
    Icon: WhatsAppIcon,
  },
  {
    label: "Messenger",
    hint: "Message on Facebook",
    href: CONTACT.messenger,
    className: "bg-linear-to-br from-[#00B2FF] to-[#006AFF]",
    Icon: MessengerIcon,
  },
] as const;

export function ContactFab() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on Escape and on a click outside, the way a menu is expected to
  // behave — without these the panel sticks around over the page content.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      // Sits above the mobile bottom nav (fixed bottom-4, h-16) until lg, where
      // that nav is hidden. z-40 keeps it under the nav and the auth drawer.
      className="font-montserrat fixed right-4 bottom-24 z-40 flex flex-col items-end gap-3 lg:right-6 lg:bottom-6"
    >
      {open && (
        <div
          id="contact-fab-panel"
          className="animate-in fade-in slide-in-from-bottom-2 w-60 overflow-hidden rounded-2xl border border-[#D9C5B2]/50 bg-[#FAF9F6]/95 shadow-[0_20px_50px_-12px_rgba(48,3,50,0.35)] backdrop-blur-xl duration-200"
        >
          <p className="border-b border-[#D9C5B2]/40 px-4 py-3 text-[11px] font-bold tracking-[0.15em] text-[#300332]/50 uppercase">
            Get in touch
          </p>

          <ul className="p-2">
            {channels.map(({ label, hint, href, className, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#300332]/5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${className}`}
                  >
                    <Icon />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-bold text-[#300332]">
                      {label}
                    </span>
                    <span className="text-[11px] text-[#300332]/50">
                      {hint}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="contact-fab-panel"
        aria-label={open ? "Close contact options" : "Contact us"}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-[#F49AC2]/20 bg-linear-to-br from-[#360718] via-[#8E1454] to-[#360718] text-white shadow-[0_15px_40px_-12px_rgba(142,20,84,0.7)] transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}

/* Brand marks (Simple Icons paths), sized to the 36px chips above. */

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[18px] w-[18px] fill-current"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.885 3.4" />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[19px] w-[19px] fill-current"
    >
      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.086-2.242c1.09.301 2.246.464 3.445.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.13 3.259L19.752 8.1l-6.561 6.863z" />
    </svg>
  );
}
