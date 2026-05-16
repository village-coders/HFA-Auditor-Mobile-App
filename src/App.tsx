/**
 * Halal Auditor App - Root Component
 * React Router v6 setup with protected routes
 * Bottom navigation on authenticated routes
 */

import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoginScreen } from '@/features/auth/LoginScreen';
import { HomeScreen } from '@/features/home/HomeScreen';
import { AuditListScreen } from '@/features/audits/AuditListScreen';
import { AuditDetailScreen } from '@/features/audits/AuditDetailScreen';
import { NotificationScreen } from '@/features/notifications/NotificationScreen';
import { ProfileScreen } from '@/features/profile/ProfileScreen';
import { BottomNav } from '@/components/BottomNav';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SkeletonCard } from '@/components/SkeletonCard';
import { ShieldCheck } from 'lucide-react';

/**
 * Authentication Guard
 * Redirects unauthenticated users to login
 */
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#1A7A4A] flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      <BottomNav />
    </div>
  );
}

/**
 * Public Route
 * Redirects authenticated users to home
 */
function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <SkeletonCard variant="audit" count={1} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

/**
 * App initializer component
 * Handles session restoration on app mount
 */
function AppInitializer() {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return null;
}

/**
 * Root App Component
 */
function App() {
  return (
    <>
      <AppInitializer />
      <OfflineBanner />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/audits" element={<AuditListScreen />} />
          <Route path="/audits/:id" element={<AuditDetailScreen />} />
          <Route path="/notifications" element={<NotificationScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
