import { cn } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD, stockLevel } from "@/lib/stock";

/**
 * Admin stock marker: red "Out" at 0, amber "Low" at or under
 * LOW_STOCK_THRESHOLD, nothing (or a quiet count) otherwise.
 */
export function StockBadge({
  units,
  showCount = false,
  className,
}: {
  units: number;
  /** Also show the count when stock is fine. */
  showCount?: boolean;
  className?: string;
}) {
  const level = stockLevel(units);
  if (level === "ok" && !showCount) return null;

  return (
    <span
      title={
        level === "out"
          ? "Out of stock"
          : level === "low"
            ? `Low stock (${LOW_STOCK_THRESHOLD} or fewer)`
            : undefined
      }
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap",
        level === "out" && "bg-red-50 text-red-600",
        level === "low" && "bg-amber-50 text-amber-700",
        level === "ok" && "bg-emerald-50 text-emerald-700",
        className,
      )}
    >
      {level === "out" ? "Out" : level === "low" ? `Low · ${units}` : units}
    </span>
  );
}
