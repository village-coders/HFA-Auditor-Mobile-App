/**
 * Zustand store for authentication state
 * Lightweight, no boilerplate state management for auditor auth
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthState, LoginCredentials, Auditor } from '@/types';
import { login, logout, getCurrentUser, getStoredTokens } from '@/api/authApi';

interface AuthActions {
  // Actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
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
