'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="Cats of Malta"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-[var(--terracotta-dark)] group-hover:text-[var(--terracotta)] transition-colors">
                Cats of Malta
              </h1>
              <p className="hidden sm:block text-xs text-[var(--stone-dark)]">celebrating the island&apos;s feline friends</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#gallery"
              className="text-[var(--foreground)] hover:text-[var(--terracotta)] font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--terracotta)] after:transition-all hover:after:w-full"
            >
              The Cats
            </Link>
            <Link
              href="/#map"
              className="text-[var(--foreground)] hover:text-[var(--terracotta)] font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--terracotta)] after:transition-all hover:after:w-full"
            >
              Map
            </Link>
            <Link
              href="/vote"
              className="text-[var(--foreground)] hover:text-[var(--terracotta)] font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--terracotta)] after:transition-all hover:after:w-full"
            >
              Vote
            </Link>
            <Link href="/submit" className="soft-button px-6 py-2.5 font-medium">
              Submit a Cat
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-3 rounded-xl hover:bg-[var(--cream)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col gap-4 pt-4">
              <Link
                href="/#gallery"
                className="text-[var(--foreground)] hover:text-[var(--terracotta)] font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                The Cats
              </Link>
              <Link
                href="/#map"
                className="text-[var(--foreground)] hover:text-[var(--terracotta)] font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Map
              </Link>
              <Link
                href="/vote"
                className="text-[var(--foreground)] hover:text-[var(--terracotta)] font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vote
              </Link>
              <Link
                href="/submit"
                className="soft-button px-6 py-3 font-medium text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submit a Cat
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
