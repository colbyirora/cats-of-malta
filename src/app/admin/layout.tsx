'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/check');
        const data = await res.json();
        setAuthenticated(data.authenticated);

        if (!data.authenticated && !isLoginPage) {
          router.push('/admin/login');
        }
      } catch {
        setAuthenticated(false);
        if (!isLoginPage) {
          router.push('/admin/login');
        }
      }
    }

    checkAuth();
  }, [isLoginPage, router]);

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setAuthenticated(false);
      router.push('/admin/login');
    } catch {
      // Force redirect even on error
      router.push('/admin/login');
    }
  }

  // Show nothing while checking auth
  if (authenticated === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--cream)' }}
      >
        <div
          className="text-lg"
          style={{
            color: 'var(--stone-dark)',
            fontFamily: 'var(--font-caveat), cursive',
            fontSize: '1.3rem',
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  // Login page renders without admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated and not on login page - will redirect in useEffect
  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Admin Header Bar */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'var(--terracotta-dark)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
            >
              <span className="text-xl">&#128008;</span>
              <h1
                className="text-lg font-bold text-white"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Admin Dashboard
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-medium rounded-full transition-all hover:opacity-90"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
