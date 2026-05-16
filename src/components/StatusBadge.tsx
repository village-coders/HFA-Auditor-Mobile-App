/**
 * Status Badge Component
 * Displays audit status, final result, and audit type with consistent styling
 */

import type { AuditStatus, AuditType, AuditFinalResult } from '@/types';

interface StatusBadgeProps {
  status?: AuditStatus;
  type?: AuditType;
  finalResult?: AuditFinalResult;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, type, finalResult, size = 'sm' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  // Status variants
  if (status) {
    const statusStyles: Record<AuditStatus, string> = {
      scheduled: 'bg-blue-50 text-blue-700 border border-blue-200',
      in_progress: 'bg-amber-50 text-amber-700 border border-amber-200',
      completed: 'bg-green-50 text-green-700 border border-green-200',
    };

    const statusLabels: Record<AuditStatus, string> = {
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
    };

    return (
      <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${statusStyles[status]}`}>
        {status === 'in_progress' && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
        )}
        {statusLabels[status]}
      </span>
    );
  }

  // Audit type variants
  if (type) {
    const typeStyles: Record<AuditType, string> = {
      initial: 'bg-purple-50 text-purple-700 border border-purple-200',
      renewal: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      surprise: 'bg-rose-50 text-rose-700 border border-rose-200',
      'follow-up': 'bg-sky-50 text-sky-700 border border-sky-200',
    };

    const typeLabels: Record<AuditType, string> = {
      initial: 'Initial Certification',
      renewal: 'Renewal',
      surprise: 'Surprise Visit',
      'follow-up': 'Follow-Up',
    };

    return (
      <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${typeStyles[type]}`}>
        {typeLabels[type]}
      </span>
    );
  }

  // Final result variants
  if (finalResult) {
    const resultStyles: Record<AuditFinalResult, string> = {
      passed: 'bg-green-50 text-green-700 border border-green-200',
      failed: 'bg-red-50 text-red-700 border border-red-200',
      conditional_pass: 'bg-amber-50 text-amber-700 border border-amber-200',
    };

    const resultLabels: Record<AuditFinalResult, string> = {
      passed: 'Passed',
      failed: 'Failed',
      conditional_pass: 'Conditional Pass',
    };

    return (
      <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${resultStyles[finalResult]}`}>
        {finalResult === 'passed' && (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {finalResult === 'failed' && (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
        {resultLabels[finalResult]}
      </span>
    );
  }

  return null;
}
