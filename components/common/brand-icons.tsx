import { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

/**
 * Brand marks lucide does not ship.
 *
 * lucide-react dropped third-party logos, so the footer was substituting
 * unrelated glyphs (`Music2` stands in for TikTok). These are declared as
 * `LucideIcon` — a forwardRef component taking `size`/`className`/`color` —
 * so they drop straight into the same `icon?: LucideIcon` slots the lucide
 * imports already fill, with no special-casing at the call site.
 */
export const Pinterest: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  function Pinterest({ size = 24, className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path d="M12 2a10 10 0 0 0-3.65 19.31c-.09-.78-.17-1.98.03-2.83.19-.78 1.2-4.98 1.2-4.98s-.3-.61-.3-1.52c0-1.42.82-2.48 1.85-2.48.87 0 1.29.66 1.29 1.44 0 .88-.56 2.19-.85 3.41-.24 1.02.51 1.85 1.52 1.85 1.83 0 3.23-1.93 3.23-4.71 0-2.46-1.77-4.18-4.3-4.18-2.93 0-4.65 2.2-4.65 4.47 0 .88.34 1.83.77 2.35a.31.31 0 0 1 .07.3c-.08.33-.26 1.02-.29 1.16-.05.19-.15.23-.35.14-1.3-.61-2.11-2.51-2.11-4.04 0-3.29 2.39-6.31 6.89-6.31 3.62 0 6.43 2.58 6.43 6.02 0 3.59-2.27 6.49-5.41 6.49-1.06 0-2.05-.55-2.39-1.2l-.65 2.48c-.23.9-.87 2.03-1.3 2.72A10 10 0 1 0 12 2Z" />
      </svg>
    );
  },
) as LucideIcon;
