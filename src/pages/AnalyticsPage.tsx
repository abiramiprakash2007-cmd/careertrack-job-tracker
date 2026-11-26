import { BarChart3, Briefcase, CheckCircle2, Plus, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ApplicationStatus, JobApplication } from '../types/application';
import { buildMonthlyActivity, STATUS_ORDER } from '../utils/formatters';

interface AnalyticsPageProps {
  applications: JobApplication[];
  onOpenAddModal: () => void;
}

const STATUS_CHART_COLORS: Record<ApplicationStatus, string> = {
  Applied: '#64748B',
  Screening: '#0EA5E9',
  Interviewing: '#2563EB',
  Selected: '#16A34A',
  Rejected: '#E11D48',
};

export function AnalyticsPage({
  applications,
  onOpenAddModal,
}: AnalyticsPageProps) {
  const totalCount = applications.length;

  const reachedInterviewCount = applications.filter(
    (app) =>
      Boolean(app.interviewDate) ||
      app.status === 'Interviewing' ||
      app.status === 'Selected'
  ).length;

  const selectedCount = applications.filter((app) => app.status === 'Selected').length;
  const activeCount = applications.filter(
    (app) =>
      app.status === 'Applied' ||
      app.status === 'Screening' ||
      app.status === 'Interviewing'
  ).length;

  const interviewConversionRate =
    totalCount > 0 ? Math.round((reachedInterviewCount / totalCount) * 100) : 0;

  const overallSelectionRate =
    totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;

  const interviewToOfferRate =
    reachedInterviewCount > 0
      ? Math.round((selectedCount / reachedInterviewCount) * 100)
      : 0;

  const monthlyData = buildMonthlyActivity(applications);

  const statusBreakdown = STATUS_ORDER.map((status) => {
    const count = applications.filter((app) => app.status === status).length;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return {
      status,
      count,
      percentage,
      color: STATUS_CHART_COLORS[status],
    };
  });

  const pieData = statusBreakdown.filter((item) => item.count > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Measure conversion efficiency, monthly momentum, and pipeline status distribution.
          </p>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BarChart3 className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">
            No analytics data available yet
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            Add job applications to see your monthly activity trends, interview conversion rate, and selection breakdown.
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Application</span>
          </button>
        </div>
      ) : (
        <>
          {/* Key Analytics Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Total Applications</span>
                <Briefcase className="h-4 w-4 text-blue-600" aria-hidden="true" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-slate-900 tabular-nums">
                {totalCount}
              </p>
              <p className="mt-1 text-xs text-slate-500 tabular-nums">
                {activeCount} currently active in pipeline
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Interview Conversion Rate</span>
                <TrendingUp className="h-4 w-4 text-blue-600" aria-hidden="true" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-slate-900 tabular-nums">
                {interviewConversionRate}%
              </p>
              <p className="mt-1 text-xs text-slate-500 tabular-nums">
                {reachedInterviewCount} of {totalCount} reached interviews
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Selection Rate</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-slate-900 tabular-nums">
                {overallSelectionRate}%
              </p>
              <p className="mt-1 text-xs text-slate-500 tabular-nums">
                {selectedCount} offer{selectedCount === 1 ? '' : 's'} received
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Interview-to-Selection</span>
                <BarChart3 className="h-4 w-4 text-[#0B1528]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-slate-900 tabular-nums">
                {interviewToOfferRate}%
              </p>
              <p className="mt-1 text-xs text-slate-500 tabular-nums">
                {selectedCount} selected from {reachedInterviewCount} interviewed
              </p>
            </div>
          </section>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Application Activity */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    Monthly Application Activity
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Applications submitted alongside interview progression by month
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-blue-600" aria-hidden="true" />
                    Applied
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-[#0B1528]" aria-hidden="true" />
                    Interviews
                  </span>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
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
                    <Bar
                      dataKey="applications"
                      name="Applications"
                      fill="#2563EB"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={36}
                    />
                    <Bar
                      dataKey="interviews"
                      name="Interviews"
                      fill="#0B1528"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Application Status Breakdown */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-5">
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Application Status Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Current distribution across every hiring stage
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={82}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.status} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1528',
                          border: '1px solid #1E293B',
                          borderRadius: '10px',
                          color: '#F8FAFC',
                          fontSize: '12px',
                        }}
                        itemStyle={{ color: '#F8FAFC' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Accessible Breakdown Table */}
                <div className="space-y-3">
                  {statusBreakdown.map((item) => (
                    <div key={item.status} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                          <span
                            className="h-2.5 w-2.5 rounded-xs shrink-0"
                            style={{ backgroundColor: item.color }}
                            aria-hidden="true"
                          />
                          {item.status}
                        </span>
                        <span className="font-mono tabular-nums text-slate-900 font-medium">
                          {item.count}{' '}
                          <span className="text-slate-400">({item.percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Pipeline Conversion Funnel */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4">
              <h2 className="font-display text-base font-semibold text-slate-900">
                Pipeline Conversion Summary
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Stage-by-stage progression from submission to selection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-medium text-slate-500">01. Applications Submitted</p>
                <p className="mt-2 font-display text-2xl font-bold text-slate-900 tabular-nums">
                  {totalCount}
                </p>
                <p className="mt-1 text-xs text-slate-500">100% baseline volume</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-medium text-slate-500">02. Reached Interview Stage</p>
                <p className="mt-2 font-display text-2xl font-bold text-blue-700 tabular-nums">
                  {reachedInterviewCount}
                </p>
                <p className="mt-1 text-xs text-slate-500 tabular-nums">
                  {interviewConversionRate}% conversion from submitted
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-medium text-slate-500">03. Offers / Selected</p>
                <p className="mt-2 font-display text-2xl font-bold text-emerald-700 tabular-nums">
                  {selectedCount}
                </p>
                <p className="mt-1 text-xs text-slate-500 tabular-nums">
                  {interviewToOfferRate}% conversion from interview
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
