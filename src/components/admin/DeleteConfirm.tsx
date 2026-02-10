'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Cat } from '@/lib/types';

interface DeleteConfirmProps {
  cat: Cat;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ cat, onConfirm, onCancel }: DeleteConfirmProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/cats/${cat.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete cat');
      }

      onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="soft-card relative z-10 w-full max-w-sm p-6 text-center"
        style={{ background: 'var(--warm-white)' }}
      >
        {/* Cat thumbnail */}
        {cat.primary_photo && (
          <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-2xl border-2"
            style={{ borderColor: 'var(--stone)' }}
          >
            <Image
              src={cat.primary_photo}
              alt={cat.name || 'Cat'}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h3
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--foreground)', fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Delete this cat?
        </h3>

        <p className="text-sm mb-5" style={{ color: 'var(--stone-dark)' }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: 'var(--foreground)' }}>
            {cat.name || 'this unnamed cat'}
          </strong>
          ? This action cannot be undone.
        </p>

        {error && (
          <div
            className="text-sm mb-4 py-2 px-3 rounded-xl"
            style={{
              color: 'var(--terracotta-dark)',
              background: 'rgba(196, 30, 58, 0.08)',
            }}
          >
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 px-4 rounded-full font-semibold text-sm transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: 'var(--stone)',
              color: 'var(--foreground)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 px-4 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, var(--terracotta) 0%, var(--terracotta-dark) 100%)',
              boxShadow: '0 4px 15px rgba(196, 30, 58, 0.35)',
            }}
          >
            {deleting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
