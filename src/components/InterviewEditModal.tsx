import { Calendar, Clock, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { ApplicationStatus, JobApplication } from '../types/application';
import { STATUS_ORDER } from '../utils/formatters';

interface InterviewEditModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onSave: (
    id: string,
    updates: {
      interviewDate: string;
      interviewTime: string;
      interviewType: string;
      status: ApplicationStatus;
      personalNotes: string;
    }
  ) => void;
}

export function InterviewEditModal({
  application,
  onClose,
  onSave,
}: InterviewEditModalProps) {
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Interviewing');
  const [personalNotes, setPersonalNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (application) {
      setInterviewDate(application.interviewDate);
      setInterviewTime(application.interviewTime);
      setInterviewType(application.interviewType);
      setStatus(application.status);
      setPersonalNotes(application.personalNotes);
      setError('');
    }
  }, [application]);

  useEffect(() => {
    if (!application) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [application, onClose]);

  if (!application) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (interviewTime && !interviewDate) {
      setError('Please select an interview date alongside the interview time.');
      return;
    }

    onSave(application.id, {
      interviewDate,
      interviewTime,
      interviewType: interviewType.trim(),
      status,
      personalNotes: personalNotes.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interview-modal-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="min-w-0">
            <h2
              id="interview-modal-title"
              className="font-display text-base font-semibold text-slate-900 truncate"
            >
              Edit Interview Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {application.companyName} · {application.jobTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors"
            aria-label="Close interview editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-interview-date"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5"
              >
                <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span>Interview Date</span>
              </label>
              <input
                id="edit-interview-date"
                type="date"
                value={interviewDate}
                onChange={(e) => {
                  setInterviewDate(e.target.value);
                  if (error) setError('');
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label
                htmlFor="edit-interview-time"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5"
              >
                <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span>Interview Time</span>
              </label>
              <input
                id="edit-interview-time"
                type="time"
                value={interviewTime}
                onChange={(e) => {
                  setInterviewTime(e.target.value);
                  if (error) setError('');
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-interview-type"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Interview Stage / Format
              </label>
              <input
                id="edit-interview-type"
                type="text"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                placeholder="e.g. Technical Screen"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label
                htmlFor="edit-interview-status"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Application Status
              </label>
              <select
                id="edit-interview-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-interview-notes"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Preparation & Notes
            </label>
            <textarea
              id="edit-interview-notes"
              rows={3}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Interviewer names, topics to revise, meeting link reminders..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-y"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setInterviewDate('');
                setInterviewTime('');
              }}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
            >
              Clear date & time
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Update Interview
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
