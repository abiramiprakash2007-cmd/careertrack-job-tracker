import { AlertCircle, Compass, Eye, EyeOff, Info, Lock, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string, rememberMe: boolean) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      errors.password = 'Please enter your password.';
    }
    return errors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDemoNotice(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onLogin(email.trim(), rememberMe);
  };

  const handleForgotPasswordClick = () => {
    setDemoNotice(
      'Demo mode: Password reset is not needed. Enter any valid email address and password above to open your CareerTrack dashboard.'
    );
  };

  const handleCreateAccountClick = () => {
    setDemoNotice(
      'Demo mode: No separate registration is required. Enter any email and password above and click Log In to access CareerTrack.'
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-blue-700 font-display text-sm font-semibold mb-2">
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span>CareerTrack</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Sign in to CareerTrack
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Enter any email and password to open your job application tracker dashboard.
        </p>
      </div>

      {demoNotice && (
        <div
          role="status"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 p-3.5 text-xs text-blue-900"
        >
          <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="leading-relaxed">{demoNotice}</span>
        </div>
      )}

      {(fieldErrors.email || fieldErrors.password) && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800"
        >
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>Please fill in both your email address and password to continue.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Address */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Email address
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="student@university.edu"
              className={`w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.email
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="login-password"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="Enter your password"
              className={`w-full rounded-lg border pl-9 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.password
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={handleForgotPasswordClick}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <span>Log In</span>
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-600">
        <span>New to CareerTrack? </span>
        <button
          type="button"
          onClick={handleCreateAccountClick}
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
