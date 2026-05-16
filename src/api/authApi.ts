/**
 * Authentication API functions
 * Handles login, logout, and token management
 * TODO: Replace mock implementations with real API calls when backend is ready
 */

import { apiClient, getErrorMessage } from './client';
import type { LoginCredentials, AuthTokens, Auditor } from '@/types';
import { mockAuditor } from '@/utils/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const MOCK_DELAY = 800;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Login with email and password
 * Returns JWT tokens and auditor profile
 */
export const login = async (credentials: LoginCredentials): Promise<{ tokens: AuthTokens; auditor: Auditor }> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);

    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Accept any password that is at least 4 characters for dev
    if (credentials.password.length < 4) {
      const error: any = new Error('Invalid email or password');
      error.response = { status: 401, data: { message: 'Invalid email or password' } };
      throw error;
    }

    // Generate mock tokens
    const tokens: AuthTokens = {
      accessToken: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      expiresAt: Date.now() + 3600000, // 1 hour from now
    };

    // Store tokens based on remember me preference
    const storage = credentials.rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_tokens', JSON.stringify(tokens));
    storage.setItem('remember_me', String(credentials.rememberMe));

    return { tokens, auditor: { ...mockAuditor } };
  }

  try {
    const response = await apiClient.post<{
      success: boolean;
      data: { tokens: AuthTokens; auditor: Auditor };
    }>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const { tokens, auditor } = response.data.data;

    // Store tokens
    const storage = credentials.rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_tokens', JSON.stringify(tokens));
    storage.setItem('remember_me', String(credentials.rememberMe));

    return { tokens, auditor };
  } catch (error) {
    console.error('Login failed:', getErrorMessage(error));
    throw error;
  }
};

/**
 * Logout - clear stored tokens and notify server
 */
export const logout = async (): Promise<void> => {
  try {
    // Attempt to notify server (may fail if offline, that's ok)
    if (!USE_MOCK) {
      await apiClient.post('/auth/logout');
    }
  } catch {
    // Silently handle - we want to clear local auth state regardless
  } finally {
    // Always clear local storage
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('remember_me');
    sessionStorage.removeItem('auth_tokens');
  }
};

/**
 * Get current auditor profile
 */
export const getCurrentUser = async (): Promise<Auditor> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return { ...mockAuditor };
  }

  try {
    const response = await apiClient.get<{ success: boolean; data: Auditor }>('/auth/me');
    return response.data.data;
  } catch (error) {
    console.error('Failed to get current user:', getErrorMessage(error));
    throw error;
  }
};

/**
 * Check if we have stored tokens (for app initialization)
 */
export const getStoredTokens = (): AuthTokens | null => {
  // Check localStorage first (remember me), then sessionStorage
  const tokensRaw = localStorage.getItem('auth_tokens') || sessionStorage.getItem('auth_tokens');
  if (!tokensRaw) return null;

  try {
    const tokens: AuthTokens = JSON.parse(tokensRaw);
    // Check if tokens are expired
    if (tokens.expiresAt && tokens.expiresAt < Date.now()) {
      // Token expired, clear it
      localStorage.removeItem('auth_tokens');
      sessionStorage.removeItem('auth_tokens');
      return null;
    }
    return tokens;
  } catch {
    return null;
  }
};

/**
 * Check if the user has a remember me preference set
 */
export const hasRememberMe = (): boolean => {
  return localStorage.getItem('remember_me') === 'true';
};
