import { ApplicationStatus, JobApplication } from '../types/application';

export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return '—';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(isoDate: string): string {
  if (!isoDate) return '—';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDisplayTime(time24: string): string {
  if (!time24) return 'Time TBD';
  const [hourStr, minStr] = time24.split(':');
  const hour = Number(hourStr);
  const minute = Number(minStr);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time24;
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
}

export function getCompanyInitials(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return 'CT';
  const words = cleaned.split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

const AVATAR_TONES = [
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-slate-100 text-slate-800 border-slate-200',
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-sky-50 text-sky-700 border-sky-200',
];

export function getCompanyAvatarTone(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

export function isInterviewScheduled(app: JobApplication): boolean {
  return Boolean(app.interviewDate) || app.status === 'Interviewing';
}

export function isUpcomingInterview(app: JobApplication, todayISO = getTodayISO()): boolean {
  if (!app.interviewDate) return app.status === 'Interviewing';
  return app.interviewDate >= todayISO && app.status !== 'Rejected';
}

export interface MonthlyMetric {
  monthKey: string;
  monthLabel: string;
  applications: number;
  interviews: number;
  selected: number;
}

export function buildMonthlyActivity(applications: JobApplication[]): MonthlyMetric[] {
  const monthMap = new Map<string, MonthlyMetric>();

  for (const app of applications) {
    if (!app.applicationDate || app.applicationDate.length < 7) continue;
    const monthKey = app.applicationDate.slice(0, 7); // YYYY-MM
    const [year, month] = monthKey.split('-').map(Number);
    if (Number.isNaN(year) || Number.isNaN(month)) continue;

    const existing = monthMap.get(monthKey);
    const label = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    });

    const entry = existing ?? {
      monthKey,
      monthLabel: label,
      applications: 0,
      interviews: 0,
      selected: 0,
    };

    entry.applications += 1;
    if (app.interviewDate || app.status === 'Interviewing' || app.status === 'Selected') {
      entry.interviews += 1;
    }
    if (app.status === 'Selected') {
      entry.selected += 1;
    }

    monthMap.set(monthKey, entry);
  }

  return Array.from(monthMap.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export const STATUS_ORDER: ApplicationStatus[] = [
  'Applied',
  'Screening',
  'Interviewing',
  'Selected',
  'Rejected',
];
