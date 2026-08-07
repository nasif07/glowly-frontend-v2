import type { Metadata } from "next";
import { ProfileForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Glowly account details.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileForm />;
}
