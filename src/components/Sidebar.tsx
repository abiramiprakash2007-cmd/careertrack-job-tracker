import {
  BarChart3,
  Briefcase,
  Calendar,
  Compass,
  LayoutDashboard,
  LogOut,
  RotateCcw,
  Trash2,
  UserCircle2,
  X,
} from 'lucide-react';
import { PageRoute } from '../types/application';
import { getCompanyInitials } from '../utils/formatters';

interface SidebarProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  totalCount: number;
  interviewCount: number;
  isDemoData: boolean;
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onRequestClearData: () => void;
  onRestoreDemoData: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: PageRoute;
  label: string;
  Icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', Icon: Briefcase },
  { id: 'interviews', label: 'Interviews', Icon: Calendar },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { id: 'profile', label: 'Profile', Icon: UserCircle2 },
];

export function Sidebar({
  activePage,
  onNavigate,
  totalCount,
  interviewCount,
  isDemoData,
  userName,
  userEmail,
  onLogout,
  onRequestClearData,
  onRestoreDemoData,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleSelect = (page: PageRoute) => {
    onNavigate(page);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0B1528] text-slate-200 select-none">
      {/* Brand Wordmark */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <button
          type="button"
          onClick={() => handleSelect('dashboard')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 rounded-md"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap">
            CareerTrack
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto" aria-label="Primary navigation">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activePage === id;
          const count =
            id === 'applications'
              ? totalCount
              : id === 'interviews'
              ? interviewCount
              : null;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </span>
              {count !== null && (
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Data Controls */}
      <div className="border-t border-white/10 p-4 space-y-2.5">
        <div className="px-1">
          <p className="text-xs font-medium text-slate-300">
            {isDemoData ? 'Sample dataset active' : 'Local browser storage'}
          </p>
          <p className="mt-0.5 text-xs text-slate-400 tabular-nums">
            {totalCount} {totalCount === 1 ? 'application' : 'applications'} saved
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          {totalCount > 0 && (
            <button
              type="button"
              onClick={onRequestClearData}
              className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-rose-500/15 hover:border-rose-400/30 hover:text-rose-200 transition-colors whitespace-nowrap"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{isDemoData ? 'Clear Sample Data' : 'Clear All Data'}</span>
            </button>
          )}
          {(totalCount === 0 || !isDemoData) && (
            <button
              type="button"
              onClick={onRestoreDemoData}
              className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-blue-600/20 hover:border-blue-400/30 hover:text-white transition-colors whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Load Sample Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Authenticated User Profile Footer */}
      <div className="border-t border-white/10 p-4 bg-[#081020]">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => handleSelect('profile')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-400/30 font-display text-xs font-bold text-blue-200 hover:bg-blue-600/30 transition-colors"
            title="View Profile"
          >
            {getCompanyInitials(userName || userEmail)}
          </button>
          <button
            type="button"
            onClick={() => handleSelect('profile')}
            className="min-w-0 flex-1 text-left"
          >
            <p className="text-xs font-semibold text-white truncate">
              {userName || 'CareerTrack User'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-rose-300 transition-colors shrink-0"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col border-r border-slate-900/10">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative flex w-72 max-w-[82vw] flex-col shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
