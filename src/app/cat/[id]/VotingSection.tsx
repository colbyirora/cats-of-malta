'use client';

import { useState, useEffect } from 'react';
import type { Cat } from '@/lib/types';

interface NameSuggestion {
  id: string;
  cat_id: string;
  suggested_name: string;
  vote_count: number;
  created_at: string;
}

interface VotingSectionProps {
  cat: Cat;
  suggestions: NameSuggestion[];
}

export default function VotingSection({ cat, suggestions }: VotingSectionProps) {
  const [newSuggestion, setNewSuggestion] = useState('');
  const [localSuggestions, setLocalSuggestions] = useState<NameSuggestion[]>(suggestions);
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check localStorage for previous actions
  const [alreadySuggested, setAlreadySuggested] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState<string | null>(null);

  useEffect(() => {
    const suggested = localStorage.getItem(`suggested_${cat.id}`);
    if (suggested) setAlreadySuggested(true);
    const voted = localStorage.getItem(`voted_${cat.id}`);
    if (voted) setAlreadyVoted(voted);
  }, [cat.id]);

  const totalVotes = localSuggestions.reduce((sum, s) => sum + s.vote_count, 0);

  async function fetchSuggestions() {
    try {
      const res = await fetch(`/api/suggestions?cat_id=${cat.id}`);
      if (res.ok) {
        const data = await res.json();
        setLocalSuggestions(data.suggestions);
      }
    } catch {
      // Silently fail on re-fetch; keep existing local state
    }
  }

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.trim() || alreadySuggested) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cat_id: cat.id, suggested_name: newSuggestion.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to submit suggestion');
        setSubmitting(false);
        return;
      }

      // Mark as suggested in localStorage
      localStorage.setItem(`suggested_${cat.id}`, 'true');
      setAlreadySuggested(true);
      setNewSuggestion('');

      // Re-fetch suggestions to show the updated list
      await fetchSuggestions();
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (suggestionId: string) => {
    if (alreadyVoted || voting) return;

    setVoting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion_id: suggestionId }),
      });

      if (res.status === 409) {
        setErrorMsg('You have already voted for this cat.');
        localStorage.setItem(`voted_${cat.id}`, suggestionId);
        setAlreadyVoted(suggestionId);
        setVoting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to submit vote');
        setVoting(false);
        return;
      }

      // Mark as voted in localStorage
      localStorage.setItem(`voted_${cat.id}`, suggestionId);
      setAlreadyVoted(suggestionId);

      // Re-fetch suggestions to show updated vote counts
      await fetchSuggestions();
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="mt-8 soft-card p-8 bg-[var(--cream)]">
      {/* Error message */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm text-center">
          {errorMsg}
        </div>
      )}

      {cat.voting_status === 'suggesting' ? (
        <>
          <div className="text-center mb-6">
            <span className="inline-block bg-[var(--golden-sun)] text-white px-4 py-1 rounded-full text-sm font-bold mb-2">
              Suggestion Phase
            </span>
            <h2 className="text-2xl font-bold text-[var(--terracotta-dark)]">
              Help name this cat!
            </h2>
            <p className="text-[var(--stone-dark)]">
              Submit your name suggestion. Voting begins next week!
            </p>
          </div>

          {/* Suggestion form */}
          <form onSubmit={handleSuggest} className="max-w-md mx-auto mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                placeholder="Enter a name..."
                maxLength={30}
                className="flex-1 px-5 py-3 rounded-full soft-input"
                disabled={alreadySuggested || submitting}
              />
              <button
                type="submit"
                disabled={!newSuggestion.trim() || alreadySuggested || submitting}
                className="soft-button px-6 py-3 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : alreadySuggested ? 'Submitted!' : 'Suggest'}
              </button>
            </div>
          </form>

          {/* Current suggestions */}
          {localSuggestions.length > 0 && (
            <div>
              <h3 className="font-bold text-[var(--foreground)] mb-3">Current Suggestions:</h3>
              <div className="flex flex-wrap gap-2">
                {localSuggestions.map((s) => (
                  <span
                    key={s.id}
                    className="bg-white px-4 py-2 rounded-full text-sm shadow-sm"
                  >
                    {s.suggested_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <span className="inline-block bg-[var(--malta-blue)] text-white px-4 py-1 rounded-full text-sm font-bold mb-2">
              Voting Phase
            </span>
            <h2 className="text-2xl font-bold text-[var(--terracotta-dark)]">
              Vote for a name!
            </h2>
            <p className="text-[var(--stone-dark)]">
              Choose your favorite name. One vote per person.
            </p>
          </div>

          {/* Already voted message */}
          {alreadyVoted && (
            <p className="text-center mb-4 text-[var(--stone-dark)] text-sm">
              Thanks for voting! Results will be announced at the end of the voting period.
            </p>
          )}

          {/* Voting options */}
          <div className="space-y-3 max-w-md mx-auto">
            {localSuggestions
              .sort((a, b) => b.vote_count - a.vote_count)
              .map((s) => {
                const percentage = totalVotes > 0 ? (s.vote_count / totalVotes) * 100 : 0;
                const isVoted = alreadyVoted === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => handleVote(s.id)}
                    disabled={!!alreadyVoted || voting}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                      isVoted
                        ? 'bg-[var(--terracotta)]/10 shadow-md'
                        : alreadyVoted
                        ? 'bg-white/50 opacity-60'
                        : 'bg-white hover:shadow-md hover:scale-[1.02]'
                    }`}
                  >
                    {/* Vote percentage bar */}
                    <div
                      className="absolute inset-0 bg-[var(--terracotta)]/15 transition-all duration-500 rounded-2xl"
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative flex justify-between items-center">
                      <span className="font-medium">{s.suggested_name}</span>
                      <span className="text-sm text-[var(--stone-dark)]">
                        {s.vote_count} vote{s.vote_count !== 1 ? 's' : ''} ({percentage.toFixed(0)}%)
                      </span>
                    </div>

                    {isVoted && (
                      <span className="relative text-xs text-[var(--terracotta)] mt-1 block">
                        Your vote
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
