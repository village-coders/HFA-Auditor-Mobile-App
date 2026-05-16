/**
 * Firebase Configuration
 * Sets up Firebase Cloud Messaging (FCM) for push notifications
 *
 * INSTRUCTIONS:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Add a web app to your project
 * 3. Copy your Firebase config values into the .env file
 * 4. Download the service worker config and place it in the public folder
 *
 * TODO: Replace placeholder config with your actual Firebase project credentials
 */

import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

/**
 * Initialize Firebase
 * Only initializes if config is present
 */
let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

export const initializeFirebase = (): FirebaseApp | null => {
  // Check if config is valid
  const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;
  if (!hasConfig) {
    console.warn('Firebase config not found. Push notifications will not work.');
    return null;
  }

  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      return null;
    }
  }

  return app;
};

/**
 * Request FCM permission and get device token
 * Returns the FCM token to be stored on the backend
 */
export const requestFcmToken = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn('Firebase messaging not initialized');
      return null;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    // Get FCM token
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
    });

    if (token) {
      console.log('FCM token received:', token.substring(0, 20) + '...');
      return token;
    }

    console.warn('No FCM token received');
    return null;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

/**
 * Listen for foreground push notifications
 * Call this when the app initializes
 */
export const onForegroundMessage = (callback: (payload: { title: string; body: string; data?: Record<string, string> }) => void): (() => void) | undefined => {
  if (!messaging) {
    console.warn('Firebase messaging not initialized, cannot listen for messages');
    return undefined;
  }

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);

    const notificationData = {
      title: payload.notification?.title || 'New Notification',
      body: payload.notification?.body || '',
      data: payload.data as Record<string, string> | undefined,
    };

    callback(notificationData);
  });
};

/**
 * Register FCM token with backend
 * TODO: Replace with real API call when backend is ready
 */
export const registerFcmTokenWithBackend = async (token: string): Promise<boolean> => {
  try {
    // TODO: Implement real API call to register FCM token
    console.log('Registering FCM token with backend:', token.substring(0, 20) + '...');
    // await apiClient.post('/auditors/fcm-token', { token });
    return true;
  } catch (error) {
    console.error('Failed to register FCM token:', error);
    return false;
  }
};

/**
 * Initialize push notification system
 * This should be called after the user logs in
 */
export const initializePushNotifications = async (
  onNotification: (payload: { title: string; body: string; data?: Record<string, string> }) => void
): Promise<void> => {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.warn('This browser does not support push notifications');
    return;
  }

  // Initialize Firebase
  initializeFirebase();

  // Get FCM token
  const token = await requestFcmToken();
  if (token) {
    // Store token locally
    localStorage.setItem('fcm_token', token);

    // Register with backend
    await registerFcmTokenWithBackend(token);
  }

  // Listen for foreground messages
  onForegroundMessage(onNotification);
};

/**
 * Unsubscribe from push notifications
 * Call this on logout
 */
export const unsubscribePushNotifications = async (): Promise<void> => {
  try {
    localStorage.removeItem('fcm_token');
    // TODO: Call backend to unregister token
    // await apiClient.delete('/auditors/fcm-token');
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
  }
};
