/**
 * A wa.me link that opens a chat with a Bangladeshi mobile number. wa.me
 * wants the full international number as digits only — no "+", spaces or the
 * local leading 0 — so "01812-345678" becomes "8801812345678".
 *
 * Returns null for anything that isn't a BD mobile.
 */
export function whatsAppLink(phone: string, message?: string): string | null {
  const digits = String(phone).replace(/\D/g, "").replace(/^(?:88)?(?=01\d{9}$)/, "");
  if (!/^01\d{9}$/.test(digits)) return null;

  const url = `https://wa.me/88${digits}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}
