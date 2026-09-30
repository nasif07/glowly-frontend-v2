type Fbq = (...args: unknown[]) => void;

const getFbq = (): Fbq | undefined => {
  if (typeof window === "undefined") return undefined;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof fbq === "function" ? fbq : undefined;
};

/**
 * Fires a browser Meta Pixel event. Pass the same `eventId` the Conversions
 * API call uses (see lib/track-event.ts) so Meta counts the pair once.
 * A no-op when the pixel hasn't loaded (ad blockers, SSR).
 */
export function fbqTrack(
  eventName: string,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  const fbq = getFbq();
  if (!fbq) return;
  // Drop unset keys so the Pixel doesn't report empty parameters.
  params = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
  if (eventId) fbq("track", eventName, params, { eventID: eventId });
  else fbq("track", eventName, params);
}

/** Reads the Pixel's first-party `_fbp` / `_fbc` cookies for the CAPI relay. */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const read = (name: string) =>
    document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1) || undefined;

  let fbc = read("_fbc");
  // The Pixel only writes _fbc a moment after landing from an ad; build it from
  // the fbclid so the very first event after the click still attributes.
  if (!fbc) {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp: read("_fbp"), fbc };
}

/** Shared browser/server event id used for de-duplication. */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
