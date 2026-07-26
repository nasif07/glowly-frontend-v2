"use client";

import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Wraps the app so `useGoogleLogin` works on /login and /register. If the
 * client ID isn't configured (e.g. a fork without Google OAuth set up),
 * render children unwrapped instead of crashing the whole app.
 */
export function AppGoogleOAuthProvider({ children }: { children: ReactNode }) {
  if (!clientId) return <>{children}</>;

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
