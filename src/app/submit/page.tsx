'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SubmitCatPage() {
  const [formData, setFormData] = useState({
    photo: null as File | null,
    location_name: '',
    location_lat: '',
    location_lng: '',
    breed: '',
    age: '',
    color: '',
    is_stray: true,
    background_story: '',
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // In production, this would upload to Supabase
    // For now, simulate success
    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you for your submission! Our team will review it shortly.');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[var(--warm-white)]">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="soft-card p-10 bg-[var(--cream)]">
            <p className="text-6xl mb-4">🎉</p>
            <h1 className="text-3xl font-bold text-[var(--terracotta-dark)] mb-4">
              Submission Received!
            </h1>
            <p className="text-[var(--stone-dark)] mb-6">{message}</p>
            <a href="/" className="soft-button inline-block px-8 py-4">
              Back to Home
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--warm-white)]">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-6 sm:pt-8 pb-16 sm:pb-20">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--terracotta-dark)] mb-2">
            📸 Submit a Cat 📸
          </h1>
          <p className="text-sm sm:text-base text-[var(--stone-dark)] px-2">
            Spotted a cat in Malta? Share it with the community!
            All submissions are reviewed before being added.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="soft-card p-5 sm:p-8 bg-[var(--cream)]">
          {/* Photo upload */}
          <div className="mb-6 sm:mb-8">
            <label className="block font-bold text-sm sm:text-base text-[var(--foreground)] mb-2 sm:mb-3">
              Cat Photo *
            </label>
            <div className="border-2 border-dashed border-[var(--stone)]/50 rounded-2xl p-6 text-center bg-white/50">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFormData({ ...formData, photo: null });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block py-8">
                  <span className="text-4xl block mb-2">📷</span>
                  <span className="text-[var(--terracotta)] font-medium">
                    Click to upload a photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mb-6 sm:mb-8">
            <label className="block font-bold text-sm sm:text-base text-[var(--foreground)] mb-2 sm:mb-3">
              Where did you find this cat? *
            </label>
            <input
              type="text"
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              placeholder="e.g., Valletta Upper Barrakka Gardens"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl soft-input text-sm sm:text-base"
              required
            />
            <p className="text-xs text-[var(--stone-dark)] mt-2">
              Be as specific as possible - street name, landmark, etc.
            </p>
          </div>

          {/* Cat details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
            <div>
              <label className="block font-bold text-sm sm:text-base text-[var(--foreground)] mb-2 sm:mb-3">
                Color *
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g., Orange tabby, Black and white"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl soft-input text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base text-[var(--foreground)] mb-2 sm:mb-3">
                Breed (if known)
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="e.g., Mixed, Siamese, Unknown"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl soft-input text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base text-[var(--foreground)] mb-2 sm:mb-3">
                Estimated Age
              </label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., Kitten, ~2 years, Senior"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl soft-input text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base text-[var(--foreground)] mb-2 sm:mb-3">
                Is this a stray?
              </label>
              <select
                value={formData.is_stray ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, is_stray: e.target.value === 'yes' })}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl soft-input bg-white text-sm sm:text-base"
              >
                <option value="yes">Yes, appears to be a stray</option>
                <option value="no">No, seems to have a home</option>
              </select>
            </div>
          </div>

          {/* Story */}
          <div className="mb-6 sm:mb-8">
            <label className="block font-bold text-sm sm:text-base text-[var(--foreground)] mb-2 sm:mb-3">
              Tell us about this cat
            </label>
            <textarea
              value={formData.background_story}
              onChange={(e) => setFormData({ ...formData, background_story: e.target.value })}
              placeholder="Any interesting details? Friendly? Shy? Has a favorite spot?"
              rows={4}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl soft-input resize-none text-sm sm:text-base"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'loading' || !formData.photo || !formData.location_name || !formData.color}
            className="w-full soft-button py-3 sm:py-4 text-base sm:text-lg font-bold disabled:opacity-50 min-h-[44px]"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Cat 🐱'}
          </button>

          <p className="text-xs text-[var(--stone-dark)] text-center mt-4 sm:mt-6">
            By submitting, you confirm this is your own photo and agree to have it shared on Cats of Malta.
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}
