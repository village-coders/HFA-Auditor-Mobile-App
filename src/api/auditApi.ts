/**
 * Audit API functions
 * Abstracted API calls for audit operations
 * TODO: Replace mock implementations with real API calls when backend is ready
 */

import { apiClient, getErrorMessage } from './client';
import type { Audit, AuditSummary } from '@/types';
import type { SubmitAuditPayload } from '@/types';
import { mockAudits, mockAuditorStats } from '@/utils/mockData';

// Toggle this to switch between mock and real API
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Simulated network delay for mock responses (ms)
const MOCK_DELAY = 600;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all audits assigned to the current auditor
 */
export const fetchAudits = async (): Promise<Audit[]> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return [...mockAudits];
  }

  try {
    const response = await apiClient.get<Audit[]>('/audits/my-assignments');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch audits:', getErrorMessage(error));
    throw error;
  }
};

/**
 * Fetch a single audit by ID
 */
export const fetchAuditById = async (auditId: string): Promise<Audit> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    const audit = mockAudits.find(a => a.id === auditId);
    if (!audit) throw new Error('Audit not found');
    return { ...audit };
  }

  try {
    const response = await apiClient.get<Audit>(`/audits/${auditId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch audit:', getErrorMessage(error));
    throw error;
  }
};

/**
 * Update audit status (e.g., scheduled -> in_progress)
 */
export const updateAuditStatus = async (
  auditId: string,
  status: Audit['status']
): Promise<Audit> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    const auditIndex = mockAudits.findIndex(a => a.id === auditId);
    if (auditIndex === -1) throw new Error('Audit not found');
    mockAudits[auditIndex] = { ...mockAudits[auditIndex], status };
    return { ...mockAudits[auditIndex] };
  }

  try {
    const response = await apiClient.patch<Audit>(`/audits/${auditId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Failed to update audit status:', getErrorMessage(error));
    throw error;
  }
};

/**
 * Start an audit (change status from scheduled to in_progress)
 */
export const startAudit = async (auditId: string): Promise<Audit> => {
  return updateAuditStatus(auditId, 'in_progress');
};

/**
 * Submit a completed audit with checklist results and final determination
 */

export const submitAudit = async (
  auditId: string,
  payload: SubmitAuditPayload
): Promise<Audit> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY * 2); // Longer delay for submission
    const auditIndex = mockAudits.findIndex(a => a.id === auditId);
    if (auditIndex === -1) throw new Error('Audit not found');

    mockAudits[auditIndex] = {
      ...mockAudits[auditIndex],
      checklist: payload.checklist,
      overallRemarks: payload.overallRemarks,
      finalResult: payload.finalResult,
      status: 'completed',
      submittedAt: new Date().toISOString(),
    };

    return { ...mockAudits[auditIndex] };
  }

  try {
    const response = await apiClient.post<Audit>(`/audits/${auditId}/submit`, payload);
    return response.data;
  } catch (error) {
    console.error('Failed to submit audit:', getErrorMessage(error));
    throw error;
  }
};

/**
 * Upload a photo for a checklist item
 * TODO: Replace with real file upload API when backend is ready
 */
export const uploadChecklistPhoto = async (
  _auditId: string,
  _checklistItemId: string,
  _file: File
): Promise<{ url: string }> => {
  if (USE_MOCK) {
    await delay(1500);
    // Return a mock photo URL (using a placeholder)
    return {
      url: `https://picsum.photos/seed/${Date.now()}/400/300`,
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', _file);
    const response = await apiClient.post<{ url: string }>(
      `/audits/${_auditId}/checklist/${_checklistItemId}/photo`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to upload photo:', getErrorMessage(error));
    throw error;
  }
};

/**
 * Get audit summary for dashboard
 */
export const fetchAuditSummary = async (): Promise<AuditSummary> => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 86400000);

    const pending = mockAudits.filter(a => a.status === 'scheduled' || a.status === 'in_progress');
    const completed = mockAudits.filter(a => a.status === 'completed');
    const thisWeek = mockAudits.filter(a => {
      const scheduled = new Date(a.scheduledAt);
      return scheduled >= now && scheduled <= weekFromNow;
    });

    return {
      totalPending: pending.length,
      totalCompleted: completed.length,
      upcomingThisWeek: thisWeek.length,
    };
  }

  try {
    const response = await apiClient.get<AuditSummary>('/audits/summary');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch audit summary:', getErrorMessage(error));
    throw error;
  }
};

/**
 * Get auditor statistics for profile screen
 */
export const fetchAuditorStats = async () => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return { ...mockAuditorStats };
  }

  try {
    const response = await apiClient.get('/auditors/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch auditor stats:', getErrorMessage(error));
    throw error;
  }
};
