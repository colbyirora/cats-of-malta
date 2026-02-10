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
      // keep existing local state
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

      localStorage.setItem(`suggested_${cat.id}`, 'true');
      setAlreadySuggested(true);
      setNewSuggestion('');
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

      localStorage.setItem(`voted_${cat.id}`, suggestionId);
      setAlreadyVoted(suggestionId);
      await fetchSuggestions();
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="mt-8 sm:mt-10">
      {/* Error message */}
      {errorMsg && (
        <div
          className="mb-4 p-3 text-sm text-center"
          style={{ background: '#FFF0EB', color: '#D0806C', borderRadius: '16px', border: '2px solid #E8927C' }}
        >
          {errorMsg}
        </div>
      )}

      {cat.voting_status === 'suggesting' ? (
        /* ── SUGGESTION PHASE ── */
        <div
          className="p-5 sm:p-[30px] flex justify-center"
          style={{
            borderRadius: '20px',
            background: '#FFF0EB',
            backgroundImage:
              'radial-gradient(#E8927C 15%, transparent 16%), radial-gradient(#E8927C 15%, transparent 16%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        >
          <div
            className="bg-white w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-5 relative overflow-hidden p-5 sm:p-6"
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(232, 146, 124, 0.15)',
              border: '2px solid #E8927C',
            }}
          >
            {/* Pencil watermark */}
            <div
              className="absolute -top-2.5 -right-2.5 text-[80px] opacity-50 pointer-events-none"
              style={{ color: '#F5E6D3', transform: 'rotate(15deg)' }}
            >
              &#x270E;
            </div>

            <div className="z-10 text-center md:text-left">
              <h3
                className="flex items-center gap-2 text-xl mb-1 flex-wrap justify-center md:justify-start"
                style={{ color: '#2D2D2D', fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                &#x1F4A1; Suggestion Phase
                <span
                  className="text-xs px-2 py-0.5 text-white"
                  style={{ background: '#E8927C', borderRadius: '10px' }}
                >
                  ACTIVE
                </span>
              </h3>
              <p className="text-[15px]" style={{ color: '#8B8178' }}>
                Help name this cat! Submit your name suggestion.
              </p>
            </div>

            <form onSubmit={handleSuggest} className="z-10 flex gap-2.5 w-full md:w-auto">
              <input
                type="text"
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                placeholder="Type a name..."
                maxLength={30}
                disabled={alreadySuggested || submitting}
                className="flex-1 md:w-auto px-5 py-2.5 outline-none transition-colors"
                style={{
                  border: '2px solid #F5E6D3',
                  borderRadius: '50px',
                  color: '#2D2D2D',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#7AAFB5'; }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#F5E6D3'; }}
              />
              <button
                type="submit"
                disabled={!newSuggestion.trim() || alreadySuggested || submitting}
                className="px-5 py-2.5 border-none text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
                style={{
                  fontFamily: 'var(--font-fredoka), sans-serif',
                  background: '#E8927C',
                  borderRadius: '50px',
                  boxShadow: '0 4px 0 #D0806C, 0 8px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {submitting ? 'Sending...' : alreadySuggested ? 'Submitted!' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ── VOTING PHASE ── */
        <div
          className="p-5 sm:p-[30px]"
          style={{
            borderRadius: '20px',
            background: '#EBF5F7',
            backgroundImage:
              'radial-gradient(#7AAFB5 15%, transparent 16%), radial-gradient(#7AAFB5 15%, transparent 16%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        >
          <div
            className="bg-white w-full p-5 sm:p-6 relative overflow-hidden"
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(122, 175, 181, 0.15)',
              border: '2px solid #7AAFB5',
            }}
          >
            {/* Ballot watermark */}
            <div
              className="absolute -top-2 -right-2 text-[70px] opacity-40 pointer-events-none"
              style={{ color: '#F5E6D3', transform: 'rotate(15deg)' }}
            >
              &#x2718;
            </div>

            <div className="text-center mb-5 z-10 relative">
              <h3
                className="flex items-center gap-2 text-xl mb-1 justify-center"
                style={{ color: '#2D2D2D', fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                &#x1F5F3;&#xFE0F; Vote for a name!
                <span
                  className="text-xs px-2 py-0.5 text-white"
                  style={{ background: '#7AAFB5', borderRadius: '10px' }}
                >
                  LIVE
                </span>
              </h3>
              <p className="text-[15px]" style={{ color: '#8B8178' }}>
                Choose your favorite name. One vote per person.
              </p>
            </div>

            {/* Already voted message */}
            {alreadyVoted && (
              <p className="text-center mb-4 text-sm" style={{ color: '#7AAFB5' }}>
                Thanks for voting! Results will be announced at the end of the voting period.
              </p>
            )}

            {/* Voting options */}
            <div className="space-y-3 max-w-md mx-auto relative z-10">
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
                      className="w-full p-4 text-left relative overflow-hidden"
                      style={{
                        borderRadius: '16px',
                        border: isVoted ? '2px solid #7AAFB5' : '2px solid #F5E6D3',
                        background: isVoted ? '#EBF5F7' : alreadyVoted ? 'rgba(255,255,255,0.5)' : 'white',
                        opacity: alreadyVoted && !isVoted ? 0.6 : 1,
                        cursor: alreadyVoted ? 'default' : 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: isVoted ? '0 4px 12px rgba(122, 175, 181, 0.2)' : 'none',
                        transform: 'translateY(0)',
                      }}
                      onMouseEnter={(e) => {
                        if (!alreadyVoted) {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(139, 129, 120, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!alreadyVoted) {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }
                      }}
                    >
                      {/* Vote percentage bar */}
                      <div
                        className="absolute inset-0 transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          background: isVoted ? 'rgba(122, 175, 181, 0.15)' : 'rgba(232, 146, 124, 0.1)',
                          borderRadius: '16px',
                        }}
                      />

                      <div className="relative flex justify-between items-center">
                        <span className="font-medium" style={{ color: '#2D2D2D', fontFamily: 'var(--font-fredoka), sans-serif' }}>
                          {s.suggested_name}
                        </span>
                        <span className="text-sm" style={{ color: '#8B8178' }}>
                          {s.vote_count} vote{s.vote_count !== 1 ? 's' : ''} ({percentage.toFixed(0)}%)
                        </span>
                      </div>

                      {isVoted && (
                        <span className="relative text-xs mt-1 block" style={{ color: '#7AAFB5' }}>
                          &#x2713; Your vote
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Current suggestions list (shown during suggestion phase) */}
      {cat.voting_status === 'suggesting' && localSuggestions.length > 0 && (
        <div className="mt-5">
          <h3
            className="font-bold mb-3 text-base"
            style={{ color: '#2D2D2D', fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Current Suggestions:
          </h3>
          <div className="flex flex-wrap gap-2">
            {localSuggestions.map((s) => (
              <span
                key={s.id}
                className="bg-white px-4 py-2 text-sm font-medium"
                style={{
                  border: '2px solid #F5E6D3',
                  borderRadius: '50px',
                  color: '#8B8178',
                  boxShadow: '0 2px 6px rgba(139, 129, 120, 0.1)',
                }}
              >
                {s.suggested_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
