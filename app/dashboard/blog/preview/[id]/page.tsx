import { BlogPreview } from "@/components/dashboard/blog-preview";

export default async function BlogPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BlogPreview id={id} />;
}
