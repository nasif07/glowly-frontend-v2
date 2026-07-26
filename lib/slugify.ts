/**
 * Lowercase, hyphenate, and trim a string into a URL slug — matches the
 * auto-slug logic used across the glowly-frontend admin forms.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
