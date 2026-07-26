import { ProductForm } from "@/components/forms";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductForm id={id} />;
}
