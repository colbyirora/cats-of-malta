'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import type { Cat } from '@/lib/types';

interface CatFormProps {
  cat?: Cat;
  onSave: (cat: Cat) => void;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export default function CatForm({ cat, onSave, onCancel }: CatFormProps) {
  const isEditing = !!cat;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState(cat?.name || '');
  const [locationName, setLocationName] = useState(cat?.location_name || '');
  const [locationLat, setLocationLat] = useState(cat?.location_lat?.toString() || '');
  const [locationLng, setLocationLng] = useState(cat?.location_lng?.toString() || '');
  const [breed, setBreed] = useState(cat?.breed || '');
  const [color, setColor] = useState(cat?.color || '');
  const [age, setAge] = useState(cat?.age || '');
  const [isStray, setIsStray] = useState(cat?.is_stray ?? true);
  const [backgroundStory, setBackgroundStory] = useState(cat?.background_story || '');
  const [approved, setApproved] = useState(cat?.approved ?? false);
  const [primaryPhoto, setPrimaryPhoto] = useState(cat?.primary_photo || '');
  const [photos, setPhotos] = useState<string[]>(cat?.photos || []);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!locationName.trim()) {
      newErrors.location_name = 'Location name is required';
    }
    if (!locationLat.trim() || isNaN(Number(locationLat))) {
      newErrors.location_lat = 'Valid latitude is required';
    }
    if (!locationLng.trim() || isNaN(Number(locationLng))) {
      newErrors.location_lng = 'Valid longitude is required';
    }
    if (!color.trim()) {
      newErrors.color = 'Color is required';
    }
    if (!primaryPhoto && photos.length === 0) {
      newErrors.photo = 'At least one photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrors((prev) => ({ ...prev, photo: '' }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      const url = data.url;

      if (!primaryPhoto) {
        setPrimaryPhoto(url);
      }
      setPhotos((prev) => [...prev, url]);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        photo: err instanceof Error ? err.message : 'Upload failed',
      }));
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((p) => p !== url));
    if (primaryPhoto === url) {
      const remaining = photos.filter((p) => p !== url);
      setPrimaryPhoto(remaining[0] || '');
    }
  }

  function setAsPrimary(url: string) {
    setPrimaryPhoto(url);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setSubmitting(true);

    const body = {
      name: name.trim() || null,
      primary_photo: primaryPhoto || photos[0] || '',
      photos,
      location_name: locationName.trim(),
      location_lat: parseFloat(locationLat),
      location_lng: parseFloat(locationLng),
      breed: breed.trim() || null,
      color: color.trim(),
      age: age.trim() || null,
      is_stray: isStray,
      background_story: backgroundStory.trim() || null,
      approved,
    };

    try {
      const url = isEditing
        ? `/api/admin/cats/${cat.id}`
        : '/api/admin/cats';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save cat');
      }

      const data = await res.json();
      onSave(data.cat);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  const labelStyle = {
    color: 'var(--foreground)',
    fontWeight: 600 as const,
    fontSize: '0.875rem',
  };

  const errorTextStyle = {
    color: 'var(--terracotta)',
    fontSize: '0.75rem',
    marginTop: '4px',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Form */}
      <div
        className="soft-card relative z-10 w-full max-w-2xl p-6 sm:p-8"
        style={{ background: 'var(--warm-white)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{
            color: 'var(--foreground)',
            fontFamily: 'var(--font-fredoka), sans-serif',
          }}
        >
          {isEditing ? 'Edit Cat' : 'Add New Cat'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <div>
            <label style={labelStyle} className="block mb-2">
              Photos
            </label>

            {/* Photo previews */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {photos.map((url) => (
                  <div
                    key={url}
                    className="relative group rounded-xl overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: url === primaryPhoto ? 'var(--terracotta)' : 'var(--stone)',
                      width: '96px',
                      height: '96px',
                    }}
                  >
                    <Image
                      src={url}
                      alt="Cat photo"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      {url !== primaryPhoto && (
                        <button
                          type="button"
                          onClick={() => setAsPrimary(url)}
                          className="text-white text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--malta-blue)' }}
                        >
                          Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(url)}
                        className="text-white text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--terracotta)' }}
                      >
                        Remove
                      </button>
                    </div>
                    {/* Primary badge */}
                    {url === primaryPhoto && (
                      <div
                        className="absolute top-1 left-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--terracotta)' }}
                      >
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
              style={{
                background: 'var(--stone)',
                color: 'var(--foreground)',
              }}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Photo
                </>
              )}
            </button>
            {errors.photo && <p style={errorTextStyle}>{errors.photo}</p>}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="cat-name" style={labelStyle} className="block mb-1.5">
              Name <span style={{ color: 'var(--stone-dark)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="soft-input w-full px-4 py-2.5 text-sm"
              placeholder="e.g. Whiskers, Luna..."
            />
          </div>

          {/* Location Group */}
          <fieldset
            className="rounded-2xl p-4"
            style={{ border: '1.5px solid var(--stone)' }}
          >
            <legend
              className="px-2 text-sm font-semibold"
              style={{ color: 'var(--foreground)' }}
            >
              Location
            </legend>

            <div className="space-y-3 mt-1">
              <div>
                <label htmlFor="location-name" style={labelStyle} className="block mb-1.5">
                  Location Name
                </label>
                <input
                  id="location-name"
                  type="text"
                  value={locationName}
                  onChange={(e) => {
                    setLocationName(e.target.value);
                    if (errors.location_name) setErrors((prev) => ({ ...prev, location_name: '' }));
                  }}
                  className="soft-input w-full px-4 py-2.5 text-sm"
                  placeholder="e.g. Valletta Old Town"
                />
                {errors.location_name && <p style={errorTextStyle}>{errors.location_name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lat" style={labelStyle} className="block mb-1.5">
                    Latitude
                  </label>
                  <input
                    id="lat"
                    type="number"
                    step="any"
                    value={locationLat}
                    onChange={(e) => {
                      setLocationLat(e.target.value);
                      if (errors.location_lat) setErrors((prev) => ({ ...prev, location_lat: '' }));
                    }}
                    className="soft-input w-full px-4 py-2.5 text-sm"
                    placeholder="35.8989"
                  />
                  {errors.location_lat && <p style={errorTextStyle}>{errors.location_lat}</p>}
                </div>
                <div>
                  <label htmlFor="lng" style={labelStyle} className="block mb-1.5">
                    Longitude
                  </label>
                  <input
                    id="lng"
                    type="number"
                    step="any"
                    value={locationLng}
                    onChange={(e) => {
                      setLocationLng(e.target.value);
                      if (errors.location_lng) setErrors((prev) => ({ ...prev, location_lng: '' }));
                    }}
                    className="soft-input w-full px-4 py-2.5 text-sm"
                    placeholder="14.5146"
                  />
                  {errors.location_lng && <p style={errorTextStyle}>{errors.location_lng}</p>}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Breed and Color row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="breed" style={labelStyle} className="block mb-1.5">
                Breed <span style={{ color: 'var(--stone-dark)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                id="breed"
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="soft-input w-full px-4 py-2.5 text-sm"
                placeholder="e.g. Tabby, Siamese..."
              />
            </div>
            <div>
              <label htmlFor="color" style={labelStyle} className="block mb-1.5">
                Color
              </label>
              <input
                id="color"
                type="text"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  if (errors.color) setErrors((prev) => ({ ...prev, color: '' }));
                }}
                className="soft-input w-full px-4 py-2.5 text-sm"
                placeholder="e.g. Orange tabby, Black..."
              />
              {errors.color && <p style={errorTextStyle}>{errors.color}</p>}
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" style={labelStyle} className="block mb-1.5">
              Age <span style={{ color: 'var(--stone-dark)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              id="age"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="soft-input w-full px-4 py-2.5 text-sm"
              placeholder="e.g. Kitten, Adult, Senior, ~3 years..."
            />
          </div>

          {/* Background Story */}
          <div>
            <label htmlFor="story" style={labelStyle} className="block mb-1.5">
              Background Story{' '}
              <span style={{ color: 'var(--stone-dark)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              id="story"
              value={backgroundStory}
              onChange={(e) => setBackgroundStory(e.target.value)}
              className="soft-input w-full px-4 py-2.5 text-sm resize-none"
              rows={4}
              placeholder="Tell us about this cat's story..."
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            {/* Is Stray toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isStray}
                  onChange={(e) => setIsStray(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 rounded-full transition-colors peer-checked:bg-[var(--malta-blue)]"
                  style={{ background: isStray ? undefined : 'var(--stone)' }}
                />
                <div
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
                />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Stray cat
              </span>
            </label>

            {/* Approved toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={approved}
                  onChange={(e) => setApproved(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 rounded-full transition-colors peer-checked:bg-[var(--golden-sun)]"
                  style={{ background: approved ? undefined : 'var(--stone)' }}
                />
                <div
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
                />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Approved
              </span>
            </label>
          </div>

          {/* Submit error */}
          {submitError && (
            <div
              className="text-sm py-2.5 px-4 rounded-xl"
              style={{
                color: 'var(--terracotta-dark)',
                background: 'rgba(196, 30, 58, 0.08)',
              }}
            >
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-full font-semibold text-sm transition-all hover:opacity-80 disabled:opacity-50"
              style={{
                background: 'var(--stone)',
                color: 'var(--foreground)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="soft-button flex-1 py-3 px-4 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Add Cat'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
