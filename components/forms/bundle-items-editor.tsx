"use client";

import { useMemo, useState } from "react";
import {
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Gift, Minus, Plus, Search, Trash2 } from "lucide-react";

import type { ProductInput } from "@/lib/schemas";
import type { Product } from "@/types";
import { useAllProducts } from "@/hooks/use-products";
import { getUnitPrice } from "@/lib/pricing";
import { variantName } from "@/lib/bundle";
import { isPreOrder } from "@/lib/stock";
import { StockBadge } from "@/components/dashboard/stock-badge";

/** The largest number of search matches listed at once. */
const MAX_MATCHES = 8;

const thumb = (product?: Product) => product?.images?.[0]?.url;

/**
 * Units of one combo item on hand, or Infinity when it isn't stock-limited.
 * Mirrors `bundleItemUnits` on the API.
 */
function itemUnits(product: Product | undefined, variantId?: string | null) {
  if (!product || product.isActive === false) return 0;
  if (isPreOrder(product)) return Infinity;
  const variants = product.variants ?? [];
  if (!variants.length) return Number(product.totalStock) || 0;
  const variant =
    variants.find((v) => v._id === variantId) ??
    (variants.length === 1 ? variants[0] : undefined);
  return variant ? Number(variant.stock) || 0 : 0;
}

/**
 * Pick the products that make up a combo: search the catalogue, add, choose
 * the variant / shade that goes in the box, and set how many. Shows what the
 * items cost bought separately against the combo price, and how many combos
 * the stock on hand makes up.
 */
