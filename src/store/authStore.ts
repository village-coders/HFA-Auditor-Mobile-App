/**
 * Zustand store for authentication state
 * Lightweight, no boilerplate state management for auditor auth
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthState, LoginCredentials, Auditor } from '@/types';
import {
  login,
  logout,
  getCurrentUser,
  getStoredTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
} from '@/api/authApi';

interface AuthActions {
  // Actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfileName: (fullName: string) => Promise<void>;
  clearError: () => void;
  setAuditor: (auditor: Auditor) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  auditor: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        /**
         * Sign in with email/password
         */
        signIn: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });
          try {
            const { tokens, auditor } = await login(credentials);
            set({
              tokens,
              auditor,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Login failed';
            set({
              isLoading: false,
              error: message,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        /**
         * Sign out - clear all auth state
         */
        signOut: async () => {
          set({ isLoading: true });
          try {
            await logout();
          } finally {
            // Always clear local state regardless of API success
            set({
              ...initialState,
              isLoading: false,
            });
            // Clear persisted state
            localStorage.removeItem('auth-storage');
          }
        },

        /**
         * Restore session from stored tokens on app init
         */
        restoreSession: async () => {
          const storedTokens = getStoredTokens();
          if (!storedTokens) {
            set({ isAuthenticated: false, isLoading: false });
            return false;
          }

          set({ isLoading: true });
          try {
            const auditor = await getCurrentUser();
            set({
              auditor,
              tokens: storedTokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } catch {
            // Failed to restore - clear tokens
            set({ ...initialState, isLoading: false });
            localStorage.removeItem('auth_tokens');
            sessionStorage.removeItem('auth_tokens');
            return false;
          }
        },

        /**
         * Request password reset email
         */
        forgotPassword: async (email: string) => {
          set({ isLoading: true, error: null });
          try {
            await forgotPassword(email);
            set({ isLoading: false, error: null });
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Forgot password request failed';
            set({ isLoading: false, error: message });
            throw error;
          }
        },

        /**
         * Reset password using token
         */
        resetPassword: async (token: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            await resetPassword(token, password);
            set({ isLoading: false, error: null });
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Reset password failed';
            set({ isLoading: false, error: message });
            throw error;
          }
        },

        /**
         * Change password from profile
         */
        changePassword: async (currentPassword: string, newPassword: string) => {
          set({ isLoading: true, error: null });
          try {
            await changePassword(currentPassword, newPassword);
            set({ isLoading: false, error: null });
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Change password failed';
            set({ isLoading: false, error: message });
            throw error;
          }
        },

        /**
         * Update user profile name
         */
        updateProfileName: async (fullName: string) => {
          set({ isLoading: true, error: null });
          try {
            const updatedAuditor = await updateProfile(fullName);
            set({ auditor: updatedAuditor, isLoading: false, error: null });
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Update profile name failed';
            set({ isLoading: false, error: message });
            throw error;
          }
        },

        /**
         * Clear any auth error
         */
        clearError: () => {
          set({ error: null });
        },

        /**
         * Set auditor (used for profile updates, etc.)
         */
        setAuditor: (auditor: Auditor) => {
          set({ auditor });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          // Only persist non-sensitive data; tokens stay in their own storage
          auditor: state.auditor,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);
