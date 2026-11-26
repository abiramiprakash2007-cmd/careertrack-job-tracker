import { Calendar, Clock, MapPin, Pencil, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { JobApplication } from '../types/application';
import {
  formatDisplayDate,
  formatDisplayTime,
  getCompanyAvatarTone,
  getCompanyInitials,
} from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
}

export function ApplicationDetailModal({
  application,
  onClose,
  onEdit,
  onDelete,
}: ApplicationDetailModalProps) {
  useEffect(() => {
    if (!application) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [application, onClose]);

  if (!application) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="my-auto w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 bg-slate-50/70">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-display text-sm font-bold ${getCompanyAvatarTone(
                application.companyName
              )}`}
            >
              {getCompanyInitials(application.companyName)}
            </div>
            <div className="min-w-0">
              <h2
                id="detail-modal-title"
                className="font-display text-lg font-semibold text-slate-900 leading-snug"
              >
                {application.jobTitle}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-medium text-slate-900">{application.companyName}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {application.jobLocation}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors shrink-0"
            aria-label="Close application details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <StatusBadge status={application.status} />
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-mono tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                Applied {formatDisplayDate(application.applicationDate)}
              </span>
              {application.interviewDate && (
                <span className="inline-flex items-center gap-1.5 text-blue-700 font-medium">
                  <Clock className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  Interview {formatDisplayDate(application.interviewDate)}
                  {application.interviewTime ? ` · ${formatDisplayTime(application.interviewTime)}` : ''}
                </span>
              )}
            </div>
          </div>

          {application.interviewType && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 mb-1">Interview Stage</h3>
              <p className="text-sm font-medium text-slate-900">{application.interviewType}</p>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-1.5">Job Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {application.jobDescription || 'No job description saved.'}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-1.5">Personal Notes</h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {application.personalNotes || 'No personal notes added yet.'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50/50">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(application);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors whitespace-nowrap"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(application);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit Application</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
