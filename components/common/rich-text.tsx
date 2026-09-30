import { cn } from "@/lib/utils";
import { isRichTextEmpty, sanitizeRichText } from "@/lib/rich-text";

/**
 * Renders admin-authored rich text (blog bodies, product copy).
 *
 * The HTML is sanitised here rather than at the point of storage, so content
 * written before the editor existed — or edited straight through the API — is
 * still cleaned before it reaches the DOM. There is no "use client" directive:
 * a server page sanitises during SSR, and a client page pulls in DOMPurify's
 * browser build, so both sides get the same allow-list either way.
 *
 * Styling lives in `.rich-text` (app/globals.css) so the editor surface and
 * the published page render identically.
 */
export function RichText({
  html,
  className,
}: {
  html?: string | null;
  className?: string;
}) {
  if (isRichTextEmpty(html)) return null;

  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html!) }}
    />
  );
}
