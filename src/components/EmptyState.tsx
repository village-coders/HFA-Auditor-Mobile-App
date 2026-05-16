/**
 * Empty State Component
 * Friendly illustration when no data is available
 */

import { ClipboardList, ClipboardCheck, Bell, Search } from 'lucide-react';

interface EmptyStateProps {
  variant: 'pending' | 'completed' | 'notifications' | 'search';
  title?: string;
  message?: string;
}

const variantConfig = {
  pending: {
    icon: ClipboardList,
    defaultTitle: 'No Pending Audits',
    defaultMessage: 'You have no upcoming audits scheduled. Relax for now!',
  },
  completed: {
    icon: ClipboardCheck,
    defaultTitle: 'No Completed Audits',
    defaultMessage: 'You have not completed any audits yet. They will appear here.',
  },
  notifications: {
    icon: Bell,
    defaultTitle: 'No Notifications',
    defaultMessage: 'You are all caught up! No new notifications.',
  },
  search: {
    icon: Search,
    defaultTitle: 'No Results',
    defaultMessage: 'We could not find what you are looking for.',
  },
};

export function EmptyState({ variant, title, message }: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">
        {title || config.defaultTitle}
      </h3>
      <p className="text-sm text-gray-400 max-w-xs">
        {message || config.defaultMessage}
      </p>
    </div>
  );
}
