/**
 * Audit List Screen
 * Tabbed interface: Pending/Upcoming and Completed
 * Pull-to-refresh, empty states, audit cards
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useAuditStore } from '@/store/auditStore';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { PullToRefresh } from '@/components/PullToRefresh';
import { formatAuditDate, formatTime, toDate } from '@/utils/dateHelpers';
import type { Audit } from '@/types';

type TabValue = 'pending' | 'completed';

export function AuditListScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const { loadAudits, refreshAudits, audits, isLoading, isRefreshing, error } = useAuditStore();

  useEffect(() => {
    loadAudits();
  }, [loadAudits]);

  const pendingAudits = audits
    .filter((a) => a.status === 'scheduled' || a.status === 'in_progress')
    .sort((a, b) => toDate(a.scheduledAt).getTime() - toDate(b.scheduledAt).getTime());

  const completedAudits = audits
    .filter((a) => a.status === 'completed')
    .sort((a, b) => toDate(b.submittedAt || b.scheduledAt).getTime() - toDate(a.submittedAt || a.scheduledAt).getTime());

  const displayedAudits = activeTab === 'pending' ? pendingAudits : completedAudits;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-0 border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Audits</h1>

        {/* Tabs */}
        <div className="flex gap-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 pb-3 text-sm font-medium text-center transition-colors relative ${
              activeTab === 'pending' ? 'text-[#1A7A4A]' : 'text-gray-400'
            }`}
          >
            Pending
            {pendingAudits.length > 0 && (
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5 min-w-[20px] inline-block">
                {pendingAudits.length}
              </span>
            )}
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A7A4A] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 pb-3 text-sm font-medium text-center transition-colors relative ${
              activeTab === 'completed' ? 'text-[#1A7A4A]' : 'text-gray-400'
            }`}
          >
            Completed
            {activeTab === 'completed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A7A4A] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {isLoading ? (
          <SkeletonCard variant="audit" count={3} />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-8">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={loadAudits}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <PullToRefresh onRefresh={refreshAudits} isRefreshing={isRefreshing}>
            {displayedAudits.length === 0 ? (
              <EmptyState variant={activeTab === 'pending' ? 'pending' : 'completed'} />
            ) : (
              <div className="space-y-3 pb-4">
                {displayedAudits.map((audit) => (
                  <AuditCard key={audit.id} audit={audit} onClick={() => navigate(`/audits/${audit.id}`)} />
                ))}
              </div>
            )}
          </PullToRefresh>
        )}
      </div>
    </div>
  );
}

/**
 * Individual Audit Card
 */
interface AuditCardProps {
  audit: Audit;
  onClick: () => void;
}

function AuditCard({ audit, onClick }: AuditCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-[15px] truncate">
            {audit.establishment.name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{audit.establishment.address}</span>
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" />
      </div>

      <div className="flex items-center gap-3 mt-2.5">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{formatAuditDate(audit.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>{formatTime(audit.scheduledAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <StatusBadge type={audit.type} size="sm" />
          {audit.status === 'completed' && audit.finalResult && (
            <StatusBadge finalResult={audit.finalResult} size="sm" />
          )}
          {audit.status !== 'completed' && <StatusBadge status={audit.status} size="sm" />}
        </div>
      </div>
    </button>
  );
}
