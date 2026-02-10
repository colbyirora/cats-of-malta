'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center tile-pattern" style={{ background: 'var(--cream)' }}>
      <div className="w-full max-w-md mx-4">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="text-5xl mb-3">
              <span role="img" aria-label="cat">&#128008;</span>
            </div>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{
                color: 'var(--terracotta-dark)',
                fontFamily: 'var(--font-fredoka), sans-serif',
              }}
            >
              Cats of Malta
            </h1>
            <p
              className="text-sm mt-1"
              style={{
                color: 'var(--stone-dark)',
                fontFamily: 'var(--font-caveat), cursive',
                fontSize: '1.1rem',
              }}
            >
              Admin Portal
            </p>
          </Link>
        </div>

        {/* Login Card */}
        <div className="soft-card p-8">
          <h2
            className="text-xl font-semibold text-center mb-6"
            style={{ color: 'var(--foreground)' }}
          >
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="soft-input w-full px-4 py-3 text-base"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            {error && (
              <div
                className="text-sm text-center py-2 px-3 rounded-xl"
                style={{
                  color: 'var(--terracotta-dark)',
                  background: 'rgba(196, 30, 58, 0.08)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="soft-button w-full py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm hover:underline"
              style={{ color: 'var(--stone-dark)' }}
            >
              Back to site
            </Link>
          </div>
        </div>

        {/* Decorative footer */}
        <p
          className="text-center mt-6 text-sm"
          style={{
            color: 'var(--stone-dark)',
            fontFamily: 'var(--font-caveat), cursive',
            fontSize: '1rem',
          }}
        >
          keeping Malta&apos;s cats safe &amp; sound
        </p>
      </div>
    </div>
  );
}
