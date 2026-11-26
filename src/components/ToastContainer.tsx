import { CheckCircle2, Info, Trash2, X } from 'lucide-react';
import { ToastMessage } from '../types/application';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.variant === 'danger'
            ? Trash2
            : toast.variant === 'info'
            ? Info
            : CheckCircle2;

        const iconColor =
          toast.variant === 'danger'
            ? 'text-rose-400'
            : toast.variant === 'info'
            ? 'text-blue-400'
            : 'text-emerald-400';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-[#0B1528] p-4 text-white shadow-lg"
          >
            <div className="flex items-start gap-3 min-w-0">
              <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-slate-300">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
