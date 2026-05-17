/**
 * Profile Screen
 * Auditor info, stats, logout, name change, password change settings
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck, ClipboardCheck, TrendingUp,
  LogOut, ChevronRight, Award, AlertTriangle, ShieldCheck,
  User, Key, Loader2, CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuditStore } from '@/store/auditStore';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { auditor, signOut, updateProfileName, changePassword, isLoading } = useAuthStore();
  const { stats, loadStats } = useAuditStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Edit Name state
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');

  // Edit Password state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
    navigate('/login', { replace: true });
  };

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess('');

    if (!newName.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }

    try {
      await updateProfileName(newName.trim());
      setNameSuccess('Your name has been updated successfully!');
      setTimeout(() => {
        setShowChangeNameModal(false);
        setNameSuccess('');
      }, 1500);
    } catch (err: any) {
      setNameError(err.message || 'Failed to update name.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordSuccess('');
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password. Please verify current password.');
    }
  };

  const menuItems = [
    {
      icon: ClipboardCheck,
      label: 'Completed Audits',
      value: `${stats.auditsThisYear} this year`,
      action: () => navigate('/audits?tab=completed'),
    },
    {
      icon: TrendingUp,
      label: 'Pass Rate',
      value: `${stats.passRate}%`,
      action: () => {},
    },
    {
      icon: Award,
      label: 'Total Audits',
      value: String(stats.totalAuditsCompleted),
      action: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-[#1A7A4A] px-5 pt-6 pb-16 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#1A7A4A] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {(auditor?.name || 'A').charAt(0)}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-lg font-bold text-gray-900">{auditor?.name || 'Auditor'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{auditor?.email}</p>

          {/* Employee ID */}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5">
            <BadgeCheck className="w-4 h-4 text-[#1A7A4A]" />
            <span className="text-sm font-medium text-gray-700">{auditor?.employeeId}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{stats.auditsThisMonth}</p>
            <p className="text-xs text-gray-500 mt-0.5">This Month</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{stats.auditsThisYear}</p>
            <p className="text-xs text-gray-500 mt-0.5">This Year</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{stats.passRate}%</p>
            <p className="text-xs text-gray-500 mt-0.5">Pass Rate</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
              </div>
              <span className="text-sm text-gray-400 mr-1">{item.value}</span>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="px-4 mt-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">Account Settings</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          <button
            onClick={() => {
              setNewName(auditor?.name || '');
              setNameError('');
              setNameSuccess('');
              setShowChangeNameModal(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-[#1A7A4A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Change Name</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </button>
          
          <button
            onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmNewPassword('');
              setPasswordError('');
              setPasswordSuccess('');
              setShowChangePasswordModal(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Key className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Change Password</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="px-4 mt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-medium">Halal Auditor App</span>
        </div>
        <p className="text-xs text-gray-300">Version 1.0.0</p>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-14 bg-red-50 text-red-600 font-semibold rounded-xl
            active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      {/* Change Name Modal */}
      {showChangeNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowChangeNameModal(false)} />
          <form onSubmit={handleChangeName} className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Change Name</h2>
            
            {nameError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 mb-4 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{nameError}</p>
              </div>
            )}

            {nameSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2 mb-4 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{nameSuccess}</p>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="modalNewName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                id="modalNewName"
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setNameError(''); }}
                placeholder="Enter your full name"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                  focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                  placeholder:text-gray-400 transition-all"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowChangeNameModal(false)}
                className="flex-1 h-12 bg-gray-100 text-gray-700 font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !newName.trim()}
                className="flex-1 h-12 bg-[#1A7A4A] text-white font-semibold rounded-xl
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowChangePasswordModal(false)} />
          <form onSubmit={handleChangePassword} className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
            
            {passwordError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 mb-4 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{passwordError}</p>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2 mb-4 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{passwordSuccess}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(''); }}
                  placeholder="Enter current password"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                    focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                    placeholder:text-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                  placeholder="At least 6 characters"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                    focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                    placeholder:text-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => { setConfirmNewPassword(e.target.value); setPasswordError(''); }}
                  placeholder="Re-enter new password"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                    focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                    placeholder:text-gray-400 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="showPasswordsToggle"
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  className="w-4 h-4 text-[#1A7A4A] border-gray-300 rounded focus:ring-[#1A7A4A]"
                />
                <label htmlFor="showPasswordsToggle" className="text-xs text-gray-500 font-medium select-none">
                  Show Passwords
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(false)}
                className="flex-1 h-12 bg-gray-100 text-gray-700 font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !currentPassword || !newPassword || !confirmNewPassword}
                className="flex-1 h-12 bg-[#1A7A4A] text-white font-semibold rounded-xl
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 text-center mb-2">Log Out?</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-12 bg-gray-100 text-gray-700 font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 h-12 bg-red-500 text-white font-semibold rounded-xl
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
