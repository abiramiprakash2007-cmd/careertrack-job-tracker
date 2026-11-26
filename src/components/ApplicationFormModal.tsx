import { X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import {
  ApplicationFormValues,
  ApplicationStatus,
  JobApplication,
} from '../types/application';
import { getTodayISO, STATUS_ORDER } from '../utils/formatters';

interface ApplicationFormModalProps {
  open: boolean;
  editingApplication: JobApplication | null;
  onClose: () => void;
  onSubmit: (values: ApplicationFormValues) => void;
}

interface FormErrors {
  companyName?: string;
  jobTitle?: string;
  jobLocation?: string;
  applicationDate?: string;
  interviewTime?: string;
}

function getInitialValues(app: JobApplication | null): ApplicationFormValues {
  if (app) {
    return {
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      jobLocation: app.jobLocation,
      applicationDate: app.applicationDate,
      interviewDate: app.interviewDate,
      interviewTime: app.interviewTime,
      interviewType: app.interviewType,
      status: app.status,
      jobDescription: app.jobDescription,
      personalNotes: app.personalNotes,
    };
  }
  return {
    companyName: '',
    jobTitle: '',
    jobLocation: '',
    applicationDate: getTodayISO(),
    interviewDate: '',
    interviewTime: '',
    interviewType: '',
    status: 'Applied',
    jobDescription: '',
    personalNotes: '',
  };
}

export function ApplicationFormModal({
  open,
  editingApplication,
  onClose,
  onSubmit,
}: ApplicationFormModalProps) {
  const [values, setValues] = useState<ApplicationFormValues>(() =>
    getInitialValues(editingApplication)
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setValues(getInitialValues(editingApplication));
      setErrors({});
    }
  }, [open, editingApplication]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!values.companyName.trim()) {
      nextErrors.companyName = 'Company name is required.';
    }
    if (!values.jobTitle.trim()) {
      nextErrors.jobTitle = 'Job title is required.';
    }
    if (!values.jobLocation.trim()) {
      nextErrors.jobLocation = 'Job location is required.';
    }
    if (!values.applicationDate) {
      nextErrors.applicationDate = 'Application date is required.';
    }
    if (values.interviewTime && !values.interviewDate) {
      nextErrors.interviewTime = 'Select an interview date if specifying a time.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ...values,
      companyName: values.companyName.trim(),
      jobTitle: values.jobTitle.trim(),
      jobLocation: values.jobLocation.trim(),
      interviewType: values.interviewType.trim(),
      jobDescription: values.jobDescription.trim(),
      personalNotes: values.personalNotes.trim(),
    });
  };

  const handleStatusChange = (nextStatus: ApplicationStatus) => {
    setValues((prev) => ({ ...prev, status: nextStatus }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-form-title"
    >
      <div className="my-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/60">
          <div>
            <h2
              id="app-form-title"
              className="font-display text-lg font-semibold text-slate-900"
            >
              {editingApplication ? 'Edit Application' : 'Add New Application'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {editingApplication
                ? 'Update application status, interview schedule, and personal notes.'
                : 'Log a new role or internship into your CareerTrack pipeline.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="max-h-[80vh] overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Company Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={values.companyName}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, companyName: e.target.value }));
                  if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: undefined }));
                }}
                placeholder="e.g. Stripe, Linear, Google"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.companyName
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/20'
                }`}
              />
              {errors.companyName && (
                <p className="mt-1 text-xs text-rose-600">{errors.companyName}</p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label
                htmlFor="jobTitle"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Job Title <span className="text-rose-600">*</span>
              </label>
              <input
                id="jobTitle"
                type="text"
                value={values.jobTitle}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, jobTitle: e.target.value }));
                  if (errors.jobTitle) setErrors((prev) => ({ ...prev, jobTitle: undefined }));
                }}
                placeholder="e.g. Software Engineer Intern"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.jobTitle
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/20'
                }`}
              />
              {errors.jobTitle && (
                <p className="mt-1 text-xs text-rose-600">{errors.jobTitle}</p>
              )}
            </div>

            {/* Job Location */}
            <div>
              <label
                htmlFor="jobLocation"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Job Location <span className="text-rose-600">*</span>
              </label>
              <input
                id="jobLocation"
                type="text"
                value={values.jobLocation}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, jobLocation: e.target.value }));
                  if (errors.jobLocation) setErrors((prev) => ({ ...prev, jobLocation: undefined }));
                }}
                placeholder="e.g. San Francisco, CA or Remote"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.jobLocation
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/20'
                }`}
              />
              {errors.jobLocation && (
                <p className="mt-1 text-xs text-rose-600">{errors.jobLocation}</p>
              )}
            </div>

            {/* Application Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Application Status <span className="text-rose-600">*</span>
              </label>
              <select
                id="status"
                value={values.status}
                onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                {STATUS_ORDER.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Interview Schedule */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-4">
            <h3 className="text-xs font-semibold text-slate-700">
              Timeline & Interview Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="applicationDate"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Application Date <span className="text-rose-600">*</span>
                </label>
                <input
                  id="applicationDate"
                  type="date"
                  value={values.applicationDate}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, applicationDate: e.target.value }));
                    if (errors.applicationDate) {
                      setErrors((prev) => ({ ...prev, applicationDate: undefined }));
                    }
                  }}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${
                    errors.applicationDate
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/20'
                  }`}
                />
                {errors.applicationDate && (
                  <p className="mt-1 text-xs text-rose-600">{errors.applicationDate}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="interviewDate"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Interview Date
                </label>
                <input
                  id="interviewDate"
                  type="date"
                  value={values.interviewDate}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, interviewDate: e.target.value }));
                    if (errors.interviewTime) {
                      setErrors((prev) => ({ ...prev, interviewTime: undefined }));
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label
                  htmlFor="interviewTime"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Interview Time
                </label>
                <input
                  id="interviewTime"
                  type="time"
                  value={values.interviewTime}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, interviewTime: e.target.value }));
                    if (errors.interviewTime) {
                      setErrors((prev) => ({ ...prev, interviewTime: undefined }));
                    }
                  }}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${
                    errors.interviewTime
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/20'
                  }`}
                />
                {errors.interviewTime && (
                  <p className="mt-1 text-xs text-rose-600">{errors.interviewTime}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="interviewType"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Interview Round / Stage (Optional)
              </label>
              <input
                id="interviewType"
                type="text"
                value={values.interviewType}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, interviewType: e.target.value }))
                }
                placeholder="e.g. Technical Phone Screen, System Design Loop, Final Behavioral"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label
              htmlFor="jobDescription"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Job Description
            </label>
            <textarea
              id="jobDescription"
              rows={3}
              value={values.jobDescription}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, jobDescription: e.target.value }))
              }
              placeholder="Paste key responsibilities, required tech stack, or role highlights..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-y"
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label
              htmlFor="personalNotes"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Personal Notes
            </label>
            <textarea
              id="personalNotes"
              rows={3}
              value={values.personalNotes}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, personalNotes: e.target.value }))
              }
              placeholder="Referral contacts, prep topics, recruiter feedback, or follow-up reminders..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              {editingApplication ? 'Save Changes' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
