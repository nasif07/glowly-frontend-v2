/**
 * Shared API envelope shapes.
 *
 * The glowly backend wraps every response as `{ success, message, data, meta }`
 * (the original frontend read it via the `res.data || res` pattern). List
 * endpoints additionally attach a `meta` block for pagination.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

/** A list response where `meta` is guaranteed present. */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
