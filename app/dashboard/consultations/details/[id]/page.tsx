import { ConsultationDetail } from "@/components/dashboard/consultation-detail";

export default async function ConsultationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConsultationDetail id={id} />;
}
