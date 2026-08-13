"use client";

/**
 * Historical import path for the Glowly button. The implementation now lives in
 * `@/components/forms/glow-button` so there is a single source of truth for the
 * gradient/shine treatment — this re-export keeps existing call sites working.
 *
 * Prefer importing `GlowButton` directly in new code.
 */
export { GlowButton, GlowButton as default } from "@/components/forms/glow-button";
