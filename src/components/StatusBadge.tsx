import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileCheck2,
  XCircle,
} from 'lucide-react';
import { ApplicationStatus } from '../types/application';

interface StatusBadgeProps {
  status: ApplicationStatus;
  compact?: boolean;
}

const STATUS_STYLES: Record<
  ApplicationStatus,
  {
    bg: string;
    text: string;
    border: string;
    Icon: typeof Clock;
  }
> = {
  Applied: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    Icon: FileCheck2,
  },
  Screening: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    Icon: Clock,
  },
  Interviewing: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    Icon: CalendarClock,
  },
  Selected: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    Icon: CheckCircle2,
  },
  Rejected: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    Icon: XCircle,
  },
};

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];
  const Icon = style.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap shrink-0 ${style.bg} ${style.text} ${style.border} ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
