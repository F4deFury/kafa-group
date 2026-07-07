"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { markNotificationRead, markAllNotificationsRead } from "@/app/notifications/actions";

export type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell({ notifications }: { notifications: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const unreadCount = items.filter((n) => !n.read).length;

  function handleClick(n: NotificationItem) {
    setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, read: true } : i)));
    startTransition(async () => {
      await markNotificationRead(n.id);
    });
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  function handleMarkAll() {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="relative flex items-center text-white/80 hover:text-gold" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full w-72 rounded-md border border-black/10 bg-white py-2 text-navy shadow-lg">
          <div className="flex items-center justify-between px-4 pb-1 pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-navy/40">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} className="text-[11px] text-gold hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-4 text-sm text-navy/50">No notifications yet.</p>
            ) : (
              items.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-navy-light hover:text-gold ${
                    !n.read ? "bg-gold/5" : ""
                  }`}
                >
                  <p className="font-medium">{n.title}</p>
                  {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-navy/60">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-navy/40">{timeAgo(n.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
