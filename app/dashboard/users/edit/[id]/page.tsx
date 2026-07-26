import { EditUserForm } from "@/components/forms";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditUserForm id={id} />;
}
