/**
 * Types for the Steadfast Courier integration (backend module:
 * `glowly-backend/src/modules/steadfast`). Responses are Steadfast's own
 * payloads passed through untouched inside our `ApiResponse<T>` envelope, so
 * every shape below keeps an index signature for fields we don't rely on.
 */

export type SteadfastDeliveryStatus =
  | "pending"
  | "delivered"
  | "partial_delivered"
  | "cancelled"
  | "hold"
  | "in_review"
  | "unknown"
  | "delivered_approval_pending"
  | "cancelled_approval_pending"
  | "unknown_approval_pending";

export type SteadfastReturnRequestStatus =
  | "pending"
  | "approved"
  | "processing"
  | "completed"
  | "cancelled";

/** 0 = home delivery, 1 = hub pickup. */
export type SteadfastDeliveryType = 0 | 1;

export interface SteadfastOrderResponse {
  consignment_id: number;
  invoice: string;
  tracking_code: string;
  status: string;
  [key: string]: unknown;
}

export interface SteadfastBulkOrderResult {
  invoice: string;
  status: "success" | "error" | string;
  consignment_id?: number;
  tracking_code?: string;
  message?: string;
  [key: string]: unknown;
}

export interface SteadfastStatusResponse {
  delivery_status: SteadfastDeliveryStatus;
  consignment_id?: number;
  invoice?: string;
  tracking_code?: string;
  [key: string]: unknown;
}

export interface SteadfastBalanceResponse {
  current_balance: number;
  [key: string]: unknown;
}

export interface SteadfastReturnRequest {
  id: number | string;
  consignment_id?: number | string;
  invoice?: string;
  tracking_code?: string;
  reason?: string;
  status: SteadfastReturnRequestStatus;
  created_at?: string;
  [key: string]: unknown;
}

export interface SteadfastPayment {
  id: number | string;
  amount?: number;
  created_at?: string;
  [key: string]: unknown;
}

export interface SteadfastPaymentDetail extends SteadfastPayment {
  consignments?: Array<Record<string, unknown>>;
}

export interface SteadfastPoliceStation {
  id: number | string;
  name: string;
  [key: string]: unknown;
}

/** Identifier used to look up a consignment's delivery status. */
export interface SteadfastTrackIdentifier {
  consignmentId?: string;
  invoice?: string;
  trackingCode?: string;
}
