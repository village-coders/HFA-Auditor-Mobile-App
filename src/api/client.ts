/**
 * Axios HTTP client configuration
 * Configured with base URL, JWT auth interceptor, and response interceptor for error handling
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// API base URL from environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.halal.gov.my/v1';

/**
 * Create and configure the Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout for mobile networks
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: attach JWT token to every request
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const tokensRaw = localStorage.getItem('auth_tokens');
      if (tokensRaw) {
        try {
          const tokens = JSON.parse(tokensRaw);
          if (tokens?.accessToken) {
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
          }
        } catch {
          // Invalid tokens JSON, continue without auth header
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle token expiry and common errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized - token expired
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        // TODO: Implement token refresh logic with real backend
        // For now, clear auth data and let the app redirect to login
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('remember_me');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        // Auditor does not have permission for this resource
        console.error('Access forbidden:', error.response.data);
      }

      // Handle network errors (offline)
      if (!error.response && error.message === 'Network Error') {
        console.error('Network error - device may be offline');
        // TODO: Queue the request for retry when online
      }

      // Handle timeout
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - please try again');
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Singleton API client instance
export const apiClient = createApiClient();

/**
 * Helper to extract error message from API error
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.message === 'Network Error') {
      return 'Network connection failed. Please check your internet connection.';
    }
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    return axiosError.message || 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Check if error is a network/offline error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return !error.response && error.message === 'Network Error';
  }
  return false;
};
