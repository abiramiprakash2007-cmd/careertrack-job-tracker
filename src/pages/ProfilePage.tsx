import {
  Briefcase,
  CheckCircle2,
  Database,
  LogOut,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { getCompanyInitials } from '../utils/formatters';

interface ProfilePageProps {
  userName: string;
  userEmail: string;
  totalApplications: number;
  onUpdateName: (nextName: string) => void;
  onLogout: () => void;
  onNotify: (title: string, description?: string, variant?: 'success' | 'info' | 'danger') => void;
}

export function ProfilePage({
  userName,
  userEmail,
  totalApplications,
  onUpdateName,
  onLogout,
  onNotify,
}: ProfilePageProps) {
  const [fullName, setFullName] = useState(userName);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    setFullName(userName);
  }, [userName]);

  const handleSaveName = (e: FormEvent) => {
    e.preventDefault();
    setNameError(null);
    const trimmed = fullName.trim();
    if (trimmed.length < 2) {
      setNameError('Display name must be at least 2 characters.');
      return;
    }
    onUpdateName(trimmed);
    onNotify('Profile updated', 'Your display name has been saved.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Account Profile
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your CareerTrack profile details and session preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 transition-colors whitespace-nowrap shrink-0"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0B1528] text-white font-display text-lg font-bold">
              {getCompanyInitials(userName || userEmail)}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold text-slate-900 truncate">
                {userName || 'CareerTrack User'}
              </h2>
              <p className="text-sm text-slate-600 truncate">{userEmail}</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 whitespace-nowrap self-start sm:self-center">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Active Session</span>
          </span>
        </div>

        {/* Account Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Signed-in Email</span>
            </span>
            <p className="mt-1.5 text-sm font-medium text-slate-900 truncate">
              {userEmail}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tracked Applications</span>
            </span>
            <p className="mt-1.5 font-mono text-sm font-semibold tabular-nums text-slate-900">
              {totalApplications} saved records
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Data Storage</span>
            </span>
            <p className="mt-1.5 text-sm font-medium text-slate-900">
              Browser localStorage
            </p>
          </div>
        </div>
      </section>

      {/* Edit Display Name */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 max-w-xl">
        <h3 className="font-display text-base font-semibold text-slate-900">
          Personal Information
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Customize the display name shown in your CareerTrack sidebar and profile.
        </p>

        <form onSubmit={handleSaveName} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="profile-full-name"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Display Name
            </label>
            <div className="relative">
              <UserIcon
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="profile-full-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            {nameError && <p className="mt-1 text-xs text-rose-600">{nameError}</p>}
          </div>

          <button
            type="submit"
            disabled={fullName.trim() === userName}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Save Name</span>
          </button>
        </form>
      </section>
    </div>
  );
}
