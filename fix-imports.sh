#!/bin/bash

# Fix type-only imports for files with verbatimModuleSyntax

# api/client.ts
sed -i "s/import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';/import axios, { AxiosError } from 'axios';\nimport type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';/" src/api/client.ts

# api/auditApi.ts
sed -i "s/import { Audit, AuditSummary } from '@\/types';/import type { Audit, AuditSummary } from '@\/types';\nimport type { SubmitAuditPayload } from '@\/types';/" src/api/auditApi.ts

# Remove SubmitAuditPayload interface since it's now in types
sed -i '/export interface SubmitAuditPayload/,/}/d' src/api/auditApi.ts

# api/authApi.ts
sed -i "s/import { LoginCredentials, AuthTokens, Auditor } from '@\/types';/import type { LoginCredentials, AuthTokens, Auditor } from '@\/types';/" src/api/authApi.ts

# api/firebase.ts
sed -i "s/import { initializeApp, FirebaseApp } from 'firebase\/app';/import { initializeApp } from 'firebase\/app';\nimport type { FirebaseApp } from 'firebase\/app';/" src/api/firebase.ts
sed -i "s/import { getMessaging, getToken, onMessage, Messaging } from 'firebase\/messaging';/import { getMessaging, getToken, onMessage } from 'firebase\/messaging';\nimport type { Messaging } from 'firebase\/messaging';/" src/api/firebase.ts

# api/notificationApi.ts
sed -i "s/import { AppNotification } from '@\/types';/import type { AppNotification } from '@\/types';/" src/api/notificationApi.ts

# components/PullToRefresh.tsx
sed -i "s/import { useState, useRef, useCallback, ReactNode } from 'react';/import { useState, useRef, useCallback } from 'react';\nimport type { ReactNode } from 'react';/" src/components/PullToRefresh.tsx

# components/StatusBadge.tsx
sed -i "s/import { AuditStatus, AuditType, AuditFinalResult } from '@\/types';/import type { AuditStatus, AuditType, AuditFinalResult } from '@\/types';/" src/components/StatusBadge.tsx

# store/auditStore.ts
sed -i "s/import { Audit, AuditSummary, AuditChecklistItem, SubmitAuditPayload } from '@\/types';/import type { Audit, AuditSummary, AuditChecklistItem, SubmitAuditPayload } from '@\/types';/" src/store/auditStore.ts

# store/authStore.ts
sed -i "s/import { AuthState, LoginCredentials, Auditor, AuthTokens } from '@\/types';/import type { AuthState, LoginCredentials, Auditor } from '@\/types';/" src/store/authStore.ts

# store/notificationStore.ts
sed -i "s/import { AppNotification } from '@\/types';/import type { AppNotification } from '@\/types';/" src/store/notificationStore.ts

# utils/dateHelpers.ts
sed -i "s/import {\n  format,\n  formatDistanceToNow,\n  parseISO,\n  isToday,\n  isTomorrow,\n  isYesterday,\n  isThisWeek,\n  isPast,\n  isFuture,\n  addDays,\n  startOfWeek,\n  endOfWeek,\n} from 'date-fns';/import {\n  format,\n  formatDistanceToNow,\n  parseISO,\n  isToday,\n  isTomorrow,\n  isYesterday,\n  isThisWeek,\n  isPast,\n  startOfWeek,\n  endOfWeek,\n} from 'date-fns';/" src/utils/dateHelpers.ts

# utils/mockData.ts
sed -i "s/import { Audit, AppNotification, Establishment, Auditor, AuditChecklistItem } from '@\/types';/import type { Audit, AppNotification, Establishment, Auditor, AuditChecklistItem } from '@\/types';/" src/utils/mockData.ts

echo "Type imports fixed!"
