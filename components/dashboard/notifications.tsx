"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  BellRing,
  CheckCheck,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAdminNotifications,
  useMarkNotificationsRead,
} from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import type { AdminNotification } from "@/types";

/* ------------------------- Browser alert helpers ------------------------- */

const ALERTED_KEY = "glowly-admin-alerted";
const ALERTED_KEEP = 100;

const alertsSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

/**
 * Claim an alert across tabs: the first tab to record the id shows it, the
 * others skip. localStorage is shared by every dashboard tab.
 */
const claimAlert = (id: string) => {
  try {
    const seen: string[] = JSON.parse(
      localStorage.getItem(ALERTED_KEY) || "[]",
    );
    if (seen.includes(id)) return false;
    localStorage.setItem(
      ALERTED_KEY,
      JSON.stringify([id, ...seen].slice(0, ALERTED_KEEP)),
    );
    return true;
  } catch {
    return true;
  }
};

/** A short two-note chime, generated — no audio file to ship. */
const chime = () => {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    [880, 1320].forEach((frequency, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = frequency;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const start = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      osc.start(start);
      osc.stop(start + 0.32);
    });
    setTimeout(() => ctx.close(), 800);
  } catch {
    // Sound is a nicety; browsers may block it until the page is used.
  }
};

/** Notification.permission, kept in sync (it can change in site settings). */
const permissionListeners = new Set<() => void>();
const subscribePermission = (listener: () => void) => {
  permissionListeners.add(listener);
  window.addEventListener("focus", listener);
  return () => {
    permissionListeners.delete(listener);
    window.removeEventListener("focus", listener);
  };
};
const readPermission = (): NotificationPermission | "unsupported" =>
  alertsSupported() ? Notification.permission : "unsupported";

function useAlertPermission() {
  const permission = useSyncExternalStore(
    subscribePermission,
    readPermission,
    () => "unsupported" as const,
  );
  const request = async () => {
    if (!alertsSupported()) return;
    await Notification.requestPermission();
    permissionListeners.forEach((listener) => listener());
    // Played in the click, so the browser lets later chimes through.
    if (Notification.permission === "granted") chime();
  };
  return { permission, request };
}

/* ------------------------------ Alerts ------------------------------ */

/**
 * Raises an alert for each new notification, once per event across all open
 * dashboard tabs: a desktop notification with a chime when the tab is in the
 * background (and alerts are allowed), a toast when it's in front. Render
 * exactly once, in the dashboard shell.
 */
export function NotificationAlerts() {
  const router = useRouter();
  const { data } = useAdminNotifications();
  const markRead = useMarkNotificationsRead();
  const known = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!data) return;

    // The first load is what was already there — nothing to announce.
    if (!known.current) {
      known.current = new Set(data.items.map((n) => n._id));
      return;
    }

    const fresh = data.items.filter(
      (n) => !n.read && !known.current!.has(n._id),
    );
    data.items.forEach((n) => known.current!.add(n._id));

    // Oldest first, so they stack in the order they happened.
    for (const n of [...fresh].reverse()) {
      if (!claimAlert(n._id)) continue;

      const open = () => {
        window.focus();
        router.push(n.link);
        markRead.mutate({ ids: [n._id] });
      };

      if (
        document.visibilityState === "hidden" &&
        alertsSupported() &&
        Notification.permission === "granted"
      ) {
        const alert = new Notification(n.title, {
          body: n.body,
          icon: "/glowly.png",
          tag: n._id,
        });
        alert.onclick = () => {
          open();
          alert.close();
        };
        chime();
      } else {
        toast(n.title, {
          description: n.body,
          action: { label: "Open", onClick: open },
          duration: 10000,
        });
        if (alertsSupported() && Notification.permission === "granted") chime();
      }
    }
  }, [data, router, markRead]);

  return null;
}

/* ------------------------------- Bell ------------------------------- */

const timeAgo = (iso: string) => {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
};

