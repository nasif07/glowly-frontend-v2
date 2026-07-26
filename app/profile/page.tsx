import type { Metadata } from "next";
import { ProfileForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "My Profile | Glowly",
  description: "Manage your Glowly account details.",
};

export default function ProfilePage() {
  return <ProfileForm />;
}
