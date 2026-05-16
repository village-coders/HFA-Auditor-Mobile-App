# Halal Auditor - Field Audit Management App

A mobile-first Progressive Web Application (PWA) built for Halal Food Authority field auditors. This companion app works alongside the Halal Food Authority Management Portal to enable auditors to conduct on-site inspections, submit reports, and manage their assignments from mobile devices.

## Architecture Decision: Mock API

This app uses a **mock API layer** for development. All API functions in `src/api/` are built with a `USE_MOCK` toggle (controlled by `VITE_USE_MOCK` env variable). When mock mode is enabled, API calls return realistic data from `src/utils/mockData.ts` with simulated network delays. To switch to a real backend, simply set `VITE_USE_MOCK=false` and ensure the API layer functions are updated with real endpoint calls.

**Why mock API?**
- The app is fully functional out-of-the-box without a backend
- Clear separation between API interface and implementation
- Easy to switch to real API when backend is ready

---

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (mobile-first)
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Date/Time**: date-fns
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa with service worker

---

## Project Structure

```
src/
  api/                   # API layer (axios + mock API)
    client.ts            # Axios instance with interceptors
    authApi.ts           # Authentication API
    auditApi.ts          # Audit CRUD API
    notificationApi.ts   # Notification API
    firebase.ts          # Firebase/FCM configuration
  assets/                # Static assets
  components/            # Reusable UI components
    BottomNav.tsx        # Bottom navigation bar
    OfflineBanner.tsx    # Offline state indicator
    StatusBadge.tsx      # Status/type/result badges
    SkeletonCard.tsx     # Loading skeletons
    EmptyState.tsx       # Empty state illustrations
    PullToRefresh.tsx    # Pull-to-refresh wrapper
  features/              # Feature screens
    auth/
      LoginScreen.tsx    # Authentication screen
    home/
      HomeScreen.tsx     # Dashboard/home screen
    audits/
      AuditListScreen.tsx   # Tabbed audit list
      AuditDetailScreen.tsx # Audit detail (view/checklist/submit)
    notifications/
      NotificationScreen.tsx # Notifications list
    profile/
      ProfileScreen.tsx  # Profile and settings
  hooks/                 # Custom React hooks
  store/                 # Zustand stores
    authStore.ts         # Auth state management
    auditStore.ts        # Audit state management
    notificationStore.ts # Notification state management
  types/                 # TypeScript interfaces
    index.ts             # All type definitions
  utils/                 # Utility functions
    dateHelpers.ts       # Date formatting helpers
    mockData.ts          # Development mock data
  App.tsx                # Root component with routing
  main.tsx               # Entry point
```

---

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd halal-auditor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://api.halal.gov.my/v1` |
| `VITE_USE_MOCK` | Use mock API (`true`/`false`) | `true` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | - |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | - |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | - |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | - |
| `VITE_FIREBASE_VAPID_KEY` | FCM VAPID key | - |

---

## Firebase Cloud Messaging (FCM) Setup

FCM provides push notifications for:
- New audit assignments
- Audit reminders
- Status updates from supervisors

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Register a Web App
4. Copy the Firebase config values to your `.env` file

### 2. Generate VAPID Key

1. In Firebase Console, go to **Project Settings > Cloud Messaging**
2. Under **Web Push Certificates**, click **Generate Key Pair**
3. Copy the public key to `VITE_FIREBASE_VAPID_KEY`

### 3. Service Worker Setup

The PWA plugin auto-generates the service worker. For FCM background messages, add a `firebase-messaging-sw.js` in your `public/` folder:

```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  projectId: 'YOUR_PROJECT_ID',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: payload.data?.auditId,
    data: payload.data,
  });
});
```

### 4. How FCM Works in This App

1. **Login**: After the auditor logs in, `initializePushNotifications()` is called
2. **Token Registration**: The app requests notification permission and gets an FCM token
3. **Backend Sync**: The FCM token is sent to the backend and stored on the auditor record
4. **Portal Integration**: When a portal admin schedules an audit, the backend sends an FCM message to the assigned auditor
5. **Foreground**: `onForegroundMessage()` captures notifications and adds them to the notification store
6. **Background**: The service worker displays system notifications
7. **Tap**: Tapping a notification navigates to the relevant audit detail screen

---

## Wrapping with Capacitor (iOS/Android)

To convert this web app to a native mobile app:

### 1. Install Capacitor

```bash
# Build the app first
npm run build

# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Add platforms
npx cap add android
npx cap add ios

# Sync build output
npx cap sync
```

### 2. Configure Capacitor

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'gov.my.halal.auditor',
  appName: 'Halal Auditor',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
```

### 3. Build and Run

```bash
# Build web app
npm run build

# Sync with native platforms
npx cap sync

# Open in Android Studio / Xcode
npx cap open android
npx cap open ios
```

### 4. Camera/Photo Integration

For native camera access in Capacitor:

```bash
npm install @capacitor/camera
npx cap sync
```

Update `AuditDetailScreen.tsx` to use Capacitor Camera API instead of HTML file input when running as native app.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## PWA Features

- **Installable**: Users can add to home screen
- **Offline Support**: Service worker caches assets and API responses
- **Responsive**: Designed for 375px-430px mobile screens
- **Push Notifications**: FCM integration for real-time notifications

---

## Authentication Flow

1. Auditor enters credentials (created by portal admin)
2. App sends login request to API
3. On success, JWT tokens are stored (localStorage if "Remember me", sessionStorage otherwise)
4. Axios interceptor adds `Authorization: Bearer <token>` to all requests
5. On 401, tokens are cleared and user is redirected to login

---

## Audit Submission Flow

1. **Scheduled**: Auditor views audit details, taps "Start Audit"
2. **In Progress**: Auditor fills checklist (Pass/Fail/N/A per item), adds photos and notes
3. **Submission**: Auditor selects final result (Pass/Fail/Conditional), adds remarks, confirms
4. **Completed**: Audit is marked as completed and synced to backend

---

## License

Internal use - Halal Food Authority
