import {
  ArrowRight,
  Briefcase,
  Calendar,
  CalendarClock,
  CheckCircle2,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatusBadge } from '../components/StatusBadge';
import { JobApplication, PageRoute } from '../types/application';
import {
  buildMonthlyActivity,
  formatDisplayDate,
  formatDisplayTime,
  formatShortDate,
  getCompanyAvatarTone,
  getCompanyInitials,
  getTodayISO,
  isInterviewScheduled,
} from '../utils/formatters';

interface DashboardPageProps {
  applications: JobApplication[];
  isDemoData: boolean;
  onNavigate: (page: PageRoute) => void;
  onOpenAddModal: () => void;
  onViewApplication: (app: JobApplication) => void;
  onEditInterview: (app: JobApplication) => void;
  onRequestClearData: () => void;
  onRestoreDemoData: () => void;
}

export function DashboardPage({
  applications,
  isDemoData,
  onNavigate,
  onOpenAddModal,
  onViewApplication,
  onEditInterview,
  onRequestClearData,
  onRestoreDemoData,
}: DashboardPageProps) {
  const todayISO = getTodayISO();

  const totalCount = applications.length;
  const interviewsScheduledCount = applications.filter(
    (app) =>
      app.status === 'Interviewing' ||
      (Boolean(app.interviewDate) && app.status !== 'Rejected' && app.status !== 'Selected')
  ).length;
  const selectedCount = applications.filter((app) => app.status === 'Selected').length;
  const rejectedCount = applications.filter((app) => app.status === 'Rejected').length;

  const monthlyData = buildMonthlyActivity(applications);

  const recentApplications = [...applications]
    .sort((a, b) => b.applicationDate.localeCompare(a.applicationDate))
    .slice(0, 5);

  const upcomingInterviews = [...applications]
    .filter((app) => isInterviewScheduled(app) && app.status !== 'Rejected' && app.status !== 'Selected')
    .sort((a, b) => {
      if (!a.interviewDate && !b.interviewDate) return 0;
      if (!a.interviewDate) return 1;
      if (!b.interviewDate) return -1;
      return a.interviewDate.localeCompare(b.interviewDate);
    })
    .slice(0, 5);

  const interviewRate =
    totalCount > 0
      ? Math.round(
          (applications.filter(
            (a) => a.interviewDate || a.status === 'Interviewing' || a.status === 'Selected'
          ).length /
            totalCount) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back!
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Monitor your job applications, upcoming interviews, and pipeline progress in one place.
          </p>
        </div>

        {isDemoData && totalCount > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50/80 px-3.5 py-2 text-xs text-blue-900">
            <span>Showing sample demonstration records</span>
            <button
              type="button"
              onClick={onRequestClearData}
              className="font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2 whitespace-nowrap"
            >
              Clear sample data
            </button>
          </div>
        )}
      </div>

      {/* KPI Summary Grid */}
      <section aria-label="Application statistics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Applications</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {totalCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {interviewRate}% reached interview stage
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Interviews Scheduled</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {interviewsScheduledCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {upcomingInterviews.filter((i) => i.interviewDate >= todayISO).length} upcoming dates
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Selected Applications</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {selectedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0}% selection rate
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rejected Applications</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <XCircle className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {rejectedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 0}% closed applications
          </p>
        </div>
      </section>

      {totalCount === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Briefcase className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">
            Your application tracker is empty
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            Add your first job or internship application to populate your dashboard metrics, activity chart, and interview schedule.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add First Application</span>
            </button>
            <button
              type="button"
              onClick={onRestoreDemoData}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Load Sample Data</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Activity Chart + Upcoming Interviews */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Application Activity Chart */}
            <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    Application Activity
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monthly applications submitted vs. interviews secured
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('analytics')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                >
                  <span>Full analytics</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="h-64 w-full min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="royalAppsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="navyInterviewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B1528" stopOpacity={0.14} />
                        <stop offset="95%" stopColor="#0B1528" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis
                      dataKey="monthLabel"
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B1528',
                        border: '1px solid #1E293B',
                        borderRadius: '10px',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#F8FAFC' }}
                      labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      name="Applications"
                      stroke="#2563EB"
                      strokeWidth={2.25}
                      fillOpacity={1}
                      fill="url(#royalAppsGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="interviews"
                      name="Interviews"
                      stroke="#0B1528"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#navyInterviewsGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Upcoming Interviews */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    Upcoming Interviews
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scheduled rounds & dates
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('interviews')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                >
                  <span>Manage</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              {upcomingInterviews.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-3">
                  <Calendar className="h-8 w-8 text-slate-300" aria-hidden="true" />
                  <p className="mt-2.5 text-sm font-medium text-slate-700">
                    No interviews scheduled
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Add an interview date when creating or editing an application.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 flex-1">
                  {upcomingInterviews.map((item) => (
                    <li
                      key={item.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {item.companyName}
                        </p>
                        <p className="text-xs text-slate-600 truncate mt-0.5">
                          {item.jobTitle}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-xs font-mono tabular-nums text-blue-700">
                          <span>
                            {item.interviewDate
                              ? formatDisplayDate(item.interviewDate)
                              : 'Date TBD'}
                          </span>
                          {item.interviewTime && (
                            <>
                              <span className="text-slate-300" aria-hidden="true">
                                ·
                              </span>
                              <span>{formatDisplayTime(item.interviewTime)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onEditInterview(item)}
                        className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/60 transition-colors shrink-0"
                        aria-label={`Edit interview for ${item.companyName}`}
                        title="Edit interview"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Recent Applications */}
          <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Recent Applications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your latest submitted roles and current pipeline status
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('applications')}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
              >
                <span>View all applications</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onViewApplication(app)}
                  className="w-full px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-display text-xs font-bold ${getCompanyAvatarTone(
                        app.companyName
                      )}`}
                    >
                      {getCompanyInitials(app.companyName)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {app.companyName}
                        </span>
                        <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-sm text-slate-700 truncate hidden sm:inline">
                          {app.jobTitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate sm:hidden mt-0.5">
                        {app.jobTitle}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
                          {app.jobLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-12 sm:pl-0">
                    <span className="font-mono text-xs tabular-nums text-slate-500">
                      Applied {formatShortDate(app.applicationDate)}
                    </span>
                    <StatusBadge status={app.status} compact />
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
