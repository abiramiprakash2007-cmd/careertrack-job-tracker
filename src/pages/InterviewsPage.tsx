import { Calendar, Clock, MapPin, Pencil, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { JobApplication } from '../types/application';
import {
  formatDisplayDate,
  formatDisplayTime,
  getCompanyAvatarTone,
  getCompanyInitials,
  getTodayISO,
  isInterviewScheduled,
} from '../utils/formatters';

interface InterviewsPageProps {
  applications: JobApplication[];
  onEditInterview: (app: JobApplication) => void;
  onOpenAddModal: () => void;
}

type InterviewFilter = 'all' | 'upcoming' | 'past';

export function InterviewsPage({
  applications,
  onEditInterview,
  onOpenAddModal,
}: InterviewsPageProps) {
  const [filter, setFilter] = useState<InterviewFilter>('all');
  const todayISO = getTodayISO();

  const interviewApps = useMemo(() => {
    return applications
      .filter((app) => isInterviewScheduled(app))
      .sort((a, b) => {
        if (!a.interviewDate && !b.interviewDate) return 0;
        if (!a.interviewDate) return 1;
        if (!b.interviewDate) return -1;
        return a.interviewDate.localeCompare(b.interviewDate);
      });
  }, [applications]);

  const unscheduledApps = useMemo(() => {
    return applications.filter(
      (app) => !isInterviewScheduled(app) && app.status !== 'Rejected'
    );
  }, [applications]);

  const upcomingCount = interviewApps.filter(
    (app) => !app.interviewDate || app.interviewDate >= todayISO
  ).length;
  const pastCount = interviewApps.filter(
    (app) => Boolean(app.interviewDate) && app.interviewDate < todayISO
  ).length;

  const visibleInterviews = useMemo(() => {
    if (filter === 'upcoming') {
      return interviewApps.filter(
        (app) => !app.interviewDate || app.interviewDate >= todayISO
      );
    }
    if (filter === 'past') {
      return interviewApps.filter(
        (app) => Boolean(app.interviewDate) && app.interviewDate < todayISO
      );
    }
    return interviewApps;
  }, [interviewApps, filter, todayISO]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Interviews
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review scheduled interview rounds, dates, times, and preparation notes.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Summary & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Filter interviews">
          {(
            [
              { id: 'all', label: 'All Scheduled', count: interviewApps.length },
              { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
              { id: 'past', label: 'Completed / Past', count: pastCount },
            ] as const
          ).map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#0B1528] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`font-mono tabular-nums ${
                    active ? 'text-blue-300' : 'text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {unscheduledApps.length > 0 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="quick-schedule-select"
              className="text-xs font-medium text-slate-500 whitespace-nowrap"
            >
              Schedule existing:
            </label>
            <select
              id="quick-schedule-select"
              defaultValue=""
              onChange={(e) => {
                const selected = applications.find((a) => a.id === e.target.value);
                if (selected) {
                  onEditInterview(selected);
                  e.target.value = '';
                }
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 max-w-[220px]"
            >
              <option value="" disabled>
                Choose application...
              </option>
              {unscheduledApps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.jobTitle}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Scheduled Interviews List */}
      {visibleInterviews.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">
            {interviewApps.length === 0
              ? 'No interviews scheduled yet'
              : 'No interviews in this timeframe'}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            {interviewApps.length === 0
              ? 'When you set an interview date on an application or mark its status as Interviewing, it will appear here.'
              : 'Switch to All Scheduled to review your full interview timeline.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleInterviews.map((app) => {
            const isPast = Boolean(app.interviewDate) && app.interviewDate < todayISO;

            return (
              <article
                key={app.id}
                className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-display text-xs font-bold ${getCompanyAvatarTone(
                          app.companyName
                        )}`}
                      >
                        {getCompanyInitials(app.companyName)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-display text-base font-semibold text-slate-900 truncate">
                          {app.companyName}
                        </h2>
                        <p className="text-sm text-slate-700 truncate">{app.jobTitle}</p>
                      </div>
                    </div>

                    <StatusBadge status={app.status} compact />
                  </div>

                  {/* Date & Time Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono tabular-nums font-medium ${
                        isPast ? 'text-slate-600' : 'text-blue-700'
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {app.interviewDate ? formatDisplayDate(app.interviewDate) : 'Date TBD'}
                    </span>

                    <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-slate-700">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      {formatDisplayTime(app.interviewTime)}
                    </span>

                    <span className="inline-flex items-center gap-1 text-slate-500 truncate">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      {app.jobLocation}
                    </span>
                  </div>

                  {app.interviewType && (
                    <p className="text-xs font-medium text-slate-700">
                      Stage: <span className="text-slate-900">{app.interviewType}</span>
                    </p>
                  )}

                  {app.personalNotes && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {app.personalNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {isPast ? 'Past date' : app.interviewDate ? 'Scheduled' : 'Needs date'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditInterview(app)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors whitespace-nowrap"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit Interview</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
