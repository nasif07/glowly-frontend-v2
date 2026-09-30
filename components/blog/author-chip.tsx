import { authorInitials } from "@/lib/blog";
import { cn } from "@/lib/utils";

/**
 * Author monogram.
 *
 * The API stores only a name, so there is no avatar to load — initials on the
 * brand colour read better than a broken image or a stock face, and they stay
 * stable for the same author across the site.
 */
export function AuthorAvatar({
  name,
  size = 36,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[#300332] font-bold text-[#D9C5B2]",
        className,
      )}
    >
      {authorInitials(name)}
    </span>
  );
}
