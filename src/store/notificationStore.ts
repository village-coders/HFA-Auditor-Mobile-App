/**
 * Zustand store for notification state
 * Manages notification list, unread count, and read status
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppNotification } from '@/types';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from '@/api/notificationApi';

interface NotificationState {
  // Data
  notifications: AppNotification[];
  unreadCount: number;

  // UI State
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

interface NotificationActions {
  // Actions
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  addNotification: (notification: AppNotification) => void;
  loadUnreadCount: () => Promise<void>;
  clearError: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      /**
       * Load all notifications
       */
      loadNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const notifications = await fetchNotifications();
          const unreadCount = notifications.filter((n) => !n.read).length;
          set({ notifications, unreadCount, isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to load notifications';
          set({ isLoading: false, error: message });
        }
      },

      /**
       * Mark a single notification as read
       */
      markAsRead: async (notificationId: string) => {
        try {
          await markNotificationAsRead(notificationId);
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, get().unreadCount - 1),
          }));
        } catch (error: unknown) {
          console.error('Failed to mark notification as read:', error);
        }
      },

      /**
       * Mark all notifications as read
       */
      markAllAsRead: async () => {
        try {
          await markAllNotificationsAsRead();
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          }));
        } catch (error: unknown) {
          console.error('Failed to mark all as read:', error);
        }
      },

      /**
       * Refresh notifications (pull-to-refresh)
       */
      refreshNotifications: async () => {
        set({ isRefreshing: true, error: null });
        try {
          const notifications = await fetchNotifications();
          const unreadCount = notifications.filter((n) => !n.read).length;
          set({ notifications, unreadCount, isRefreshing: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to refresh';
          set({ isRefreshing: false, error: message });
        }
      },

      /**
       * Add a new notification (from FCM push)
       */
      addNotification: (notification: AppNotification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      /**
       * Load unread notification count
       */
      loadUnreadCount: async () => {
        try {
          const count = await getUnreadNotificationCount();
          set({ unreadCount: count });
        } catch (error: unknown) {
          console.error('Failed to load unread count:', error);
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'NotificationStore' }
  )
);
