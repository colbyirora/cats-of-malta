'use client';

import { useState } from 'react';
import CatCard from './CatCard';
import type { Cat } from '@/lib/types';

interface CatGalleryProps {
  cats: Cat[];
}

type FilterType = 'all' | 'named' | 'voting' | 'suggesting';

export default function CatGallery({ cats }: CatGalleryProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCats = cats.filter((cat) => {
    if (filter === 'named' && !cat.name) return false;
    if (filter === 'voting' && cat.voting_status !== 'voting') return false;
    if (filter === 'suggesting' && cat.voting_status !== 'suggesting') return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        cat.name?.toLowerCase().includes(query) ||
        cat.location_name.toLowerCase().includes(query) ||
        cat.color.toLowerCase().includes(query) ||
        cat.breed?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const filterButtons: { key: FilterType; label: string; emoji: string }[] = [
    { key: 'all', label: 'All Cats', emoji: '🐱' },
    { key: 'named', label: 'Named', emoji: '📛' },
    { key: 'voting', label: 'Vote Now', emoji: '🗳️' },
    { key: 'suggesting', label: 'Suggest Names', emoji: '💡' },
  ];

  return (
    <section id="gallery" className="py-12 sm:py-20 px-4 sm:px-6 bg-[var(--warm-white)] cat-pattern">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--foreground)] mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
            Meet the Locals
          </h2>
          <p className="text-base sm:text-lg text-[var(--stone-dark)] max-w-2xl mx-auto leading-relaxed px-2">
            Meet the beloved felines who call Malta home. Click on any cat to learn their story,
            or help name the ones still waiting for their purrfect name.
          </p>
        </div>

        {/* Filters and search */}
        <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 min-h-[44px] ${
                  filter === btn.key
                    ? 'bg-[var(--terracotta)] text-white shadow-lg shadow-[var(--terracotta)]/25'
                    : 'bg-white text-[var(--foreground)] hover:bg-[var(--cream)] shadow-sm'
                }`}
              >
                {btn.emoji} <span className="hidden sm:inline">{btn.label}</span><span className="sm:hidden">{btn.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="max-w-md mx-auto px-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 pl-10 sm:pl-12 rounded-2xl soft-input text-sm sm:text-base"
              />
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--stone-dark)]">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-center text-sm text-[var(--stone-dark)] mb-8">
          Showing {filteredCats.length} of {cats.length} cats
        </p>

        {/* Cat grid - polaroid style with extra spacing */}
        {filteredCats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12 pt-4 px-2">
            {filteredCats.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">😿</p>
            <p className="text-xl text-[var(--stone-dark)]">No cats found matching your criteria</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 text-[var(--terracotta)] hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

    </section>
  );
}
