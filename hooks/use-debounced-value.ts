"use client";

import { useEffect, useState } from "react";

/**
 * Delays a fast-changing value (a search box, a slider) so effects and queries
 * downstream only see it once the user pauses.
 */
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
