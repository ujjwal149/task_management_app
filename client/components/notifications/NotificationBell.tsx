"use client";

import { Bell } from "lucide-react";

import { useNotificationStore } from "@/store/notification.store";

type NotificationBellProps = {
  onClick: () => void;
};

export default function NotificationBell({
  onClick,
}: NotificationBellProps) {

  const notifications =
    useNotificationStore(
      (state) => state.notifications
    );

  const unreadCount =
    notifications.filter(
      (notification) => !notification.read
    ).length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted cursor-pointer"
      aria-label="Notifications"
    >

      <Bell className="h-5 w-5" />

      {unreadCount > 0 && (
        <span
          className="
            absolute
            -right-0.5
            -top-0.5
            flex
            h-5
            min-w-5
            items-center
            justify-center
            rounded-full
            bg-red-500
            px-1
            text-[10px]
            font-semibold
            text-white

          "
        >
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}

    </button>
  );
}