import { create } from "zustand";

import {
  Notification,
} from "@/types/notification.types";

type NotificationStore = {
  notifications: Notification[];

  addNotification: (
    notification: Notification
  ) => void;

  markAsRead: (
    notificationId: string
  ) => void;

  markAllAsRead: () => void;

  removeNotification: (
    notificationId: string
  ) => void;

  clearNotifications: () => void;

  getUnreadCount: () => number;
};

export const useNotificationStore =
  create<NotificationStore>((set, get) => ({

    notifications: [],

    addNotification: (notification) => {

      set((state) => ({

        notifications: [
          notification,
          ...state.notifications,
        ],

      }));

    },

    markAsRead: (notificationId) => {

      set((state) => ({

        notifications:
          state.notifications.map(
            (notification) =>
              notification.id === notificationId
                ? {
                    ...notification,
                    read: true,
                  }
                : notification
          ),

      }));

    },

    markAllAsRead: () => {

      set((state) => ({

        notifications:
          state.notifications.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          ),

      }));

    },

    removeNotification: (notificationId) => {

      set((state) => ({

        notifications:
          state.notifications.filter(
            (notification) =>
              notification.id !== notificationId
          ),

      }));

    },

    clearNotifications: () => {

      set({
        notifications: [],
      });

    },

    getUnreadCount: () => {

      return get().notifications.filter(
        (notification) =>
          !notification.read
      ).length;

    },

  }));