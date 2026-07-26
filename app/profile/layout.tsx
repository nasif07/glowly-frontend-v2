import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";

// Original: /profile was wrapped in RoleBasedRoute allowedRoles={["user"]}.
export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["user"]}>{children}</RoleGuard>;
}
