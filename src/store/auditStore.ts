/**
 * Zustand store for audit state
 * Manages audit list, current audit, submission flow
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Audit, AuditSummary, AuditChecklistItem, SubmitAuditPayload } from '@/types';
import {
  fetchAudits,
  fetchAuditById,
  startAudit,
  submitAudit,
  fetchAuditSummary,
  fetchAuditorStats,
  uploadChecklistPhoto,
} from '@/api/auditApi';

interface AuditState {
  // Data
  audits: Audit[];
  currentAudit: Audit | null;
  summary: AuditSummary;
  stats: {
    auditsThisMonth: number;
    auditsThisYear: number;
    totalAuditsCompleted: number;
    passRate: number;
  };

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  isRefreshing: boolean;
  error: string | null;
}

interface AuditActions {
  // Actions
  loadAudits: () => Promise<void>;
  loadAuditById: (auditId: string) => Promise<void>;
  loadSummary: () => Promise<void>;
  loadStats: () => Promise<void>;
  startAuditFlow: (auditId: string) => Promise<void>;
  submitAuditFlow: (auditId: string, payload: SubmitAuditPayload) => Promise<void>;
  updateChecklistItem: (
    itemId: string,
    updates: Partial<AuditChecklistItem>
  ) => void;
  addPhotoToChecklistItem: (itemId: string, photoUrl: string) => void;
  uploadPhoto: (auditId: string, itemId: string, file: File) => Promise<string>;
  setCurrentAudit: (audit: Audit | null) => void;
  setError: (error: string | null) => void;
  refreshAudits: () => Promise<void>;
  clearError: () => void;
}

type AuditStore = AuditState & AuditActions;

const initialState: AuditState = {
  audits: [],
  currentAudit: null,
  summary: {
    totalPending: 0,
    totalCompleted: 0,
    upcomingThisWeek: 0,
  },
  stats: {
    auditsThisMonth: 0,
    auditsThisYear: 0,
    totalAuditsCompleted: 0,
    passRate: 0,
  },
  isLoading: false,
  isSubmitting: false,
  isRefreshing: false,
  error: null,
};

export const useAuditStore = create<AuditStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      /**
       * Load all audits assigned to the auditor
       */
      loadAudits: async () => {
        set({ isLoading: true, error: null });
        try {
          const audits = await fetchAudits();
          set({ audits, isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to load audits';
          set({ isLoading: false, error: message });
        }
      },

      /**
       * Load a single audit by ID
       */
      loadAuditById: async (auditId: string) => {
        set({ isLoading: true, error: null });
        try {
          const audit = await fetchAuditById(auditId);
          set({ currentAudit: audit, isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to load audit';
          set({ isLoading: false, error: message });
        }
      },

      /**
       * Load dashboard summary
       */
      loadSummary: async () => {
        try {
          const summary = await fetchAuditSummary();
          set({ summary });
        } catch (error: unknown) {
          console.error('Failed to load summary:', error);
        }
      },

      /**
       * Load auditor statistics
       */
      loadStats: async () => {
        try {
          const stats = await fetchAuditorStats();
          set({ stats });
        } catch (error: unknown) {
          console.error('Failed to load stats:', error);
        }
      },

      /**
       * Start an audit (status: scheduled -> in_progress)
       */
      startAuditFlow: async (auditId: string) => {
        set({ isLoading: true, error: null });
        try {
          const updatedAudit = await startAudit(auditId);
          set((state) => ({
            currentAudit: updatedAudit,
            audits: state.audits.map((a) =>
              a.id === auditId ? updatedAudit : a
            ),
            isLoading: false,
          }));
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to start audit';
          set({ isLoading: false, error: message });
        }
      },

      /**
       * Submit a completed audit
       */
      submitAuditFlow: async (auditId: string, payload: SubmitAuditPayload) => {
        set({ isSubmitting: true, error: null });
        try {
          const updatedAudit = await submitAudit(auditId, payload);
          set((state) => ({
            currentAudit: updatedAudit,
            audits: state.audits.map((a) =>
              a.id === auditId ? updatedAudit : a
            ),
            summary: {
              ...state.summary,
              totalPending: Math.max(0, state.summary.totalPending - 1),
              totalCompleted: state.summary.totalCompleted + 1,
            },
            isSubmitting: false,
          }));
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to submit audit';
          set({ isSubmitting: false, error: message });
        }
      },

      /**
       * Update a checklist item in the current audit (local state only)
       */
      updateChecklistItem: (itemId: string, updates: Partial<AuditChecklistItem>) => {
        set((state) => {
          if (!state.currentAudit) return state;

          const updatedChecklist = state.currentAudit.checklist.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          );

          return {
            currentAudit: {
              ...state.currentAudit,
              checklist: updatedChecklist,
            },
          };
        });
      },

      /**
       * Add a photo URL to a checklist item
       */
      addPhotoToChecklistItem: (itemId: string, photoUrl: string) => {
        set((state) => {
          if (!state.currentAudit) return state;

          const updatedChecklist = state.currentAudit.checklist.map((item) =>
            item.id === itemId
              ? { ...item, photoUrls: [...(item.photoUrls || []), photoUrl] }
              : item
          );

          return {
            currentAudit: {
              ...state.currentAudit,
              checklist: updatedChecklist,
            },
          };
        });
      },

      /**
       * Upload a photo and add URL to checklist item
       */
      uploadPhoto: async (auditId: string, itemId: string, file: File) => {
        const { url } = await uploadChecklistPhoto(auditId, itemId, file);
        get().addPhotoToChecklistItem(itemId, url);
        return url;
      },

      /**
       * Set the currently viewed audit
       */
      setCurrentAudit: (audit: Audit | null) => {
        set({ currentAudit: audit });
      },

      /**
       * Set error state
       */
      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * Refresh audits (pull-to-refresh)
       */
      refreshAudits: async () => {
        set({ isRefreshing: true, error: null });
        try {
          const audits = await fetchAudits();
          const summary = await fetchAuditSummary();
          set({ audits, summary, isRefreshing: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to refresh';
          set({ isRefreshing: false, error: message });
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'AuditStore' }
  )
);
