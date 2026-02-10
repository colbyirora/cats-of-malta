'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Cat } from '@/lib/types';
import CatForm from '@/components/admin/CatForm';
import DeleteConfirm from '@/components/admin/DeleteConfirm';

type VotingStatus = Cat['voting_status'];

const votingStatusLabels: Record<VotingStatus, string> = {
  none: 'No vote',
  suggesting: 'Suggesting',
  voting: 'Voting',
  complete: 'Complete',
};

const votingStatusColors: Record<VotingStatus, { bg: string; text: string }> = {
  none: { bg: 'var(--stone)', text: 'var(--foreground)' },
  suggesting: { bg: 'var(--malta-blue)', text: 'white' },
  voting: { bg: 'var(--golden-sun)', text: 'white' },
  complete: { bg: 'var(--terracotta)', text: 'white' },
};

export default function AdminDashboardPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | undefined>(undefined);
  const [deletingCat, setDeletingCat] = useState<Cat | null>(null);

  const fetchCats = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/cats');
      if (!res.ok) {
        throw new Error('Failed to fetch cats');
      }
      const data = await res.json();
      setCats(data.cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  function handleAddNew() {
    setEditingCat(undefined);
    setShowForm(true);
  }

  function handleEdit(cat: Cat) {
    setEditingCat(cat);
    setShowForm(true);
  }

  function handleSave(savedCat: Cat) {
    if (editingCat) {
      setCats((prev) => prev.map((c) => (c.id === savedCat.id ? savedCat : c)));
    } else {
      setCats((prev) => [savedCat, ...prev]);
    }
    setShowForm(false);
    setEditingCat(undefined);
  }

  function handleDeleteConfirm() {
    if (deletingCat) {
      setCats((prev) => prev.filter((c) => c.id !== deletingCat.id));
    }
    setDeletingCat(null);
  }

  async function handleVotingAction(catId: string, action: string) {
    try {
      setError('');
      const res = await fetch('/api/admin/voting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cat_id: catId, action }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Voting action failed');
        return;
      }

      const data = await res.json();
      // Update the cat in local state with the returned cat
      if (data.cat) {
        setCats((prev) => prev.map((c) => (c.id === data.cat.id ? data.cat : c)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voting action failed');
    }
  }

  return (
    <>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              color: 'var(--foreground)',
              fontFamily: 'var(--font-fredoka), sans-serif',
            }}
          >
            Manage Cats
            {!loading && (
              <span
                className="ml-3 text-lg font-normal align-middle inline-block px-3 py-0.5 rounded-full"
                style={{
                  background: 'var(--stone)',
                  color: 'var(--stone-dark)',
                  fontFamily: 'inherit',
                }}
              >
                {cats.length}
              </span>
            )}
          </h2>
          <p
            className="mt-1"
            style={{
              color: 'var(--stone-dark)',
              fontFamily: 'var(--font-caveat), cursive',
              fontSize: '1.1rem',
            }}
          >
            Add, edit, and manage the island&apos;s feline friends
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="soft-button px-6 py-3 font-semibold text-sm inline-flex items-center gap-2 self-start"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Cat
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="soft-card p-4 mb-6 text-center"
          style={{
            color: 'var(--terracotta-dark)',
            background: 'rgba(196, 30, 58, 0.06)',
            border: '1px solid rgba(196, 30, 58, 0.15)',
          }}
        >
          <p className="font-medium">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchCats();
            }}
            className="mt-2 text-sm underline hover:no-underline"
            style={{ color: 'var(--terracotta)' }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-10 w-10 mb-4" style={{ color: 'var(--terracotta)' }} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--stone-dark)' }}>
            Loading cats...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && cats.length === 0 && (
        <div className="soft-card p-12 text-center" style={{ background: 'white' }}>
          <div className="text-5xl mb-4">&#128049;</div>
          <h3
            className="text-xl font-bold mb-2"
            style={{
              color: 'var(--foreground)',
              fontFamily: 'var(--font-fredoka), sans-serif',
            }}
          >
            No cats yet
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--stone-dark)' }}>
            Start building your cat collection for Malta!
          </p>
          <button
            onClick={handleAddNew}
            className="soft-button px-6 py-3 font-semibold text-sm inline-flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Cat
          </button>
        </div>
      )}

      {/* Cat grid */}
      {!loading && cats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cats.map((cat) => (
            <div
              key={cat.id}
              className="soft-card overflow-hidden flex flex-col"
              style={{ background: 'white' }}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden" style={{ background: 'var(--stone)' }}>
                {cat.primary_photo ? (
                  <Image
                    src={cat.primary_photo}
                    alt={cat.name || 'Cat'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl opacity-30">
                    &#128008;
                  </div>
                )}

                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {cat.approved ? (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'var(--golden-sun)',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(245, 182, 66, 0.4)',
                      }}
                    >
                      Approved
                    </span>
                  ) : (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                      }}
                    >
                      Draft
                    </span>
                  )}
                  {cat.voting_status !== 'none' && (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: votingStatusColors[cat.voting_status].bg,
                        color: votingStatusColors[cat.voting_status].text,
                      }}
                    >
                      {votingStatusLabels[cat.voting_status]}
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col">
                <h3
                  className="font-bold text-lg mb-1 truncate"
                  style={{
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-fredoka), sans-serif',
                  }}
                >
                  {cat.name || (
                    <span style={{ color: 'var(--stone-dark)', fontStyle: 'italic' }}>
                      Unnamed
                    </span>
                  )}
                </h3>

                <div className="space-y-1 text-sm flex-1" style={{ color: 'var(--stone-dark)' }}>
                  <p className="flex items-center gap-1.5 truncate">
                    <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {cat.location_name}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    {cat.color}
                  </p>
                  {cat.is_stray && (
                    <p className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Street cat
                    </p>
                  )}
                </div>

                {/* Voting Controls */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid var(--stone)' }}>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: votingStatusColors[cat.voting_status].bg,
                      color: votingStatusColors[cat.voting_status].text,
                    }}
                  >
                    {votingStatusLabels[cat.voting_status]}
                  </span>

                  {cat.voting_status === 'none' && cat.name === null && (
                    <button
                      onClick={() => handleVotingAction(cat.id, 'start_suggesting')}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                      style={{
                        background: 'var(--malta-blue)',
                        color: 'white',
                      }}
                    >
                      Start Suggestions
                    </button>
                  )}

                  {cat.voting_status === 'suggesting' && (
                    <button
                      onClick={() => handleVotingAction(cat.id, 'start_voting')}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                      style={{
                        background: 'var(--golden-sun)',
                        color: 'white',
                      }}
                    >
                      Start Voting
                    </button>
                  )}

                  {cat.voting_status === 'voting' && (
                    <button
                      onClick={() => handleVotingAction(cat.id, 'complete')}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                      style={{
                        background: 'var(--terracotta)',
                        color: 'white',
                      }}
                    >
                      Complete Voting
                    </button>
                  )}

                  {cat.voting_status !== 'none' && (
                    <button
                      onClick={() => handleVotingAction(cat.id, 'reset')}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                      style={{
                        background: 'rgba(196, 30, 58, 0.08)',
                        color: 'var(--terracotta)',
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--stone)' }}>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                    style={{
                      background: 'var(--cream)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingCat(cat)}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                    style={{
                      background: 'rgba(196, 30, 58, 0.08)',
                      color: 'var(--terracotta)',
                    }}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cat Form Modal */}
      {showForm && (
        <CatForm
          cat={editingCat}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCat(undefined);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCat && (
        <DeleteConfirm
          cat={deletingCat}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCat(null)}
        />
      )}
    </>
  );
}
