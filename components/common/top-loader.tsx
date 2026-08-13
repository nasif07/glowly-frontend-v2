"use client";

import NextTopLoader from "nextjs-toploader";

/**
 * YouTube-style progress bar shown at the very top of the viewport on every
 * route change. Styled with the glowly palette (brown #9d7e57 -> beige
 * #d4c2a5) instead of the default red so it reads as part of the brand.
 *
 * The gradient + glow live in `shadow`, which nextjs-toploader injects onto
 * the bar element; `color` still has to be set because it paints the bar's own
 * background underneath the gradient.
 */
export function TopLoader() {
  return (
    <NextTopLoader
      color="linear-gradient(90deg, #9d7e57 0%, #d4c2a5 50%, #9d7e57 100%)"
      initialPosition={0.12}
      crawlSpeed={200}
      height={3}
      crawl
      showSpinner={false}
      easing="cubic-bezier(0.16, 1, 0.3, 1)"
      speed={400}
      shadow="0 0 10px rgba(157, 126, 87, 0.7), 0 0 5px rgba(212, 194, 165, 0.5)"
      zIndex={9999}
    />
  );
}
