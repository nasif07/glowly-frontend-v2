import { BrandForm } from "@/components/forms";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BrandForm id={id} />;
}
