import type { Metadata } from "next";
import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

// Admin-only area: never indexed, regardless of what individual dashboard
// pages set (or don't set) for their own metadata.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Original: /dashboard was wrapped in RoleBasedRoute allowedRoles={["admin"]}
// and rendered inside DashboardLayout (persistent sidebar).
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
