import { cn } from "@/lib/utils";

/**
 * A shade's colour as a small filled circle. `print-color-adjust: exact` so
 * the colour survives printing — browsers drop backgrounds by default, which
 * would print every shade as an empty ring on the invoice.
 */
export function ShadeDot({
  hex,
  className,
}: {
  hex?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-3 w-3 shrink-0 rounded-full border border-black/10 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]",
        className,
      )}
      style={{ backgroundColor: hex || "transparent" }}
    />
  );
}

/** "● Ruby 03" — the dot plus the shade name, with an optional SKU. */
export function ShadeTag({
  name,
  hex,
  sku,
  className,
}: {
  name?: string;
  hex?: string;
  sku?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5", className)}>
      <ShadeDot hex={hex} />
      <span className="truncate">Shade: {name}</span>
      {sku && <span className="shrink-0 font-mono opacity-60">· {sku}</span>}
    </span>
  );
}
