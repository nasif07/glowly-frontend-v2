"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { AdminNotification, ApiResponse } from "@/types";

/** How often the dashboard checks for new orders and consultations. */
export const NOTIFICATION_POLL_MS = 30_000;

/**
 * GET /notifications — the signed-in admin's newest notifications and unread
 * count. Keeps polling in background tabs, so desktop alerts still fire while
 * the admin is looking at something else.
 */
export function useAdminNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminNotification[]>>(
        "/notifications",
        { params: { limit: 20 } },
      );
      const meta = data.meta as unknown as { unreadCount?: number } | undefined;
      return { items: data.data, unreadCount: meta?.unreadCount ?? 0 };
    },
    refetchInterval: NOTIFICATION_POLL_MS,
    refetchIntervalInBackground: true,
  });
}

/** PATCH /notifications/read — some ids, or everything. */
export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (target: { ids: string[] } | { all: true }) => {
      await api.patch("/notifications/read", target);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
}
