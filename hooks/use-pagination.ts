"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Client-side pagination over an already-loaded, already-filtered array.
 *
 * The dashboard lists fetch their whole dataset and filter in the browser, so
 * paging happens here rather than on the server. `reset` should be called
 * whenever a filter changes, otherwise an admin who filters while on page 7
 * lands on an empty table.
 */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Safety net for a list that shrinks under the current page (a deleted row,
  // or a filter applied without calling reset).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    setPage,
    totalPages,
    pageItems,
    reset: () => setPage(1),
  };
}
