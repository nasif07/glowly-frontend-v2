import { CategoryForm } from "@/components/forms";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryForm id={id} />;
}
