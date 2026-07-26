import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

// Original: /dashboard was wrapped in RoleBasedRoute allowedRoles={["admin"]}
// and rendered inside DashboardLayout (persistent sidebar).
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
