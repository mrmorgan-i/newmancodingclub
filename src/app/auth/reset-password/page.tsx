'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams?.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setFeedback('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setFeedback(null);

    if (password !== confirmPassword) {
      setFeedback('Passwords do not match');
      setStatus('idle');
      return;
    }

    if (password.length < 8) {
      setFeedback('Password must be at least 8 characters long');
      setStatus('idle');
      return;
    }

    if (!token) {
      setFeedback('Invalid reset token');
      setStatus('idle');
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
      });

      if (error) {
        const errorMsg = error.message || 'Failed to reset password';
        setFeedback(errorMsg);
        toast.error(errorMsg);
        setStatus('idle');
        return;
      }

      setStatus('success');
      toast.success('Password reset successfully! Redirecting...');
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setFeedback(errorMsg);
      toast.error(errorMsg);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-28 pb-16 text-slate-900">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Newman Coding Club
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Create new password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose a strong password for your account.
          </p>
        </div>

        {status === 'success' ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Password reset successful! Redirecting to sign in...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">New password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                required
                minLength={8}
                disabled={!token || status === 'loading'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                required
                minLength={8}
                disabled={!token || status === 'loading'}
              />
            </div>

            {feedback && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {feedback}
              </div>
            )}

            <button
              type="submit"
              disabled={!token || status === 'loading'}
              className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'loading' ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-500">
          <Link
            href="/auth/signin"
            className="font-semibold text-primary transition hover:text-primary/80"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 px-4 pt-28 pb-16 text-slate-900">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Newman Coding Club
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Create new password</h1>
            <p className="mt-2 text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
