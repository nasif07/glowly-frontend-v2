import type {
  SteadfastDeliveryStatus,
  SteadfastReturnRequestStatus,
} from "@/types";

const DELIVERY_STATUS_STYLES: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  partial_delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  hold: "bg-amber-100 text-amber-700 border-amber-200",
  in_review: "bg-sky-100 text-sky-700 border-sky-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  unknown: "bg-stone-100 text-stone-600 border-stone-200",
};

const RETURN_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-sky-100 text-sky-700 border-sky-200",
  processing: "bg-sky-100 text-sky-700 border-sky-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

function StatusPill({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${className}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}

export function DeliveryStatusBadge({
  status,
}: {
  status: SteadfastDeliveryStatus | string;
}) {
  const style =
    DELIVERY_STATUS_STYLES[status] ||
    "bg-stone-100 text-stone-600 border-stone-200";
  return <StatusPill label={status} className={style} />;
}

export function ReturnStatusBadge({
  status,
}: {
  status: SteadfastReturnRequestStatus | string;
}) {
  const style =
    RETURN_STATUS_STYLES[status] ||
    "bg-stone-100 text-stone-600 border-stone-200";
  return <StatusPill label={status} className={style} />;
}
