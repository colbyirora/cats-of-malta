'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sampleCats, sampleNameSuggestions } from '@/lib/sample-data';

// Simulated voting end dates (in production, this would come from the database)
const votingEndDates: Record<string, Date> = {
  '2': new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
};

function CountdownTimer({ endDate }: { endDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-1.5 sm:gap-2 justify-center">
      {[
        { value: timeLeft.days, label: 'd' },
        { value: timeLeft.hours, label: 'h' },
        { value: timeLeft.minutes, label: 'm' },
        { value: timeLeft.seconds, label: 's' },
      ].map((item, index) => (
        <div key={index} className="bg-white/90 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm">
          <span className="text-base sm:text-xl font-bold text-[var(--terracotta)]">{String(item.value).padStart(2, '0')}</span>
          <span className="text-[10px] sm:text-xs text-[var(--stone-dark)] ml-0.5 sm:ml-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface VoteCardProps {
  cat: typeof sampleCats[0];
  suggestions: typeof sampleNameSuggestions;
}

function VoteCard({ cat, suggestions }: VoteCardProps) {
  const [selectedName, setSelectedName] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const catSuggestions = suggestions.filter((s) => s.cat_id === cat.id);
  const totalVotes = catSuggestions.reduce((sum, s) => sum + s.vote_count, 0);

  const handleVote = async () => {
    if (!selectedName) return;
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setHasVoted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="soft-card p-4 sm:p-6 bg-white">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Cat Photo */}
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <Link href={`/cat/${cat.id}`}>
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Image
                src={cat.primary_photo}
                alt="Cat photo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
              />
            </div>
          </Link>
        </div>

        {/* Voting Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Help Name This Cat!
              </h3>
              <p className="text-sm text-[var(--stone-dark)]">
                {cat.location_name} &bull; {cat.color}
              </p>
            </div>
            <span className="bg-[var(--terracotta)] text-white text-xs px-3 py-1 rounded-full font-semibold">
              {totalVotes} votes
            </span>
          </div>

          {/* Countdown */}
          <div className="mb-4">
            <p className="text-xs text-[var(--stone-dark)] mb-2 text-center">Voting ends in:</p>
            <CountdownTimer endDate={votingEndDates[cat.id] || new Date(Date.now() + 24 * 60 * 60 * 1000)} />
          </div>

          {hasVoted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-medium">Thank you for voting!</p>
              <p className="text-sm text-green-600">You voted for &quot;{selectedName}&quot;</p>
            </div>
          ) : (
            <>
              {/* Name Options */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                  Choose your favorite name:
                </label>
                <select
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl soft-input bg-white text-[var(--foreground)]"
                >
                  <option value="">Select a name...</option>
                  {catSuggestions.map((suggestion) => (
                    <option key={suggestion.id} value={suggestion.suggested_name}>
                      {suggestion.suggested_name} ({suggestion.vote_count} votes)
                    </option>
                  ))}
                </select>
              </div>

              {/* Vote Button */}
              <button
                onClick={handleVote}
                disabled={!selectedName || isSubmitting}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-dark)] shadow-md hover:shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Cast My Vote'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VotePage() {
  const votingCats = sampleCats.filter((cat) => cat.voting_status === 'voting');

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
        {votingCats.length > 0 ? (
          <div className="space-y-6">
            {votingCats.map((cat) => (
              <VoteCard
                key={cat.id}
                cat={cat}
                suggestions={sampleNameSuggestions}
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
