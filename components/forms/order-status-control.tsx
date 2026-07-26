"use client";

import { toast } from "sonner";

import {
  orderStatusSchema,
  type UpdateOrderStatusInput,
} from "@/lib/schemas";
import { useUpdateOrderStatus } from "@/hooks/use-orders";
import { getErrorMessage } from "@/lib/api-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = orderStatusSchema.options;

/**
 * Inline order-status updater (ported from OrderDetails). Changing the select
 * fires PATCH /orders/:id/status via the matching mutation with toasts.
 */
export function OrderStatusControl({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: UpdateOrderStatusInput["orderStatus"];
}) {
  const updateStatus = useUpdateOrderStatus(id);

  const handleChange = (value: string) => {
    const parsed = orderStatusSchema.safeParse(value);
    if (!parsed.success) return;
    updateStatus.mutate(
      { orderStatus: parsed.data },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: (error) =>
          toast.error(getErrorMessage(error, "Failed to update status")),
      },
    );
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={updateStatus.isPending}
    >
      <SelectTrigger className="w-full capitalize">
        <SelectValue placeholder="Update status" />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status} className="capitalize">
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
