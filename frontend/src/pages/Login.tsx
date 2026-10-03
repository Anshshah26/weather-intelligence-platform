import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CloudSun, LogIn, AlertCircle, Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = (location.state as { message?: string })?.message;
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmedEmail, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-[#18232D] border border-[#2B3945] rounded-xl p-8 shadow-sm">
        {/* Brand logo & header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#24313C] border border-[#2B3945] rounded-xl text-[#2F80ED] mb-3">
            <CloudSun className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">{t('appTitle', 'Weather Intelligence Platform')}</h1>
          <p className="text-xs text-[#9AA8B2] mt-1">
            {t('signIn', 'Sign In')}
          </p>
        </div>

        {/* Redirect Notice Message */}
        {redirectMessage && (
          <div className="mb-5 p-3 bg-[#24313C] border border-[#2B3945] rounded-lg flex items-center gap-2.5 text-[#F2C94C] text-xs">
            <Lock className="w-4 h-4 shrink-0 text-[#F2C94C]" />
            <span>{redirectMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg flex items-center gap-2.5 text-[#EB5757] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#EB5757]" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA8B2]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none transition-colors"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA8B2]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none transition-colors"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#2F80ED] hover:bg-[#2570d4] text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('signIn', 'Sign In')}</span>
              </>
            )}
          </button>
        </form>

        {/* Signup Redirect link */}
        <div className="mt-6 text-center border-t border-[#2B3945] pt-5">
          <p className="text-xs text-[#9AA8B2]">
            Need a platform account?{' '}
            <Link
              to="/signup"
              state={{ from: location.state?.from }}
              className="text-[#56CCF2] hover:text-[#F4F7F9] font-medium transition-colors"
            >
              {t('signUp', 'Register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