export function BundleItemsEditor({
  control,
  register,
  errors,
  selfId,
  comboPrice,
}: {
  control: Control<ProductInput>;
  register: UseFormRegister<ProductInput>;
  errors: FieldErrors<ProductInput>;
  /** The combo being edited — it can't contain itself. */
  selfId?: string;
  /** What the customer pays for the combo (discount applied). */
  comboPrice: number;
}) {
  const [query, setQuery] = useState("");
  const { data: catalogue = [], isLoading } = useAllProducts();
  const items = useFieldArray({ control, name: "bundleItems" });
  const rows = useWatch({ control, name: "bundleItems" }) ?? [];

  const byId = useMemo(
    () => new Map(catalogue.map((p) => [p._id, p])),
    [catalogue],
  );

  // Only single products that are on sale can go in a combo.
  const candidates = useMemo(
    () =>
      catalogue.filter(
        (p) =>
          p._id !== selfId && p.productType !== "bundle" && p.isActive !== false,
      ),
    [catalogue, selfId],
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return candidates
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.productId?.toLowerCase().includes(q),
      )
      .slice(0, MAX_MATCHES);
  }, [candidates, query]);

  const addProduct = (product: Product) => {
    const variants = product.variants ?? [];
    items.append({
      product: product._id,
      // One variant: that's what goes in. Several: the admin picks below.
      variantId: variants.length === 1 ? (variants[0]._id ?? null) : null,
      quantity: 1,
    });
    setQuery("");
  };

  const worth = rows.reduce((sum, row) => {
    const product = byId.get(row.product);
    if (!product) return sum;
    const variant = product.variants?.find((v) => v._id === row.variantId);
    return sum + getUnitPrice(product, variant) * (Number(row.quantity) || 0);
  }, 0);
  const saving = worth - comboPrice;
  const savingPct = worth > 0 ? Math.round((saving / worth) * 100) : 0;

  const combosOnHand = rows.length
    ? rows.reduce((min, row) => {
        const perSet = Math.max(Number(row.quantity) || 1, 1);
        return Math.min(
          min,
          Math.floor(itemUnits(byId.get(row.product), row.variantId) / perSet),
        );
      }, Infinity)
    : 0;

  const listError =
    errors.bundleItems?.message ?? errors.bundleItems?.root?.message;

  return (
    <div className="space-y-5">
      <p className="-mt-2 text-xs text-[#8A6F80]">
        A combo is sold at its own price and has no stock of its own: each
        order takes stock from the products in it, and the shop shows it sold
        out as soon as any of them runs out.
      </p>

      {/* Search + add */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#C4891E]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isLoading ? "Loading products..." : "Search a product to add..."
          }
          className="w-full rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] py-3 pr-4 pl-11 text-sm outline-none focus:border-[#6B2D5C]"
        />
        {matches.length > 0 && (
          <ul className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-[#EFDFE7] bg-white p-1 shadow-xl">
            {matches.map((p) => (
              <li key={p._id}>
                <button
                  type="button"
                  onClick={() => addProduct(p)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-[#FBF4F7]"
                >
                  {thumb(p) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb(p)}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="h-10 w-10 rounded-lg bg-[#F3E9DC]" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#300332]">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-[#8A6F80]">
                      ৳{getUnitPrice(p).toLocaleString()}
                      {(p.variants?.length ?? 0) > 1 &&
                        ` · ${p.variants.length} ${p.variantType === "shade" ? "shades" : "options"}`}
                    </span>
                  </span>
                  <Plus size={16} className="text-[#C4891E]" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {query.trim() && !isLoading && matches.length === 0 && (
          <p className="mt-2 text-xs text-[#8A6F80]">
            No matching product. Only products shown on the store (and not
            combos themselves) can be added.
          </p>
        )}
      </div>

      {listError && (
        <span className="block text-xs text-red-500">{listError}</span>
      )}

      {/* Items */}
      {items.fields.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#EFDFE7] p-8 text-center text-sm text-[#8A6F80]">
          <Gift className="h-6 w-6 text-[#C4891E]" />
          Search above to add the products in this combo — e.g. a cleanser,
          a moisturiser and a sunscreen for a basic routine.
        </div>
      ) : (
        <div className="space-y-3">
          {items.fields.map((field, i) => {
            const row = rows[i];
            const product = row ? byId.get(row.product) : undefined;
            const variants = product?.variants ?? [];
            const isShade = product?.variantType === "shade";
            const quantity = Number(row?.quantity) || 1;
            const variant = variants.find((v) => v._id === row?.variantId);
            const unit = product ? getUnitPrice(product, variant) : 0;
            const units = itemUnits(product, row?.variantId);
            const rowError =
              errors.bundleItems?.[i]?.product?.message ??
              errors.bundleItems?.[i]?.variantId?.message ??
              errors.bundleItems?.[i]?.quantity?.message;

            return (
              <div
                key={field.id}
                className="rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] p-4"
              >
                <div className="flex flex-wrap items-center gap-4">
                  {thumb(product) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb(product)}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="h-14 w-14 rounded-xl bg-[#F3E9DC]" />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#300332]">
                      {product?.title ??
                        (isLoading ? "Loading..." : "Product not found")}
                    </p>
                    <p className="flex items-center gap-2 text-[11px] text-[#8A6F80]">
                      ৳{unit.toLocaleString()} each
                      {product && Number.isFinite(units) && (
                        <StockBadge units={units} />
                      )}
                      {product?.isActive === false && (
                        <span className="font-bold text-red-500">
                          Hidden from store
                        </span>
                      )}
                    </p>
                  </div>

                  {variants.length > 1 && (
                    <select
                      {...register(`bundleItems.${i}.variantId`)}
                      className="min-w-[160px] rounded-xl border border-[#E3CFDA] bg-white px-3 py-2 text-sm"
                    >
                      <option value="">
                        {isShade ? "Choose shade…" : "Choose option…"}
                      </option>
                      {variants.map((v) => (
                        <option key={v._id} value={v._id}>
                          {variantName(v) || "Unnamed"} ({v.stock} in stock)
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="flex items-center rounded-xl border border-[#E3CFDA] bg-white">
                    <button
                      type="button"
                      aria-label="Fewer"
                      onClick={() =>
                        items.update(i, {
                          ...row,
                          quantity: Math.max(1, quantity - 1),
                        })
                      }
                      className="p-2 text-[#300332]"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      {...register(`bundleItems.${i}.quantity`)}
                      className="w-12 border-x border-[#EFDFE7] py-1.5 text-center text-sm outline-none"
                    />
                    <button
                      type="button"
                      aria-label="More"
                      onClick={() =>
                        items.update(i, { ...row, quantity: quantity + 1 })
                      }
                      className="p-2 text-[#300332]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => items.remove(i)}
                    aria-label={`Remove ${product?.title ?? "item"}`}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {rowError && (
                  <span className="mt-2 block text-[11px] text-red-500">
                    {rowError}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {items.fields.length > 0 && (
        <div className="grid gap-3 rounded-2xl bg-[#300332] p-5 text-sm text-[#F3E9DC] sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              Bought separately
            </p>
            <p className="text-lg font-bold">৳{worth.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              Customer saves
            </p>
            <p
              className={`text-lg font-bold ${saving > 0 ? "text-emerald-300" : "text-amber-300"}`}
            >
              {saving > 0
                ? `৳${saving.toLocaleString()} (${savingPct}%)`
                : comboPrice > 0
                  ? "Nothing — combo costs more"
                  : "Set a price"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              Combos in stock
            </p>
            <p className="text-lg font-bold">
              {Number.isFinite(combosOnHand) ? combosOnHand : "Pre-order"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
