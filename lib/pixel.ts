type Fbq = (...args: unknown[]) => void;

/**
 * Fires a Meta Pixel "Search" event when the pixel is present on the page.
 * Mirrors glowly-frontend's trackSearch side effect without the CAPI backend.
 */
export const trackSearch = (searchQuery: string) => {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") {
    fbq("track", "Search", { search_string: searchQuery });
  }
};
