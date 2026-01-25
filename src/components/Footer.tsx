'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative bg-[#2d2623] text-[var(--stone)] pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6">
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
            d="M0 40L60 45C120 50 240 60 360 58C480 56 600 42 720 38C840 34 960 40 1080 48C1200 56 1320 66 1380 71L1440 76V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V40Z"
            fill="#2d2623"
          />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="Cats of Malta"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <h3 className="text-2xl font-bold text-white">Cats of Malta</h3>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-[var(--stone)]/80">
              A visual storytelling project celebrating the iconic street cats
              that have become synonymous with Maltese culture. Documenting,
              naming, and supporting Malta&apos;s beloved felines.
            </p>
            <p className="text-sm text-[var(--stone)]/60">
              Made with 🧡 in Malta
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/#gallery" className="text-[var(--stone)]/80 hover:text-white transition-colors">
                  The Cats
                </a>
              </li>
              <li>
                <a href="/#map" className="text-[var(--stone)]/80 hover:text-white transition-colors">
                  Map
                </a>
              </li>
              <li>
                <a href="/submit" className="text-[var(--stone)]/80 hover:text-white transition-colors">
                  Submit a Cat
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--stone)]/80 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Support */}
          <div>
            <h4 className="font-semibold text-white mb-5">Connect</h4>
            <div className="flex gap-3 mb-8">
              <a
                href="https://instagram.com/catsofmalta"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--terracotta)] transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--terracotta)] transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <h4 className="font-semibold text-white mb-3">Support Malta&apos;s Cats</h4>
            <p className="text-sm text-[var(--stone)]/80 mb-3">
              Help local sanctuaries care for street cats.
            </p>
            <a
              href="#"
              className="inline-block text-sm text-[var(--terracotta-light)] hover:text-[var(--terracotta)] transition-colors"
            >
              Donate to local shelters →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--stone)]/60">
            © {new Date().getFullYear()} Cats of Malta. All rights reserved.
          </p>
          <p className="text-xs text-[var(--stone)]/40">
            celebrating the island&apos;s feline friends
          </p>
        </div>
      </div>
    </footer>
  );
}
