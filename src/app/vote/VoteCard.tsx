'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Cat, NameSuggestion } from '@/lib/types';

// Generates a fake countdown (2 days from mount) - fine for now
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
  cat: Cat;
  initialSuggestions: NameSuggestion[];
}

export default function VoteCard({ cat, initialSuggestions }: VoteCardProps) {
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>(initialSuggestions);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [votedName, setVotedName] = useState('');
  const [hasSuggested, setHasSuggested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newSuggestion, setNewSuggestion] = useState('');

  // Fake countdown end date (2 days from now)
  const [endDate] = useState(() => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));

  const totalVotes = suggestions.reduce((sum, s) => sum + s.vote_count, 0);

  // Check localStorage on mount to see if user already voted/suggested
  useEffect(() => {
    if (cat.voting_status === 'voting') {
      const stored = localStorage.getItem(`voted_${cat.id}`);
      if (stored) {
        setHasVoted(true);
        setVotedName(stored);
      }
    }
    if (cat.voting_status === 'suggesting') {
      const stored = localStorage.getItem(`suggested_${cat.id}`);
      if (stored) {
        setHasSuggested(true);
      }
    }
  }, [cat.id, cat.voting_status]);

  // Re-fetch suggestions from the API
  const refreshSuggestions = async () => {
    try {
      const res = await fetch(`/api/suggestions?cat_id=${cat.id}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || data);
      }
    } catch {
      // Silently fail - user still sees local state
    }
  };

  // Handle voting (cats in 'voting' status)
  const handleVote = async () => {
    if (!selectedSuggestionId) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion_id: selectedSuggestionId }),
      });

      if (res.status === 409) {
        setErrorMessage('You have already voted for this cat!');
        setHasVoted(true);
        localStorage.setItem(`voted_${cat.id}`, 'a name');
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || 'Failed to submit vote. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Find the name for display
      const votedSuggestion = suggestions.find((s) => s.id === selectedSuggestionId);
      const name = votedSuggestion?.suggested_name || 'your choice';

      setHasVoted(true);
      setVotedName(name);
      localStorage.setItem(`voted_${cat.id}`, name);

      // Refresh suggestions to get updated vote counts
      await refreshSuggestions();
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle suggestion (cats in 'suggesting' status)
  const handleSuggest = async () => {
    if (!newSuggestion.trim()) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cat_id: cat.id, suggested_name: newSuggestion.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || 'Failed to submit suggestion. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setHasSuggested(true);
      setNewSuggestion('');
      localStorage.setItem(`suggested_${cat.id}`, 'true');

      // Refresh suggestions to show the new one
      await refreshSuggestions();
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- VOTING STATUS: 'voting' ---
  if (cat.voting_status === 'voting') {
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
              <CountdownTimer endDate={endDate} />
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            {hasVoted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-700 font-medium">Thank you for voting!</p>
                <p className="text-sm text-green-600">You voted for &quot;{votedName}&quot;</p>
              </div>
            ) : (
              <>
                {/* Name Options */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    Choose your favorite name:
                  </label>
                  <select
                    value={selectedSuggestionId}
                    onChange={(e) => setSelectedSuggestionId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl soft-input bg-white text-[var(--foreground)]"
                  >
                    <option value="">Select a name...</option>
                    {suggestions.map((suggestion) => (
                      <option key={suggestion.id} value={suggestion.id}>
                        {suggestion.suggested_name} ({suggestion.vote_count} votes)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vote Button */}
                <button
                  onClick={handleVote}
                  disabled={!selectedSuggestionId || isSubmitting}
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

  // --- VOTING STATUS: 'suggesting' ---
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

        {/* Suggesting Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Suggest a Name!
              </h3>
              <p className="text-sm text-[var(--stone-dark)]">
                {cat.location_name} &bull; {cat.color}
              </p>
            </div>
            <span className="bg-[var(--golden-sun)] text-white text-xs px-3 py-1 rounded-full font-semibold">
              Suggesting
            </span>
          </div>

          {/* Countdown */}
          <div className="mb-4">
            <p className="text-xs text-[var(--stone-dark)] mb-2 text-center">Suggestions close in:</p>
            <CountdownTimer endDate={endDate} />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          {hasSuggested ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-4">
              <p className="text-green-700 font-medium">Thank you for your suggestion!</p>
              <p className="text-sm text-green-600">Voting will begin once the suggestion phase ends.</p>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                Suggest a name for this cat:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSuggestion}
                  onChange={(e) => setNewSuggestion(e.target.value)}
                  placeholder="Enter a name..."
                  maxLength={30}
                  className="flex-1 px-4 py-3 rounded-xl soft-input bg-white text-[var(--foreground)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSuggest();
                    }
                  }}
                />
                <button
                  onClick={handleSuggest}
                  disabled={!newSuggestion.trim() || isSubmitting}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-dark)] shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Suggest'}
                </button>
              </div>
            </div>
          )}

          {/* Current suggestions as pill badges */}
          {suggestions.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)] mb-2">Current suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <span
                    key={s.id}
                    className="bg-[var(--cream)] px-4 py-1.5 rounded-full text-sm text-[var(--foreground)] shadow-sm border border-[var(--stone)]/20"
                  >
                    {s.suggested_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
