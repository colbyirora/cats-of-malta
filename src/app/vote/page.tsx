import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import type { Cat, NameSuggestion } from '@/lib/types';
import VoteCard from './VoteCard';

export const revalidate = 30;

export default async function VotePage() {
  // Fetch cats that are in suggesting or voting status and approved
  const { data: cats, error } = await supabase
    .from('cats')
    .select('*')
    .in('voting_status', ['suggesting', 'voting'])
    .eq('approved', true)
    .order('created_at', { ascending: false });

  let catsWithSuggestions: (Cat & { suggestions: NameSuggestion[] })[] = [];

  if (cats && cats.length > 0) {
    // Fetch name suggestions for all voting cats
    const catIds = cats.map((c: Cat) => c.id);
    const { data: suggestions } = await supabase
      .from('name_suggestions')
      .select('*')
      .in('cat_id', catIds)
      .order('vote_count', { ascending: false });

    // Group suggestions by cat_id
    const suggestionsByCat: Record<string, NameSuggestion[]> = {};
    for (const s of (suggestions || []) as NameSuggestion[]) {
      if (!suggestionsByCat[s.cat_id]) {
        suggestionsByCat[s.cat_id] = [];
      }
      suggestionsByCat[s.cat_id].push(s);
    }

    catsWithSuggestions = (cats as Cat[]).map((cat) => ({
      ...cat,
      suggestions: suggestionsByCat[cat.id] || [],
    }));
  }

  if (error) {
    console.error('Error fetching voting cats:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--warm-white)] to-[var(--cream)]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-8 pb-24">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
            Vote for <span className="text-[var(--terracotta)]">Names</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--stone-dark)] max-w-2xl mx-auto px-2">
            Help us name Malta&apos;s street cats! Vote for your favorite name suggestions below.
          </p>
        </div>

        {/* Voting Cards */}
        {catsWithSuggestions.length > 0 ? (
          <div className="space-y-6">
            {catsWithSuggestions.map((cat) => (
              <VoteCard
                key={cat.id}
                cat={cat}
                initialSuggestions={cat.suggestions}
              />
            ))}
          </div>
        ) : (
          <div className="soft-card p-12 text-center bg-white">
            <p className="text-6xl mb-4">🗳️</p>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              No Active Votes
            </h2>
            <p className="text-[var(--stone-dark)] mb-6">
              There are no cats currently up for name voting. Check back soon!
            </p>
            <Link
              href="/#gallery"
              className="inline-block soft-button px-8 py-3 font-semibold"
            >
              Browse All Cats
            </Link>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 soft-card p-6 bg-[var(--cream)]/50">
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
            How Voting Works
          </h3>
          <ul className="space-y-2 text-sm text-[var(--stone-dark)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--golden-sun)]">1.</span>
              Community members suggest names for unnamed cats
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#e67e22]">2.</span>
              After suggestions close, voting begins for 48 hours
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--terracotta)]">3.</span>
              The name with the most votes becomes the cat&apos;s official &apos;unofficial&apos; name!
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