const TYPE_ICON = {
  "order.created": ShoppingBag,
  "consultation.created": Stethoscope,
} as const;

function NotificationItem({
  notification,
  onOpen,
}: {
  notification: AdminNotification;
  onOpen: (n: AdminNotification) => void;
}) {
  const Icon = TYPE_ICON[notification.type] ?? Bell;
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className={cn(
          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FBF4F7]",
          !notification.read && "bg-[#FBF4F7]/60",
        )}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#300332]/5 text-[#300332]">
          <Icon size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block text-sm text-[#300332]",
              notification.read ? "font-medium" : "font-bold",
            )}
          >
            {notification.title}
          </span>
          {notification.body && (
            <span className="block truncate text-xs text-gray-500">
              {notification.body}
            </span>
          )}
          <span className="mt-0.5 block text-[11px] text-gray-400">
            {timeAgo(notification.createdAt)}
          </span>
        </span>
        {!notification.read && (
          <span
            aria-label="Unread"
            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#8E1454]"
          />
        )}
      </button>
    </li>
  );
}

/**
 * The bell and its panel. `sidebar` sits in the desktop sidebar with the panel
 * opening to its right; `topbar` sits in the mobile bar with the panel below.
 */
export function NotificationBell({
  onNavigate,
}: {
  /** Called after opening a notification (e.g. to close the mobile menu). */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data } = useAdminNotifications();
  const markRead = useMarkNotificationsRead();
  const { permission, request } = useAlertPermission();
  const wrapper = useRef<HTMLDivElement>(null);

  const unread = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  // Close on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openNotification = (n: AdminNotification) => {
    if (!n.read) markRead.mutate({ ids: [n._id] });
    setOpen(false);
    onNavigate?.();
    router.push(n.link);
  };

  const badge =
    unread > 0 ? (
      <span className="min-w-5 rounded-full bg-[#F49AC2] px-1.5 text-center text-[10px] leading-5 font-black text-[#300332]">
        {unread > 99 ? "99+" : unread}
      </span>
    ) : null;

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className={cn(
          "relative rounded-lg p-2 text-[#300332] transition-colors hover:bg-[#F6EFE8]",
          open && "bg-[#F6EFE8]",
        )}
      >
        <Bell size={20} strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5">{badge}</span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="fixed top-16 right-2 left-2 z-[1000] flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-[#EFDFE7] bg-white text-[#300332] shadow-2xl sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-[#F3E9DC] px-4 py-3">
            <p className="text-sm font-bold">Notifications</p>
            <button
              type="button"
              onClick={() => markRead.mutate({ all: true })}
              disabled={!unread || markRead.isPending}
              className="flex items-center gap-1 text-xs font-bold text-[#8E1454] disabled:opacity-40"
            >
              <CheckCheck size={14} /> Mark all as read
            </button>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-400">
              Nothing yet. New orders and consultations show up here.
            </p>
          ) : (
            <ul className="flex-1 divide-y divide-[#F3E9DC] overflow-y-auto">
              {items.map((n) => (
                <NotificationItem
                  key={n._id}
                  notification={n}
                  onOpen={openNotification}
                />
              ))}
            </ul>
          )}

          <div className="border-t border-[#F3E9DC] px-4 py-3 text-xs text-gray-500">
            {permission === "default" && (
              <button
                type="button"
                onClick={request}
                className="flex items-center gap-2 font-bold text-[#300332]"
              >
                <BellRing size={14} /> Enable desktop alerts
              </button>
            )}
            {permission === "granted" && (
              <span className="flex items-center gap-2">
                <BellRing size={14} className="text-emerald-600" /> Desktop
                alerts are on for this browser.
              </span>
            )}
            {permission === "denied" && (
              <span className="flex items-center gap-2">
                <BellOff size={14} /> Desktop alerts are blocked. Allow
                notifications for this site in your browser settings.
              </span>
            )}
            {permission === "unsupported" && (
              <span>This browser doesn&apos;t support desktop alerts.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
