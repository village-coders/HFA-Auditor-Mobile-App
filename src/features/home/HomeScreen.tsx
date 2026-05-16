/**
 * Home / Dashboard Screen
 * Personalised greeting, summary cards, next audit highlight
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ClipboardCheck, Calendar, MapPin, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuditStore } from '@/store/auditStore';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard } from '@/components/SkeletonCard';
import { getGreeting, formatAuditDate, formatTime, toDate } from '@/utils/dateHelpers';

export function HomeScreen() {
  const navigate = useNavigate();
  const auditor = useAuthStore((s) => s.auditor);
  const { loadAudits, loadSummary, audits, summary, isLoading, error } = useAuditStore();

  useEffect(() => {
    loadAudits();
    loadSummary();
  }, [loadAudits, loadSummary]);

  // Find the most imminent pending audit
  const nextAudit = audits
    .filter((a) => a.status === 'scheduled' || a.status === 'in_progress')
    .sort((a, b) => toDate(a.scheduledAt).getTime() - toDate(b.scheduledAt).getTime())[0];

  const isOverdue = nextAudit
    ? toDate(nextAudit.scheduledAt) < new Date() && nextAudit.status !== 'in_progress'
    : false;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#1A7A4A] px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-green-100 text-sm">
              {getGreeting()}
            </p>
            <h1 className="text-white text-xl font-bold mt-0.5">
              {auditor?.name || 'Auditor'}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold text-sm">
            {(auditor?.name || 'A').charAt(0)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-4">
        {/* Summary Cards */}
        {isLoading ? (
          <SkeletonCard variant="summary" count={3} />
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {/* Pending Audits */}
            <button
              onClick={() => navigate('/audits')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.totalPending}</p>
              <p className="text-xs text-gray-500 mt-0.5">Pending</p>
            </button>

            {/* Completed Audits */}
            <button
              onClick={() => navigate('/audits?tab=completed')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <ClipboardCheck className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.totalCompleted}</p>
              <p className="text-xs text-gray-500 mt-0.5">Completed</p>
            </button>

            {/* Upcoming This Week */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.upcomingThisWeek}</p>
              <p className="text-xs text-gray-500 mt-0.5">This Week</p>
            </div>
          </div>
        )}

        {/* Next Audit Highlight Card */}
        {isLoading ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => { loadAudits(); loadSummary(); }}
              className="mt-2 text-sm text-red-700 font-medium underline"
            >
              Retry
            </button>
          </div>
        ) : nextAudit ? (
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 px-1">Next Audit</h2>
            <button
              onClick={() => navigate(`/audits/${nextAudit.id}`)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
            >
              {isOverdue && (
                <div className="flex items-center gap-1.5 mb-2 bg-red-50 rounded-lg px-2.5 py-1.5 w-fit">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-medium text-red-600">Overdue</span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base truncate">
                    {nextAudit.establishment.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{nextAudit.establishment.address}</span>
                  </p>
                </div>
                <StatusBadge status={nextAudit.status} size="sm" />
              </div>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formatAuditDate(nextAudit.scheduledAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{formatTime(nextAudit.scheduledAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <StatusBadge type={nextAudit.type} size="sm" />
                <span className="text-[#1A7A4A] text-sm font-medium flex items-center gap-1">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No upcoming audits</p>
          </div>
        )}
      </div>
    </div>
  );
}
