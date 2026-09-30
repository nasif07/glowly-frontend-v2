import DOMPurify from "isomorphic-dompurify";

/**
 * Everything the editor in `components/forms/rich-text-editor.tsx` can produce,
 * and nothing else. The allow-list is the security boundary: post bodies and
 * product copy are admin-authored, but they still arrive as raw HTML from the
 * API, so they get sanitised on the way to `dangerouslySetInnerHTML` rather
 * than trusted because of who wrote them.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "a",
  "hr",
  "img",
  "figure",
  "figcaption",
];

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  // Images interleaved with the copy — see the editor's insert-image button.
  "src",
  "alt",
  "title",
  "width",
  "height",
];

/** Strip everything outside the allow-list. Safe to call on the server. */
export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Block javascript:/data: hrefs — DOMPurify keeps only these protocols.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
    // ...but DOMPurify applies that regexp to every allowed attribute, not
    // just the URI-bearing ones, so `target="_blank"` and `rel="noopener"`
    // would fail it and be stripped. Exempt them explicitly.
    // `src` is deliberately absent — it must stay URI-checked. The rest are
    // plain values that the regexp above would otherwise reject and strip.
    ADD_URI_SAFE_ATTR: ["target", "rel", "width", "height"],
  });
}

/**
 * Whether a value has any visible content. TipTap serialises an empty document
 * as `<p></p>`, which is truthy but renders as nothing — a plain `!!html`
 * check would show empty headings and "read more" toggles for blank fields.
 */
export function isRichTextEmpty(html?: string | null): boolean {
  if (!html) return true;
  return !html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

/**
 * Flatten rich text to a single line of plain text — for meta descriptions,
 * list previews and anywhere else markup would leak into a plain-text slot.
 */
export function richTextToPlain(html?: string | null): string {
  if (!html) return "";
  return sanitizeRichText(html)
    .replace(/<(?:br|\/p|\/h[2-4]|\/li|\/blockquote)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
