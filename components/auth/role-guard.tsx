"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, isTokenExpired } from "@/hooks/use-auth";
import type { Role } from "@/types";

/**
 * Client-side route guard — the Next equivalent of the original SPA's
 * `RoleBasedRoute`:
 *   1. no user  → redirect to /login (preserving the intended path as `?from`)
 *   2. wrong role → redirect to /
 *   3. otherwise → render children
 *
 * Because the token lives in localStorage (not a cookie), the check must run on
 * the client. We gate on a `mounted` flag so the Zustand store has hydrated
 * from localStorage before deciding — otherwise a logged-in user would be
 * bounced on the first paint.
 */
export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const expired = isTokenExpired(token);
  const isAuthed = !!user && !expired;
  const hasAccess = isAuthed && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthed) {
      // An expired token means a stale session — clear it (as AuthContext did).
      if (user && expired) logout();
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!hasAccess) {
      router.replace("/");
    }
  }, [mounted, isAuthed, hasAccess, user, expired, logout, router, pathname]);

  // Until hydrated or while a redirect is pending, render nothing (avoids both
  // a hydration mismatch and a flash of protected content).
  if (!mounted || !hasAccess) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#300332]" />
      </div>
    );
  }

  return <>{children}</>;
}
