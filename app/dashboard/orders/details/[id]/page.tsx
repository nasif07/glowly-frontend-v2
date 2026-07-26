import { OrderDetail } from "@/components/dashboard/order-detail";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
