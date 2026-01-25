'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Welcome to the cat crew! 🐱');
        setEmail('');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <section className="relative pt-12 sm:pt-20 pb-32 sm:pb-48 px-4 sm:px-6 bg-[var(--terracotta)]">
      {/* Wave at top - overlaps previous section */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[calc(100%-1px)]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L48 54C96 48 192 36 288 30C384 24 480 24 576 32C672 40 768 56 864 60C960 64 1056 56 1152 48C1248 40 1344 32 1392 28L1440 24V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
            fill="var(--terracotta)"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center px-2">
        <span className="text-4xl sm:text-5xl block mb-3 sm:mb-4">📬</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
          Join the Cat Crew
        </h2>
        <p className="text-sm sm:text-base text-white/80 mb-6 sm:mb-10 leading-relaxed">
          Get updates on new cats, voting rounds, and heartwarming cat stories from Malta.
          No spam, just cats. Unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-full bg-white/95 text-[var(--foreground)] placeholder:text-[var(--stone-dark)] focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-sm sm:text-base min-h-[44px]"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[var(--golden-sun)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-[var(--golden-sun)]/90 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--golden-sun)]/30 disabled:opacity-50 text-sm sm:text-base min-h-[44px]"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <p className="mt-6 text-white bg-white/20 rounded-full py-2 px-6 inline-block">
            {message}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-6 text-white bg-red-500/30 rounded-full py-2 px-6 inline-block">
            {message}
          </p>
        )}
      </div>

    </section>
  );
}
