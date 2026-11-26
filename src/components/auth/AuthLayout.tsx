import {
  BarChart3,
  Briefcase,
  CalendarClock,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Brand Showcase (Midnight Navy) */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] bg-[#0B1528] text-white flex-col justify-between p-10 xl:p-14 border-r border-slate-900">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              CareerTrack
            </span>
          </div>

          <div className="mt-14 max-w-md">
            <h1 className="font-display text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
              Organise every application, interview, and offer in one workspace.
            </h1>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Built for students and job seekers to track pipeline momentum, prepare for technical loops, and measure conversion rates with clarity.
            </p>
          </div>

          <div className="mt-10 space-y-4 max-w-md">
            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-4">
              <Briefcase className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-white">Structured Pipeline Tracking</p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Manage statuses from Applied and Screening through Interviewing and Selected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-4">
              <CalendarClock className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-white">Dedicated Interview Schedule</p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Keep round formats, dates, times, and prep notes right at your fingertips.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-4">
              <BarChart3 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-white">Live Conversion Analytics</p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Visualize monthly submission velocity and interview-to-offer ratios.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 pt-8 border-t border-white/10">
          <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
          <span>Your applications are saved locally in your browser across sessions.</span>
        </div>
      </div>

      {/* Right Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              CareerTrack
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
