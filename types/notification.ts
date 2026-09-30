/** Mirrors glowly-backend/src/modules/notification/notification.model.js. */
export type AdminNotificationType = "order.created" | "consultation.created";

export interface AdminNotification {
  _id: string;
  type: AdminNotificationType;
  title: string;
  body: string;
  /** Dashboard path to open, e.g. /dashboard/orders/details/<id>. */
  link: string;
  refId?: string;
  /** Read by the admin who is signed in. */
  read: boolean;
  createdAt: string;
}
