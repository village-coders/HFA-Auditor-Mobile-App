/**
 * Date formatting utilities using date-fns
 * Centralised date handling for consistent formatting across the app
 */

import {
  format,
  formatDistanceToNow,
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
  isThisWeek,
  isPast,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

/**
 * Format a date for audit cards (e.g., "May 18, 2026")
 */
export const formatAuditDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, 'MMM d, yyyy');
};

/**
 * Format a date with day name (e.g., "Monday, May 18, 2026")
 */
export const formatAuditDateLong = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, 'EEEE, MMM d, yyyy');
};

/**
 * Format time only (e.g., "09:30 AM")
 */
export const formatTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, 'h:mm a');
};

/**
 * Format date + time (e.g., "May 18, 2026 at 09:30 AM")
 */
export const formatDateTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, "MMM d, yyyy 'at' h:mm a");
};

/**
 * Relative time (e.g., "2 hours ago", "Yesterday", "Just now")
 */
export const formatRelativeTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diffMs < 60000) return 'Just now';

  // Less than 24 hours - show relative
  if (diffMs < 86400000) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // Yesterday
  if (isYesterday(date)) return 'Yesterday';

  // Within last 7 days
  if (diffMs < 604800000) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // Older - show date
  return format(date, 'MMM d, yyyy');
};

/**
 * Smart date label for dashboard (Today, Tomorrow, or date)
 */
export const getSmartDateLabel = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return formatAuditDate(date);
};

/**
 * Check if an audit is overdue (scheduled date is in the past and not completed)
 */
export const isAuditOverdue = (dateInput: string | Date): boolean => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return isPast(date) && !isToday(date);
};

/**
 * Check if an audit is happening this week
 */
export const isThisWeekAudit = (dateInput: string | Date): boolean => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return isThisWeek(date, { weekStartsOn: 1 });
};

/**
 * Get start and end of current week (Monday-based)
 */
export const getCurrentWeekRange = () => {
  const now = new Date();
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  };
};

/**
 * Format audit type to display label
 */
export const formatAuditType = (type: string): string => {
  const labels: Record<string, string> = {
    initial: 'Initial Certification',
    renewal: 'Renewal',
    surprise: 'Surprise Visit',
    'follow-up': 'Follow-Up',
  };
  return labels[type] || type;
};

/**
 * Format audit status to display label
 */
export const formatAuditStatus = (status: string): string => {
  const labels: Record<string, string> = {
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
  };
  return labels[status] || status;
};

/**
 * Format final result to display label
 */
export const formatFinalResult = (result: string): string => {
  const labels: Record<string, string> = {
    passed: 'Passed',
    failed: 'Failed',
    conditional_pass: 'Conditional Pass',
  };
  return labels[result] || result;
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/**
 * ISO string to Date object
 */
export const toDate = (dateInput: string | Date): Date => {
  return typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
};
