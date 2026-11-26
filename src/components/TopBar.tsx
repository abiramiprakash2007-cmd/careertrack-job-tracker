import { Menu, Plus } from 'lucide-react';
import { PageRoute } from '../types/application';

interface TopBarProps {
  activePage: PageRoute;
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
}

const PAGE_TITLES: Record<PageRoute, string> = {
  dashboard: 'Dashboard',
  applications: 'Applications',
  interviews: 'Interviews',
  analytics: 'Analytics',
  profile: 'Profile',
};

export function TopBar({
  activePage,
  onOpenMobileMenu,
  onOpenAddModal,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
          <span className="font-display font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
            CareerTrack
          </span>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
            /
          </span>
          <span className="font-display font-semibold text-slate-900 truncate">
            {PAGE_TITLES[activePage]}
          </span>
        </nav>
      </div>

      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Add Application</span>
        </button>
      </div>
    </header>
  );
}
