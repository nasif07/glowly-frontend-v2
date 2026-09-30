import { ShadeDot } from "@/components/common/shade-swatch";
import { isShadeProduct } from "@/lib/shades";
import { isBundleProduct } from "@/lib/bundle";
import {
  isPreOrder,
  sellableStock,
  stockLevel,
  type StockLevel,
} from "@/lib/stock";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const SHOWN = 4;

const levelText: Record<StockLevel, string> = {
  out: "text-red-600",
  low: "text-amber-700",
  ok: "text-gray-700",
};

const levelDot: Record<StockLevel, string> = {
  out: "bg-red-500",
  low: "bg-amber-500",
  ok: "bg-emerald-500",
};

/**
 * Stock at a glance for the inventory list: every variant or shade with its
 * units, coloured by level, then the product's status — the real one when
 * stock is enforced, the admin's label otherwise.
 */
export function VariantStock({
  product,
  stockEnforced,
}: {
  product: Product;
  stockEnforced: boolean;
}) {
  const variants = product.variants ?? [];
  const isShade = isShadeProduct(product);
  const total = sellableStock(product);
  const preOrder = isPreOrder(product);

  const status = !stockEnforced
    ? product.stockStatus
    : preOrder
      ? "Pre-order"
      : total <= 0
        ? "Sold out"
        : variants.some((v) => (Number(v.stock) || 0) <= 0)
          ? "Some sold out"
          : "In stock";
  const statusTone =
    status === "In Stock" || status === "In stock" || status === "Pre-order"
      ? "text-emerald-600"
      : status === "Some sold out"
        ? "text-amber-600"
        : "text-red-500";

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div
        className={cn("text-sm font-bold", levelText[stockLevel(total)])}
      >
        {/* A combo's figure is how many whole sets its products make up. */}
        {total} {isBundleProduct(product) ? "combos" : "units"}
      </div>

      {variants.length > 0 && (
        <ul className="flex flex-col gap-0.5">
          {variants.slice(0, SHOWN).map((v, i) => {
            const units = Number(v.stock) || 0;
            const level = stockLevel(units);
            const name =
              [v.color, v.size, v.weight].filter(Boolean).join(" · ") ||
              (variants.length === 1 ? "Default" : `Variant ${i + 1}`);
            return (
              <li
                key={v._id ?? i}
                className="flex items-center gap-1.5 text-[11px] text-gray-500"
              >
                {isShade ? (
                  <ShadeDot hex={v.hex} className="h-2.5 w-2.5" />
                ) : (
                  <span
                    aria-hidden
                    className={cn("h-1.5 w-1.5 shrink-0 rounded-full", levelDot[level])}
                  />
                )}
                <span className="max-w-[120px] truncate">{name}</span>
                <span className={cn("ml-auto font-bold", levelText[level])}>
                  {level === "out" ? "Out" : units}
                  {level === "low" && " · low"}
                </span>
              </li>
            );
          })}
          {variants.length > SHOWN && (
            <li className="text-[10px] text-gray-400">
              +{variants.length - SHOWN} more
            </li>
          )}
        </ul>
      )}

      <div
        className={cn(
          "text-[10px] font-bold tracking-tighter uppercase",
          statusTone,
        )}
      >
        {status}
      </div>
    </div>
  );
}
