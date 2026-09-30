import { cn } from "@/lib/utils";
import type { ConsultationStatus } from "@/types";

export const CONSULTATION_STATUS_LABEL: Record<ConsultationStatus, string> = {
  new: "New",
  in_review: "In review",
  contacted: "Contacted",
  closed: "Closed",
};

const tone: Record<ConsultationStatus, string> = {
  new: "border-sky-200 bg-sky-50 text-sky-700",
  in_review: "border-amber-200 bg-amber-50 text-amber-700",
  contacted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  closed: "border-gray-200 bg-gray-50 text-gray-500",
};

export function ConsultationStatusBadge({
  status,
  className,
}: {
  status: ConsultationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
        tone[status],
        className,
      )}
    >
      {CONSULTATION_STATUS_LABEL[status]}
    </span>
  );
}
