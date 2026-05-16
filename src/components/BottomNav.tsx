/**
 * Bottom Navigation Bar
 * Fixed at bottom, provides navigation between main screens
 * Shows notification badge on notifications tab
 * Active state based on current route
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Bell, User } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';

const navItems = [
  { label: 'Home', icon: Home, path: '/home' },
  { label: 'Audits', icon: ClipboardList, path: '/audits' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  // Determine active tab based on current path
  const getActiveIndex = () => {
    const path = location.pathname;
    if (path.startsWith('/home')) return 0;
    if (path.startsWith('/audits')) return 1;
    if (path.startsWith('/notifications')) return 2;
    if (path.startsWith('/profile')) return 3;
    return 0;
  };

  const activeIndex = getActiveIndex();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item, index) => {
          const isActive = activeIndex === index;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center w-full h-full min-h-[48px] transition-colors"
              aria-label={item.label}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-[#1A7A4A]' : 'text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {/* Notification badge on notifications tab */}
                {item.path === '/notifications' && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 transition-colors ${
                  isActive ? 'text-[#1A7A4A] font-semibold' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
