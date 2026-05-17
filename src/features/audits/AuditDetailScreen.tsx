/**
 * Audit Detail Screen
 * Shows audit details based on status:
 * - scheduled: view details, start audit
 * - in_progress: fill checklist, upload photos, submit
 * - completed: read-only view with submitted data
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, User, Calendar, Clock, ChevronLeft,
  ExternalLink, Loader2,
  AlertTriangle, CheckCircle2, XCircle, AlertCircle,
  FileText, Send
} from 'lucide-react';
import { useAuditStore } from '@/store/auditStore';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard } from '@/components/SkeletonCard';
import {
  formatAuditDateLong, formatTime
} from '@/utils/dateHelpers';
import type { Audit } from '@/types';

export function AuditDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const {
    currentAudit, loadAuditById, startAuditFlow, submitAuditFlow,
    isLoading, isSubmitting, error
  } = useAuditStore();

  // Local state for overall remarks and final result (in-progress only)
  const [overallRemarks, setOverallRemarks] = useState('');
  const [finalResult, setFinalResult] = useState<'passed' | 'failed' | 'conditional_pass' | null>(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (id) {
      loadAuditById(id);
    }
  }, [id, loadAuditById]);

  // Sync local state when audit loads
  useEffect(() => {
    if (currentAudit?.overallRemarks) {
      setOverallRemarks(currentAudit.overallRemarks);
    }
    if (currentAudit?.finalResult) {
      setFinalResult(currentAudit.finalResult);
    }
  }, [currentAudit?.overallRemarks, currentAudit?.finalResult]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="px-4 pt-4">
          <SkeletonCard variant="audit" count={1} />
        </div>
      </div>
    );
  }

  if (error || !currentAudit) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-gray-700 font-medium mb-2">Could not load audit</p>
        <p className="text-gray-500 text-sm mb-4 text-center">{error || 'Audit not found'}</p>
        <button
          onClick={() => navigate('/audits')}
          className="bg-[#1A7A4A] text-white px-5 py-2.5 rounded-xl font-medium text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const audit = currentAudit;

  const handleStartAudit = async () => {
    if (!id) return;
    await startAuditFlow(id);
  };

  const handleSubmit = async () => {
    if (!finalResult) {
      setSubmitError('Please select a final result before submitting.');
      return;
    }
    setSubmitError('');

    if (!id) return;
    await submitAuditFlow(id, {
      overallRemarks,
      finalResult,
    });
    setShowSubmitModal(false);
  };

  // Google Maps deep link
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${audit.establishment.latitude},${audit.establishment.longitude}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-5 border-b border-gray-100">
        <button
          onClick={() => navigate('/audits')}
          className="flex items-center gap-1 text-gray-500 mb-4 active:opacity-60 w-fit"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {audit.establishment.name}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{audit.establishment.address}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <StatusBadge type={audit.type} size="sm" />
          <StatusBadge status={audit.status} size="sm" />
          {audit.finalResult && <StatusBadge finalResult={audit.finalResult} size="sm" />}
        </div>
      </div>

      {/* Contact Info Card */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Contact Information</h3>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{audit.establishment.contactPerson}</p>
              <p className="text-xs text-gray-500">Contact Person</p>
            </div>
          </div>
          <a
            href={`tel:${audit.establishment.contactPhone}`}
            className="flex items-center gap-3 active:opacity-60"
          >
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-[#1A7A4A]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{audit.establishment.contactPhone}</p>
              <p className="text-xs text-gray-500">Tap to call</p>
            </div>
          </a>
        </div>
      </div>

      {/* Schedule Card */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Schedule</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {formatAuditDateLong(audit.scheduledAt)}
              </p>
              <p className="text-xs text-gray-500">Scheduled Date</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{formatTime(audit.scheduledAt)}</p>
              <p className="text-xs text-gray-500">Time</p>
            </div>
          </div>

          {/* Open in Maps */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-4 py-2.5 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 active:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* Scheduled View - Start Audit Button */}
      {audit.status === 'scheduled' && (
        <div className="px-4 mt-6">
          <button
            onClick={handleStartAudit}
            disabled={isLoading}
            className="w-full h-14 bg-[#1A7A4A] text-white font-semibold rounded-xl
              active:scale-[0.98] transition-transform shadow-md
              disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting...
              </>
            ) : (
              'Start Audit'
            )}
          </button>
        </div>
      )}

      {/* In Progress - Remarks and Determination */}
      {audit.status === 'in_progress' && (
        <>
          {/* Overall Remarks */}
          <div className="px-4 mt-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Overall Remarks</h3>
              <textarea
                value={overallRemarks}
                onChange={(e) => setOverallRemarks(e.target.value)}
                placeholder="Enter your overall assessment and any recommendations..."
                className="w-full h-28 p-3 rounded-lg border border-gray-300 text-sm text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent resize-none
                  placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Final Result */}
          <div className="px-4 mt-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Final Result</h3>
              <div className="grid grid-cols-3 gap-2">
                <ResultOption
                  value="passed"
                  label="Pass"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  selected={finalResult === 'passed'}
                  onSelect={setFinalResult}
                  color="green"
                />
                <ResultOption
                  value="failed"
                  label="Fail"
                  icon={<XCircle className="w-5 h-5" />}
                  selected={finalResult === 'failed'}
                  onSelect={setFinalResult}
                  color="red"
                />
                <ResultOption
                  value="conditional_pass"
                  label="Conditional"
                  icon={<AlertCircle className="w-5 h-5" />}
                  selected={finalResult === 'conditional_pass'}
                  onSelect={setFinalResult}
                  color="amber"
                />
              </div>
              {submitError && (
                <p className="text-xs text-red-600 mt-2">{submitError}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-4 mt-6">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full h-14 bg-[#1A7A4A] text-white font-semibold rounded-xl
                active:scale-[0.98] transition-transform shadow-md
                flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Audit
            </button>
          </div>
        </>
      )}

      {/* Completed View - Read Only */}
      {audit.status === 'completed' && <CompletedAuditView audit={audit} />}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSubmitModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Submit Audit?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Once submitted, the audit result cannot be changed. Are you sure you want to submit?
            </p>
            {submitError && (
              <p className="text-xs text-red-600 mb-4">{submitError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 h-12 bg-gray-100 text-gray-700 font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-12 bg-[#1A7A4A] text-white font-semibold rounded-xl
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Result Option Button
 */
interface ResultOptionProps {
  value: 'passed' | 'failed' | 'conditional_pass';
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: (v: 'passed' | 'failed' | 'conditional_pass') => void;
  color: 'green' | 'red' | 'amber';
}

function ResultOption({ value, label, icon, selected, onSelect, color }: ResultOptionProps) {
  const colorStyles = {
    green: selected ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white border-gray-200 text-gray-500',
    red: selected ? 'bg-red-50 border-red-400 text-red-700' : 'bg-white border-gray-200 text-gray-500',
    amber: selected ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-gray-200 text-gray-500',
  };

  return (
    <button
      onClick={() => onSelect(value)}
      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all ${colorStyles[color]}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

/**
 * Completed Audit View (read-only)
 */
function CompletedAuditView({ audit }: { audit: Audit }) {
  return (
    <>
      {/* Overall Remarks */}
      {audit.overallRemarks && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Overall Remarks</h3>
            <p className="text-sm text-gray-600">{audit.overallRemarks}</p>
          </div>
        </div>
      )}

      {/* Final Result */}
      {audit.finalResult && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Final Result</h3>
            <StatusBadge finalResult={audit.finalResult} size="md" />
          </div>
        </div>
      )}

      {/* Submitted At */}
      {audit.submittedAt && (
        <div className="px-4 mt-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">
              Submitted on {new Date(audit.submittedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      )}

      {/* Print / Share Button */}
      <div className="px-4 mt-6">
        <button
          onClick={() => window.print()}
          className="w-full h-12 bg-gray-100 text-gray-700 font-medium rounded-xl
            active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>
    </>
  );
}
