/**
 * Halal Food Authority - Auditor App Type Definitions
 * All domain models, API types, and UI state types
 */

// =============================================================================
// AUTH TYPES
// =============================================================================

export interface Auditor {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  avatarUrl?: string;
  fcmToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  auditor: Auditor | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// =============================================================================
// ESTABLISHMENT TYPES
// =============================================================================

export interface Establishment {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPerson: string;
  contactPhone: string;
}

// =============================================================================
// AUDIT CHECKLIST TYPES
// =============================================================================

export type ChecklistResult = 'pass' | 'fail' | 'na' | null;

export interface AuditChecklistItem {
  id: string;
  category: string;
  description: string;
  result: ChecklistResult;
  notes?: string;
  photoUrls?: string[];
}

export interface ChecklistCategory {
  id: string;
  name: string;
  description: string;
  items: AuditChecklistItem[];
}

// =============================================================================
// AUDIT TYPES
// =============================================================================

export type AuditType = 'initial' | 'renewal' | 'surprise' | 'follow-up';
export type AuditStatus = 'scheduled' | 'in_progress' | 'completed';
export type AuditFinalResult = 'passed' | 'failed' | 'conditional_pass';

export interface Audit {
  id: string;
  establishmentId: string;
  establishment: Establishment;
  auditorId: string;
  scheduledAt: string; // ISO 8601
  type: AuditType;
  status: AuditStatus;
  checklist: AuditChecklistItem[];
  overallRemarks?: string;
  finalResult?: AuditFinalResult;
  submittedAt?: string;
  createdAt: string;
}

export interface AuditSummary {
  totalPending: number;
  totalCompleted: number;
  upcomingThisWeek: number;
}

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export interface AppNotification {
  id: string;
  auditId: string;
  title: string;
  body: string;
  read: boolean;
  receivedAt: string; // ISO 8601
}

// =============================================================================
// AUDITOR PROFILE STATS
// =============================================================================

export interface AuditorStats {
  auditsThisMonth: number;
  auditsThisYear: number;
  totalAuditsCompleted: number;
  passRate: number;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
}

// =============================================================================
// UI STATE TYPES
// =============================================================================

export type TabValue = 'pending' | 'completed';

export interface BottomNavItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// =============================================================================
// OFFLINE / SYNC TYPES
// =============================================================================

export interface QueuedAction {
  id: string;
  type: 'audit_submit' | 'photo_upload';
  payload: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingActions: QueuedAction[];
}

// =============================================================================
// FCM NOTIFICATION PAYLOAD
// =============================================================================

export interface SubmitAuditPayload {
  checklist: Audit['checklist'];
  overallRemarks: string;
  finalResult: 'passed' | 'failed' | 'conditional_pass';
}

export interface FcmMessagePayload {
  notification: {
    title: string;
    body: string;
  };
  data: {
    auditId: string;
    type: 'new_audit' | 'audit_reminder' | 'audit_updated';
    [key: string]: string;
  };
}
