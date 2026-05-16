/**
 * Notifications Screen
 * Full list of notifications with read/unread states
 * Tap to navigate, mark all as read
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ChevronRight } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { PullToRefresh } from '@/components/PullToRefresh';
import { formatRelativeTime } from '@/utils/dateHelpers';
import type { AppNotification } from '@/types';

export function NotificationScreen() {
  const navigate = useNavigate();
  const {
    notifications,
    loadNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    isLoading,
    isRefreshing,
  } = useNotificationStore();

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationTap = async (notification: AppNotification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    navigate(`/audits/${notification.auditId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-sm font-medium text-[#1A7A4A] active:opacity-60"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="px-4 pt-4">
        {isLoading ? (
          <SkeletonCard variant="notification" count={4} />
        ) : notifications.length === 0 ? (
          <EmptyState variant="notifications" />
        ) : (
          <PullToRefresh onRefresh={refreshNotifications} isRefreshing={isRefreshing}>
            <div className="space-y-2 pb-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onTap={handleNotificationTap}
                />
              ))}
            </div>
          </PullToRefresh>
        )}
      </div>
    </div>
  );
}

/**
 * Individual Notification Item
 */
interface NotificationItemProps {
  notification: AppNotification;
  onTap: (notification: AppNotification) => void;
}

function NotificationItem({ notification, onTap }: NotificationItemProps) {
  return (
    <button
      onClick={() => onTap(notification)}
      className={`w-full rounded-xl p-4 text-left flex items-start gap-3 active:scale-[0.98] transition-all ${
        notification.read
          ? 'bg-white border border-gray-100'
          : 'bg-[#1A7A4A]/5 border border-[#1A7A4A]/20'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          notification.read ? 'bg-gray-100' : 'bg-[#1A7A4A]/10'
        }`}
      >
        <Bell
          className={`w-5 h-5 ${notification.read ? 'text-gray-400' : 'text-[#1A7A4A]'}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-sm font-medium ${
              notification.read ? 'text-gray-700' : 'text-gray-900'
            }`}
          >
            {notification.title}
          </h3>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-[#1A7A4A] flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notification.body}</p>
        <p className="text-xs text-gray-400 mt-1.5">
          {formatRelativeTime(notification.receivedAt)}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
    </button>
  );
}
