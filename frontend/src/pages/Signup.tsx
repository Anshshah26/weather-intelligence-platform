import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CloudSun, UserPlus, AlertCircle, Lock, Mail, User } from 'lucide-react';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await signup(trimmedName, trimmedEmail, password, confirmPassword);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please check your details.');
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">Create Platform Account</h1>
          <p className="text-xs text-[#9AA8B2] mt-1">
            Access enterprise atmospheric data & personalized weather tools
          </p>
        </div>

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
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA8B2]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none transition-colors"
                autoComplete="name"
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
                className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none transition-colors"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA8B2]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none transition-colors"
                autoComplete="new-password"
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
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Login Redirect link */}
        <div className="mt-6 text-center border-t border-[#2B3945] pt-5">
          <p className="text-xs text-[#9AA8B2]">
            Already have an account?{' '}
            <Link
              to="/login"
              state={{ from: location.state?.from }}
              className="text-[#56CCF2] hover:text-[#F4F7F9] font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
