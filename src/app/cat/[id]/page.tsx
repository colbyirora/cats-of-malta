import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { sampleCats } from '@/lib/sample-data';
import type { Cat, NameSuggestion } from '@/lib/types';
import VotingSection from './VotingSection';
import { PolaroidFrame, ActionButtons } from './CatDetailClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCat(id: string): Promise<Cat | null> {
  try {
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return sampleCats.find((c) => c.id === id) || null;
    }

    return data;
  } catch {
    return sampleCats.find((c) => c.id === id) || null;
  }
}

async function getSuggestions(catId: string): Promise<NameSuggestion[]> {
  try {
    const { data, error } = await supabase
      .from('name_suggestions')
      .select('*')
      .eq('cat_id', catId)
      .order('vote_count', { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export default async function CatDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cat = await getCat(id);

  if (!cat) {
    notFound();
  }

  const suggestions = await getSuggestions(cat.id);

  const getFirstSpottedDate = (catId: string) => {
    const hash = catId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[hash % 12];
    const year = 2022 + (hash % 3);
    return `${month} ${year}`;
  };

  const stamps = ['/stamps/s1.png', '/stamps/s2.png', '/stamps/s3.png', '/stamps/s4.png', '/stamps/s5.png', '/stamps/s6.png'];
  const getStamp = (catId: string) => {
    const hash = catId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return stamps[hash % stamps.length];
  };
  const stamp = getStamp(cat.id);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#FFF9F0',
        backgroundImage:
          'radial-gradient(circle at 10% 20%, #E8927C15 2px, transparent 2.5px), radial-gradient(circle at 90% 80%, #7AAFB515 2px, transparent 2.5px), radial-gradient(circle at 50% 50%, #E8927C10 4px, transparent 4.5px)',
        backgroundSize: '100px 100px, 120px 120px, 200px 200px',
      }}
    >
      <Header />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-32 relative">
        {/* Floating sparkle decorations */}
        <div className="absolute top-4 left-[10%] text-[#E8927C] text-2xl opacity-60 z-0" style={{ animation: 'cat-detail-float 3s ease-in-out infinite' }}>
          &#x2728;
        </div>
        <div className="absolute bottom-[10%] -right-2 sm:right-0 text-[#7AAFB5] text-2xl opacity-60 z-0" style={{ animation: 'cat-detail-float 3s ease-in-out infinite 1s' }}>
          &#x2726;
        </div>
        <div className="absolute top-[40%] -left-2 sm:left-0 text-[#E8927C] text-lg opacity-60 z-0" style={{ animation: 'cat-detail-float 3s ease-in-out infinite 2s' }}>
          &#x2605;
        </div>

        {/* Back button */}
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 group transition-colors"
          style={{ color: '#E8927C', fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          <span className="group-hover:-translate-x-1 transition-transform text-lg">&larr;</span>
          <span className="group-hover:underline">Back to all cats</span>
        </Link>

        {/* Main 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 relative z-10">
          {/* Photo Section */}
          <div className="flex flex-col items-center">
            <PolaroidFrame photoUrl={cat.primary_photo} name={cat.name} stamp={stamp} />

            {/* Spotted date pill */}
            <div
              className="mt-4 inline-block px-4 py-1.5 text-sm"
              style={{
                color: '#8B8178',
                backgroundColor: '#F5E6D3',
                borderRadius: '20px',
                border: '2px dotted #8B8178',
              }}
            >
              First spotted: {getFirstSpottedDate(cat.id)}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {/* Header */}
            <div>
              <h1
                className="relative inline-block text-3xl sm:text-[42px] font-bold leading-tight mb-2"
                style={{ color: '#2D2D2D', fontFamily: 'var(--font-fraunces), serif' }}
              >
                {cat.name || '??? (Help name me!)'}
                <span
                  className="absolute bottom-1 -left-1 -right-1 h-3 -z-10"
                  style={{ background: '#E8927C', opacity: 0.3, borderRadius: '4px', transform: 'rotate(-1deg)' }}
                />
              </h1>
              <div className="flex items-center gap-2 text-lg" style={{ color: '#7AAFB5', fontFamily: 'var(--font-fredoka), sans-serif' }}>
                <span>&#x1F4CD;</span> {cat.location_name}
              </div>
            </div>

            {/* Chip grid */}
            <div className="flex flex-wrap gap-3">
              <div
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-[15px] font-medium transition-all hover:-translate-y-0.5"
                style={{ border: '2px solid #F5E6D3', borderRadius: '16px', color: '#8B8178' }}
              >
                &#x1F43E; {cat.is_stray ? 'Street Cat' : 'Has Home'}
              </div>
              <div
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-[15px] font-medium transition-all hover:-translate-y-0.5"
                style={{ border: '2px solid #F5E6D3', borderRadius: '16px', color: '#8B8178' }}
              >
                &#x1F3A8; {cat.color}
              </div>
              {cat.breed && (
                <div
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-[15px] font-medium transition-all hover:-translate-y-0.5"
                  style={{ border: '2px solid #F5E6D3', borderRadius: '16px', color: '#8B8178' }}
                >
                  &#x1F431; {cat.breed}
                </div>
              )}
              {cat.age && (
                <div
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-[15px] font-medium transition-all hover:-translate-y-0.5"
                  style={{ border: '2px solid #F5E6D3', borderRadius: '16px', color: '#8B8178' }}
                >
                  &#x1F4C5; {cat.age}
                </div>
              )}
            </div>

            {/* Story card */}
            {cat.background_story && (
              <div
                className="bg-white p-5 sm:p-6"
                style={{ borderRadius: '24px', border: '3px dotted #F5E6D3' }}
              >
                <h3
                  className="flex items-center gap-2 text-lg mb-3"
                  style={{ color: '#E8927C', fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  &#x1F4D6; Their Story
                </h3>
                <p className="leading-relaxed text-base" style={{ color: '#2D2D2D' }}>
                  {cat.background_story}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <ActionButtons />
          </div>
        </div>

        {/* Voting section */}
        {(cat.voting_status === 'suggesting' || cat.voting_status === 'voting') && (
          <VotingSection cat={cat} suggestions={suggestions} />
        )}

        {/* Named cat - show winning name stats */}
        {cat.voting_status === 'complete' && cat.name && (
          <div
            className="mt-8 sm:mt-10 p-6 sm:p-8 text-center bg-white"
            style={{
              borderRadius: '24px',
              border: '3px dotted #f5b642',
              boxShadow: '0 8px 0 rgba(245, 182, 66, 0.15), 0 12px 24px rgba(139, 129, 120, 0.1)',
            }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: '#f5b642', fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              &#x1F3C6; Community Named: {cat.name}
            </h2>
            <p style={{ color: '#8B8178' }}>
              This cat was named by the Cats of Malta community!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
