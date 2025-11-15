'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setFeedback(null);

    try {
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: '/auth/reset-password',
      });

      if (error) {
        const errorMsg = error.message || 'Failed to send reset email';
        setFeedback(errorMsg);
        toast.error(errorMsg);
        setStatus('idle');
        return;
      }

      setStatus('success');
      const successMsg = 'Check your email for a password reset link.';
      setFeedback(successMsg);
      toast.success(successMsg);
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
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {status === 'success' ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-800">{feedback}</p>
            </div>
            <Link
              href="/auth/signin"
              className="block text-center text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
                required
              />
            </div>

            {feedback && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {feedback}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'loading' ? 'Sending...' : 'Send reset link'}
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
