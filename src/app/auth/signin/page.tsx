"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/auth/client';
import { toast } from 'sonner';

const REDIRECT_KEY = 'auth:redirect';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectTo, setRedirectTo] = useState('/');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const param = searchParams?.get('redirectTo');
    if (param) {
      setRedirectTo(param);
      window.localStorage.setItem(REDIRECT_KEY, param);
    } else {
      const stored = window.localStorage.getItem(REDIRECT_KEY);
      if (stored) {
        setRedirectTo(stored);
      }
    }
  }, [searchParams]);

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setFeedback(null);

    try {
      if (mode === 'signin') {
        const { error } = await signIn.email({
          email,
          password,
        });

        if (error) {
          const errorMsg = error.message || 'Sign in failed. Please try again.';
          setFeedback(errorMsg);
          toast.error(errorMsg);
          setStatus('idle');
          return;
        }

        toast.success('Signed in successfully!');
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(REDIRECT_KEY);
        }
        router.push(redirectTo || '/');
      } else {
        const { error } = await signUp.email({
          email,
          password,
          name: name || email.split('@')[0],
        });

        if (error) {
          const errorMsg = error.message || 'Sign up failed. Please try again.';
          setFeedback(errorMsg);
          toast.error(errorMsg);
          setStatus('idle');
          return;
        }

        const successMsg = 'Account created! Check your email to verify your account.';
        setFeedback(successMsg);
        toast.success(successMsg);
        setMode('signin');
        // Keep the redirect in localStorage for after email verification
        // Don't clear it here - it will be cleared after successful sign-in or save
        setEmail('');
        setPassword('');
        setName('');
        setStatus('idle');
        return;
      }
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
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Newman Coding Club</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {mode === 'signin' ? 'Sign in to save your art' : 'Create an account'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Use your Newman email so we can connect your gallery submissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Jane Doe"
                required={mode === 'signup'}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              {mode === 'signin' && (
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-primary transition hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {feedback && (
            <div className={`rounded-xl border px-3 py-2 text-sm ${
              feedback.includes('created') || feedback.includes('Check your email')
                ? 'border-green-100 bg-green-50 text-green-700'
                : 'border-rose-100 bg-rose-50 text-rose-600'
            }`}>
              {feedback}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'loading'
              ? 'Please wait...'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {mode === 'signin' ? (
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setFeedback(null);
              }}
              className="font-semibold text-primary transition hover:text-primary/80"
            >
              Need an account? Sign up.
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setFeedback(null);
              }}
              className="font-semibold text-primary transition hover:text-primary/80"
            >
              Already member? Sign in.
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 px-4 pt-28 pb-16 text-slate-900">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Newman Coding Club</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
