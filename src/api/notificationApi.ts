/**
 * Notification API functions
 * Handles fetching, marking as read, and managing notifications
 * TODO: Replace mock implementations with real API calls when backend is ready
 */

import type { AppNotification } from '@/types';
import { mockNotifications } from '@/utils/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const MOCK_DELAY = 400;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all notifications for the current auditor
 */
export const fetchNotifications = async (): Promise<AppNotification[]> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    // Return a copy sorted by receivedAt desc
    return [...mockNotifications].sort(
      (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth_tokens') || '{}').accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    const notif = mockNotifications.find(n => n.id === notificationId);
    if (notif) {
      notif.read = true;
    }
    return;
  }

  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth_tokens') || '{}').accessToken}`,
      },
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    mockNotifications.forEach(n => {
      n.read = true;
    });
    return;
  }

  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth_tokens') || '{}').accessToken}`,
      },
    });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
};

/**
 * Get count of unread notifications
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return mockNotifications.filter(n => !n.read).length;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth_tokens') || '{}').accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get unread count');
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    throw error;
  }
};
