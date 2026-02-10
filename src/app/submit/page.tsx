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

    try {
      const body = new FormData();
      if (formData.photo) body.append('photo', formData.photo);
      body.append('location_name', formData.location_name);
      body.append('location_lat', formData.location_lat || '35.9');
      body.append('location_lng', formData.location_lng || '14.5');
      body.append('color', formData.color);
      body.append('breed', formData.breed);
      body.append('age', formData.age);
      body.append('is_stray', String(formData.is_stray));
      body.append('background_story', formData.background_story);

      const res = await fetch('/api/submit', { method: 'POST', body });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setStatus('success');
      setMessage('Thank you for your submission! Our team will review it shortly.');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
        <Header />
        <main className="flex justify-center items-start px-5 py-10">
          <div className="w-full max-w-[700px] p-5">
            <div
              className="relative p-10 text-center"
              style={{
                backgroundColor: 'var(--stone)',
                border: '2px solid var(--foreground)',
                borderRadius: '2px',
                boxShadow: '8px 8px 0px rgba(0,0,0,0.1)',
                transform: 'rotate(-1deg)',
              }}
            >
              {/* Tape */}
              <div
                className="absolute left-1/2"
                style={{
                  top: -15,
                  transform: 'translateX(-50%) rotate(2deg)',
                  width: 140,
                  height: 35,
                  backgroundColor: 'var(--malta-blue)',
                  opacity: 0.8,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              />
              <p className="text-6xl mb-4">🎉</p>
              <h1
                className="text-4xl mb-4"
                style={{
                  fontFamily: 'var(--font-mali), cursive',
                  fontWeight: 700,
                  color: 'var(--terracotta)',
                  textShadow: '2px 2px 0px var(--foreground), -1px -1px 0 #fff',
                }}
              >
                Submission Received!
              </h1>
              <p
                className="text-lg mb-8"
                style={{ fontFamily: 'var(--font-patrick-hand), cursive', color: 'var(--stone-dark)' }}
              >
                {message}
              </p>
              <a
                href="/"
                className="inline-block text-white text-xl px-8 py-4 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-mali), cursive',
                  fontWeight: 700,
                  backgroundColor: 'var(--terracotta)',
                  border: '3px solid var(--foreground)',
                  borderRadius: 50,
                  boxShadow: '4px 4px 0 var(--foreground)',
                }}
              >
                Back to Home
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />

      <main
        className="flex justify-center items-start px-5 py-10"
        style={{
          backgroundImage: 'radial-gradient(var(--stone) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        <div className="relative w-full max-w-[700px] p-5">
          {/* Tape */}
          <div
            className="absolute left-1/2 z-20"
            style={{
              top: 5,
              transform: 'translateX(-50%) rotate(2deg)',
              width: 140,
              height: 35,
              backgroundColor: 'var(--malta-blue)',
              opacity: 0.8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />

          {/* Sticker: Paw - top right */}
          <div className="absolute z-20 pointer-events-none hidden md:block" style={{ top: -40, right: -30, width: 80, transform: 'rotate(15deg)', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.1))' }}>
            <svg viewBox="0 0 100 100">
              <path fill="var(--malta-blue)" stroke="var(--foreground)" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" d="M30,60 Q10,50 10,30 Q10,10 30,10 Q50,10 50,30 Q50,10 70,10 Q90,10 90,30 Q90,50 70,60 Q90,80 70,90 Q50,100 30,90 Q10,80 30,60 Z" />
              <circle cx="30" cy="30" r="8" fill="var(--cream)" />
              <circle cx="70" cy="30" r="8" fill="var(--cream)" />
              <ellipse cx="50" cy="70" rx="20" ry="15" fill="var(--cream)" />
            </svg>
          </div>

          {/* Sticker: Star - left */}
          <div className="absolute z-20 pointer-events-none hidden md:block" style={{ top: 150, left: -50, width: 50, transform: 'rotate(-10deg)', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.1))' }}>
            <svg viewBox="0 0 100 100">
              <polygon fill="var(--golden-sun)" stroke="var(--foreground)" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" points="50,10 61,35 88,38 68,58 73,85 50,73 27,85 32,58 12,38 39,35" />
            </svg>
          </div>

          {/* Sticker: Fish - bottom right */}
          <div className="absolute z-20 pointer-events-none hidden md:block" style={{ bottom: 100, right: -60, width: 90, transform: 'rotate(45deg)', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.1))' }}>
            <svg viewBox="0 0 100 50">
              <path fill="var(--terracotta)" stroke="var(--foreground)" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" d="M80,25 Q95,10 95,5 L95,45 Q95,40 80,25 Z M80,25 C60,5 20,5 10,25 C20,45 60,45 80,25" />
              <circle cx="30" cy="20" r="2" fill="var(--foreground)" />
            </svg>
          </div>

          {/* Sticker: Clover - bottom left */}
          <div className="absolute z-20 pointer-events-none hidden md:block" style={{ bottom: -30, left: -40, width: 70, transform: 'rotate(-15deg)', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.1))' }}>
            <svg viewBox="0 0 100 100">
              <path fill="#9CC298" stroke="var(--foreground)" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" d="M50,50 C30,30 10,30 10,50 C10,70 30,70 50,50 C30,70 10,70 10,90 C10,110 30,110 50,90 C70,110 90,110 90,90 C90,70 70,70 50,50 C70,70 90,70 90,50 C90,30 70,30 50,50 Z" />
            </svg>
          </div>

          {/* Main Card */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10"
            style={{
              backgroundColor: 'var(--stone)',
              border: '2px solid var(--foreground)',
              borderRadius: '2px',
              boxShadow: '8px 8px 0px rgba(0,0,0,0.1)',
              padding: 40,
              transform: 'rotate(-1deg)',
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(var(--malta-blue) 1px, transparent 1px), linear-gradient(90deg, var(--malta-blue) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                opacity: 0.08,
                zIndex: -1,
              }}
            />

            {/* Title */}
            <h1
              className="text-center mb-2"
              style={{
                fontFamily: 'var(--font-mali), cursive',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                color: 'var(--terracotta)',
                textShadow: '2px 2px 0px var(--foreground), -1px -1px 0 #fff',
                transform: 'rotate(1deg)',
                letterSpacing: -1,
              }}
            >
              📸 Submit a Cat 📸
            </h1>
            <p
              className="text-center mb-10 mx-auto pb-4"
              style={{
                fontFamily: 'var(--font-patrick-hand), cursive',
                fontSize: '1.2rem',
                color: 'var(--stone-dark)',
                lineHeight: 1.4,
                maxWidth: '90%',
                borderBottom: '2px dashed var(--malta-blue)',
              }}
            >
              Spotted a cat in Malta? Share it with the community! All submissions are reviewed before being added.
            </p>

            {/* Photo Upload */}
            <div className="mb-6">
              <label
                className="block mb-2"
                style={{ fontFamily: 'var(--font-mali), cursive', fontWeight: 700, fontSize: '1.1rem' }}
              >
                Cat Photo
              </label>
              <div
                className="relative overflow-hidden text-center cursor-pointer transition-all duration-300"
                style={{
                  border: '3px dashed var(--malta-blue)',
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: preview ? 10 : 30,
                }}
                onMouseEnter={(e) => {
                  if (!preview) {
                    e.currentTarget.style.backgroundColor = '#f0fcfd';
                    e.currentTarget.style.borderColor = 'var(--terracotta)';
                    e.currentTarget.style.transform = 'rotate(1deg)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.borderColor = 'var(--malta-blue)';
                  e.currentTarget.style.transform = '';
                }}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFormData({ ...formData, photo: null });
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full text-white flex items-center justify-center text-lg"
                      style={{ backgroundColor: 'var(--terracotta)', border: '2px solid var(--foreground)' }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <span className="text-5xl block mb-2" style={{ filter: 'drop-shadow(2px 2px 0 var(--foreground))' }}>📷</span>
                    <span style={{ fontFamily: 'var(--font-mali), cursive', fontWeight: 700, color: 'var(--foreground)' }}>
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
            <div className="mb-6">
              <label
                className="block mb-2"
                style={{ fontFamily: 'var(--font-mali), cursive', fontWeight: 700, fontSize: '1.1rem' }}
              >
                Where did you find this cat?
              </label>
              <span
                className="block mb-2 italic"
                style={{ fontFamily: 'var(--font-patrick-hand), cursive', fontSize: '0.9rem', color: 'var(--stone-dark)' }}
              >
                Be as specific as possible - street name, landmark, etc.
              </span>
              <input
                type="text"
                value={formData.location_name}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                placeholder="e.g. Near the Upper Barrakka Gardens"
                required
                className="w-full transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-patrick-hand), cursive',
                  fontSize: '1.2rem',
                  padding: '12px 15px',
                  backgroundColor: '#fff',
                  border: '2px solid var(--foreground)',
                  borderRadius: '10px 15px 10px 18px',
                  color: 'var(--foreground)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.transform = 'scale(1.01) rotate(-0.5deg)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 rgba(196, 30, 58, 0.4)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              />
            </div>

            {/* Color + Breed grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label
                  className="block mb-2"
                  style={{ fontFamily: 'var(--font-mali), cursive', fontWeight: 700, fontSize: '1.1rem' }}
                >
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="e.g. Orange tabby"
                  required
                  className="w-full transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-patrick-hand), cursive',
                    fontSize: '1.2rem',
                    padding: '12px 15px',
                    backgroundColor: '#fff',
                    border: '2px solid var(--foreground)',
                    borderRadius: '10px 15px 10px 18px',
                    color: 'var(--foreground)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.transform = 'scale(1.01) rotate(-0.5deg)';
                    e.currentTarget.style.boxShadow = '4px 4px 0 rgba(196, 30, 58, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{ fontFamily: 'var(--font-mali), cursive', fontWeight: 700, fontSize: '1.1rem' }}
                >
                  Breed (if known)
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="e.g. Tabby"
                  className="w-full transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-patrick-hand), cursive',
                    fontSize: '1.2rem',
                    padding: '12px 15px',
                    backgroundColor: '#fff',
                    border: '2px solid var(--foreground)',
                    borderRadius: '10px 15px 10px 18px',
                    color: 'var(--foreground)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.transform = 'scale(1.01) rotate(-0.5deg)';
                    e.currentTarget.style.boxShadow = '4px 4px 0 rgba(196, 30, 58, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                />
              </div>
            </div>

            {/* Age */}
            <div className="mb-6">
              <label
                className="block mb-2"
                style={{ fontFamily: 'var(--font-mali), cursive', fontWeight: 700, fontSize: '1.1rem' }}
              >
                Estimated Age
              </label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g. 2 years, or 'Kitten'"
                className="w-full transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-patrick-hand), cursive',
                  fontSize: '1.2rem',
                  padding: '12px 15px',
                  backgroundColor: '#fff',
                  border: '2px solid var(--foreground)',
                  borderRadius: '10px 15px 10px 18px',
                  color: 'var(--foreground)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.transform = 'scale(1.01) rotate(-0.5deg)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 rgba(196, 30, 58, 0.4)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              />
            </div>

            {/* Is stray - radio buttons */}
            <div className="mb-6">
              <label
                className="block mb-3"
                style={{ fontFamily: 'var(--font-mali), cursive', fontWeight: 700, fontSize: '1.1rem' }}
              >
                Is this a stray?
              </label>
              <div className="flex gap-5 flex-wrap" style={{ fontFamily: 'var(--font-patrick-hand), cursive', fontSize: '1.1rem' }}>
                <label className="relative flex items-center cursor-pointer pl-9">
                  <input
                    type="radio"
                    name="stray"
                    checked={formData.is_stray}
                    onChange={() => setFormData({ ...formData, is_stray: true })}
                    className="absolute opacity-0 cursor-pointer"
                  />
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: formData.is_stray ? 'var(--terracotta)' : '#fff',
                      border: '2px solid var(--foreground)',
                      boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
                    }}
                  >
                    {formData.is_stray && (
                      <span className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  Yes, appears to be a stray
                </label>
                <label className="relative flex items-center cursor-pointer pl-9">
                  <input
                    type="radio"
                    name="stray"
                    checked={!formData.is_stray}
                    onChange={() => setFormData({ ...formData, is_stray: false })}
                    className="absolute opacity-0 cursor-pointer"
                  />
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: !formData.is_stray ? 'var(--terracotta)' : '#fff',
                      border: '2px solid var(--foreground)',
                      boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
                    }}
                  >
                    {!formData.is_stray && (
                      <span className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  No, seems to have a home
                </label>
              </div>
            </div>

            {/* Story - lined textarea */}
            <div className="mb-6">
              <label
                className="block mb-2"
                style={{ fontFamily: 'var(--font-mali), cursive', fontWeight: 700, fontSize: '1.1rem' }}
              >
                Tell us about this cat
              </label>
              <textarea
                value={formData.background_story}
                onChange={(e) => setFormData({ ...formData, background_story: e.target.value })}
                placeholder="Friendly? Shy? Loves treats?"
                rows={4}
                className="w-full transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-patrick-hand), cursive',
                  fontSize: '1.2rem',
                  padding: '5px 15px',
                  backgroundColor: '#fff',
                  border: '2px solid var(--foreground)',
                  borderRadius: '10px 15px 10px 18px',
                  color: 'var(--foreground)',
                  resize: 'vertical',
                  minHeight: 120,
                  backgroundImage: 'linear-gradient(transparent 95%, #E5E5E5 95%)',
                  backgroundSize: '100% 30px',
                  lineHeight: '30px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.transform = 'scale(1.01) rotate(-0.5deg)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 rgba(196, 30, 58, 0.4)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              />
            </div>

            {/* Error message */}
            {status === 'error' && (
              <div
                className="mb-4 p-4 text-sm"
                style={{
                  fontFamily: 'var(--font-patrick-hand), cursive',
                  fontSize: '1rem',
                  backgroundColor: '#fff0f0',
                  border: '2px solid var(--terracotta)',
                  borderRadius: '10px 15px 10px 18px',
                  color: 'var(--terracotta-dark)',
                }}
              >
                {message}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === 'loading' || !formData.photo || !formData.location_name || !formData.color}
              className="w-full text-white cursor-pointer disabled:opacity-50 mt-5 transition-all duration-100"
              style={{
                fontFamily: 'var(--font-mali), cursive',
                fontWeight: 700,
                fontSize: '1.5rem',
                padding: 15,
                backgroundColor: 'var(--terracotta)',
                border: '3px solid var(--foreground)',
                borderRadius: 50,
                boxShadow: '4px 4px 0 var(--foreground)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0 var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '4px 4px 0 var(--foreground)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '0px 0px 0 var(--foreground)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0 var(--foreground)';
              }}
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Cat 🐱'}
            </button>

            <p
              className="text-center mt-5"
              style={{ fontFamily: 'var(--font-patrick-hand), cursive', fontSize: '0.9rem', color: 'var(--stone-dark)' }}
            >
              By submitting, you confirm this is your own photo and agree to have it shared on Cats of Malta.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
