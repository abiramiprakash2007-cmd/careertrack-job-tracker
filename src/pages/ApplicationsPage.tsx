import {
  Briefcase,
  Eye,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { ApplicationStatus, JobApplication, SortOption } from '../types/application';
import {
  formatDisplayDate,
  getCompanyAvatarTone,
  getCompanyInitials,
  STATUS_ORDER,
} from '../utils/formatters';

interface ApplicationsPageProps {
  applications: JobApplication[];
  onOpenAddModal: () => void;
  onViewApplication: (app: JobApplication) => void;
  onEditApplication: (app: JobApplication) => void;
  onDeleteApplication: (app: JobApplication) => void;
  onRestoreDemoData: () => void;
}

type FilterStatus = 'All' | ApplicationStatus;

export function ApplicationsPage({
  applications,
  onOpenAddModal,
  onViewApplication,
  onEditApplication,
  onDeleteApplication,
  onRestoreDemoData,
}: ApplicationsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');

  const statusCounts = useMemo(() => {
    const counts: Record<FilterStatus, number> = {
      All: applications.length,
      Applied: 0,
      Screening: 0,
      Interviewing: 0,
      Selected: 0,
      Rejected: 0,
    };
    for (const app of applications) {
      counts[app.status] += 1;
    }
    return counts;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = applications.filter((app) => {
      if (statusFilter !== 'All' && app.status !== statusFilter) {
        return false;
      }
      if (!query) return true;
      return (
        app.companyName.toLowerCase().includes(query) ||
        app.jobTitle.toLowerCase().includes(query) ||
        app.jobLocation.toLowerCase().includes(query)
      );
    });

    return [...matched].sort((a, b) => {
      if (sortOption === 'date-desc') {
        return b.applicationDate.localeCompare(a.applicationDate);
      }
      if (sortOption === 'date-asc') {
        return a.applicationDate.localeCompare(b.applicationDate);
      }
      if (sortOption === 'company-asc') {
        return a.companyName.localeCompare(b.companyName);
      }
      if (sortOption === 'interview-asc') {
        if (!a.interviewDate && !b.interviewDate) return 0;
        if (!a.interviewDate) return 1;
        if (!b.interviewDate) return -1;
        return a.interviewDate.localeCompare(b.interviewDate);
      }
      return 0;
    });
  }, [applications, searchQuery, statusFilter, sortOption]);

  const filterTabs: FilterStatus[] = ['All', ...STATUS_ORDER];

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Applications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Search, filter, and manage every role and internship in your pipeline.
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

      {/* Filter & Search Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name or job title..."
              aria-label="Search applications by company name or job title"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-9 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Sort by
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="date-desc">Newest Applied</option>
              <option value="date-asc">Oldest Applied</option>
              <option value="company-asc">Company (A–Z)</option>
              <option value="interview-asc">Upcoming Interview</option>
            </select>
          </div>
        </div>

        {/* Status Filter Segmented Bar */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filter applications by status"
        >
          {filterTabs.map((tab) => {
            const isSelected = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setStatusFilter(tab)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#0B1528] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`font-mono tabular-nums ${
                    isSelected ? 'text-blue-300' : 'text-slate-400'
                  }`}
                >
                  {statusCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty States or Data Table */}
      {applications.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Briefcase className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">
            No applications recorded yet
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            Start tracking your job search by adding your first application or restoring the demonstration dataset.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Application</span>
            </button>
            <button
              type="button"
              onClick={onRestoreDemoData}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Load Sample Data</span>
            </button>
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="font-display text-base font-semibold text-slate-900">
            No matching applications found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Adjust your search term or status filter to view saved applications.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Reset search & filters
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500">
                  <th className="py-3 pl-6 pr-4">Company</th>
                  <th className="py-3 px-4">Role & Location</th>
                  <th className="py-3 px-4">Applied</th>
                  <th className="py-3 px-4">Interview Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-display text-xs font-bold ${getCompanyAvatarTone(
                            app.companyName
                          )}`}
                        >
                          {getCompanyInitials(app.companyName)}
                        </div>
                        <button
                          type="button"
                          onClick={() => onViewApplication(app)}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
                        >
                          {app.companyName}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <button
                        type="button"
                        onClick={() => onViewApplication(app)}
                        className="block font-medium text-slate-900 hover:text-blue-600 transition-colors truncate max-w-full text-left"
                      >
                        {app.jobTitle}
                      </button>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {app.jobLocation}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-600 whitespace-nowrap">
                      {formatDisplayDate(app.applicationDate)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-600 whitespace-nowrap">
                      {app.interviewDate ? formatDisplayDate(app.interviewDate) : '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3.5 pl-4 pr-6 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewApplication(app)}
                          className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          aria-label={`View details for ${app.companyName}`}
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditApplication(app)}
                          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteApplication(app)}
                          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive List */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredApplications.map((app) => (
              <div key={app.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-display text-xs font-bold ${getCompanyAvatarTone(
                        app.companyName
                      )}`}
                    >
                      {getCompanyInitials(app.companyName)}
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onViewApplication(app)}
                        className="font-semibold text-sm text-slate-900 text-left block truncate"
                      >
                        {app.companyName}
                      </button>
                      <p className="text-xs text-slate-700 truncate">{app.jobTitle}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{app.jobLocation}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} compact />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums pt-1">
                  <span>Applied: {formatDisplayDate(app.applicationDate)}</span>
                  {app.interviewDate && (
                    <span className="text-blue-700">
                      Interview: {formatDisplayDate(app.interviewDate)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onViewApplication(app)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditApplication(app)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteApplication(app)}
                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
