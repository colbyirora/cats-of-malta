'use client';

import { useRef } from 'react';
import type { Cat } from '@/lib/types';

interface CatMapProps {
  cats: Cat[];
}

export default function CatMap({ cats }: CatMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  const uniqueLocations = [...new Set(cats.map(c => c.location_name))];

  return (
    <section id="map" className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 px-4 sm:px-6 bg-[var(--cream)]">
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
            d="M0 0L48 8.5C96 17 192 34 288 45.3C384 57 480 63 576 56.8C672 51 768 31 864 28.2C960 25 1056 37 1152 45.3C1248 54 1344 60 1392 63L1440 66V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="var(--cream)"
          />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--foreground)] mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
            Where to Find Them
          </h2>
          <p className="text-base sm:text-lg text-[var(--stone-dark)] max-w-2xl mx-auto leading-relaxed px-2">
            Explore Malta and discover where our feline friends like to hang out.
            Each pin represents a cat waiting to meet you.
          </p>
        </div>

        {/* Map container */}
        <div className="soft-card overflow-hidden p-1.5 sm:p-2">
          <div
            ref={mapContainer}
            className="relative h-64 sm:h-96 md:h-[500px] rounded-xl sm:rounded-2xl bg-gradient-to-br from-[var(--sea-blue)]/10 to-[var(--malta-blue)]/10 overflow-hidden"
          >
            {/* Placeholder map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 sm:p-8 max-w-md">
                <p className="text-5xl sm:text-7xl mb-4 sm:mb-6">🗺️</p>
                <h3 className="text-lg sm:text-2xl font-bold text-[var(--foreground)] mb-2 sm:mb-3">
                  Interactive Map Coming Soon
                </h3>
                <p className="text-sm sm:text-base text-[var(--stone-dark)] leading-relaxed">
                  We&apos;re building an interactive map where you can explore
                  Malta and discover cats by location.
                </p>
              </div>
            </div>

            {/* Location pills at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
              <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-semibold text-[var(--foreground)] mb-2 sm:mb-3">📍 Cat Hotspots</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {uniqueLocations.map((location) => {
                    const count = cats.filter(c => c.location_name === location).length;
                    return (
                      <span
                        key={location}
                        className="text-xs sm:text-sm bg-white/80 text-[var(--foreground)] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm"
                      >
                        {location} <span className="text-[var(--terracotta)] font-semibold">({count})</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location stats */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {uniqueLocations.slice(0, 4).map((location) => {
            const count = cats.filter(c => c.location_name === location).length;
            return (
              <div key={location} className="soft-card p-3 sm:p-5 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[var(--terracotta)]">{count}</p>
                <p className="text-xs sm:text-sm text-[var(--stone-dark)] mt-1">{location}</p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
