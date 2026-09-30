"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination bar for the dashboard tables.
 *
 * Deliberately does not scroll the window on page change — the tables scroll
 * inside their own container, so yanking the whole page to the top would fight
 * that. The storefront blog has its own `components/blog/pagination.tsx`; that
 * one is localised and storefront-styled, hence the separate component here.
 */
export function DataPagination({
  page,
  totalItems,
  pageSize,
  onChange,
  label = "items",
}: {
  page: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
  /** Plural noun for the range summary, e.g. "products". */
  label?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const first = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, totalItems);

  // A single page still shows the count — it's the only place the admin can
  // see how many rows a filter actually matched.
  const pages = pageNumbers(page, totalPages);

  const arrow =
    "flex h-9 items-center gap-1 rounded-full border border-[#EAD9E2] bg-white px-3 text-xs font-bold text-[#300332] transition-colors hover:bg-[#FBF4F7] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white";

  return (
    <nav
      aria-label="Pagination"
      className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row"
    >
      <p className="text-xs font-semibold text-[#8A6F80]">
        Showing <span className="text-[#300332]">{first}</span>–
        <span className="text-[#300332]">{last}</span> of{" "}
        <span className="text-[#300332]">{totalItems}</span> {label}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className={arrow}
          >
            <ChevronLeft size={14} /> Prev
          </button>

          {pages.map((p, i) =>
            p === null ? (
              <span
                key={`gap-${i}`}
                aria-hidden
                className="px-1 text-xs font-bold text-[#C4AC96]"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={`h-9 min-w-9 rounded-full px-2 text-xs font-bold transition-colors ${
                  p === page
                    ? "bg-[#300332] text-white"
                    : "border border-[#EAD9E2] bg-white text-[#300332] hover:bg-[#FBF4F7]"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className={arrow}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </nav>
  );
}

/**
 * Page buttons to render, with `null` marking an ellipsis.
 *
 * Always emits exactly 7 slots once there are more than 7 pages, so the bar
 * keeps a fixed width and a button never shifts out from under the cursor
 * between clicks. The first and last page stay reachable from anywhere.
 */
export function pageNumbers(
  page: number,
  totalPages: number,
): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, null, totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      null,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, null, page - 1, page, page + 1, null, totalPages];
}
