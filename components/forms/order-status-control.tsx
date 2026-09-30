"use client";

import { toast } from "sonner";

import { orderStatusSchema, type UpdateOrderStatusInput } from "@/lib/schemas";
import { useUpdateOrderStatus } from "@/hooks/use-orders";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/types";

const STATUSES = orderStatusSchema.options;

/** Glowly colours per order status: the pill fill/text and its dot. */
export const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { pill: string; dot: string }
> = {
  pending: {
    pill: "border-[#F1DDB6] bg-[#FDF6E7] text-[#9A6612]",
    dot: "bg-[#C4891E]",
  },
  processing: {
    pill: "border-[#F2D3E1] bg-[#FBE9F1] text-[#8E1454]",
    dot: "bg-[#8E1454]",
  },
  shipped: {
    pill: "border-[#DCCDEB] bg-[#F3EDF9] text-[#5B2A86]",
    dot: "bg-[#5B2A86]",
  },
  delivered: {
    pill: "border-[#CDE8DC] bg-[#ECF7F1] text-[#1F7A5C]",
    dot: "bg-[#1F9D6E]",
  },
  cancelled: {
    pill: "border-[#F2D0D0] bg-[#FCEEEE] text-[#B42323]",
    dot: "bg-[#D64545]",
  },
};

/**
 * Inline order-status updater (ported from OrderDetails). Changing the select
 * fires PATCH /orders/:id/status via the matching mutation with toasts. The
 * trigger is tinted with the current status's colour.
 */
export function OrderStatusControl({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: UpdateOrderStatusInput["orderStatus"];
}) {
  const updateStatus = useUpdateOrderStatus(id);
  const style = ORDER_STATUS_STYLES[currentStatus];

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
      <SelectTrigger
        className={cn(
          "w-full rounded-full font-semibold capitalize shadow-none",
          style?.pill,
        )}
      >
        <SelectValue placeholder="Update status" />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status} className="capitalize">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                ORDER_STATUS_STYLES[status].dot,
              )}
            />
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
