import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { sampleCats } from '@/lib/sample-data';
import type { Cat, NameSuggestion } from '@/lib/types';
import VotingSection from './VotingSection';

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

  // Generate a consistent "first spotted" date based on cat id
  const getFirstSpottedDate = (catId: string) => {
    const hash = catId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[hash % 12];
    const year = 2022 + (hash % 3);
    return `${month} ${year}`;
  };

  // Generate consistent random stamp based on cat id
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
            {/* Polaroid Frame */}
            <div
              className="group bg-white p-4 sm:p-5 pb-16 sm:pb-[60px] relative w-full max-w-[350px] cursor-pointer"
              style={{
                boxShadow: '0 8px 0 rgba(232, 146, 124, 0.2), 0 12px 24px rgba(139, 129, 120, 0.15)',
                borderRadius: '4px',
                transform: 'rotate(-2deg)',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.02)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(-2deg)'; }}
            >
              {/* Teal tape */}
              <div
                className="absolute -top-[15px] left-1/2 -translate-x-1/2 w-[100px] sm:w-[120px] h-[30px] sm:h-[35px] z-10"
                style={{
                  backgroundColor: '#7AAFB5',
                  opacity: 0.7,
                  transform: 'translateX(-50%) rotate(2deg)',
                  borderLeft: '2px dashed rgba(255,255,255,0.3)',
                  borderRight: '2px dashed rgba(255,255,255,0.3)',
                  maskImage: 'linear-gradient(to right, transparent 2%, black 5%, black 95%, transparent 98%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 2%, black 5%, black 95%, transparent 98%)',
                }}
              />

              {/* Malta stamp - top right (KEPT!) */}
              <div
                className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 z-20 w-14 h-[70px] sm:w-[90px] sm:h-[112px]"
                style={{ transform: 'rotate(8deg)' }}
              >
                <Image
                  src={stamp}
                  alt="Malta stamp"
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="(max-width: 640px) 56px, 90px"
                />
              </div>

              {/* Cat photo */}
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100" style={{ borderRadius: '2px', border: '2px solid #f0f0f0' }}>
                <Image
                  src={cat.primary_photo}
                  alt={cat.name || 'Cat photo'}
                  fill
                  className="object-cover"
                  style={{ filter: 'contrast(1.05) saturate(1.1)' }}
                  sizes="350px"
                  priority
                />
              </div>

              {/* Polaroid caption */}
              <div
                className="absolute bottom-0 left-0 right-0 text-center py-3 sm:py-4"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                <p className="text-xl sm:text-2xl text-[#2D2D2D]" style={{ transform: 'rotate(1deg)' }}>
                  {cat.name || '???'}
                </p>
              </div>
            </div>

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
                {/* Coral highlight underline */}
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
            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 border-none text-white text-lg font-semibold cursor-pointer"
                style={{
                  fontFamily: 'var(--font-fredoka), sans-serif',
                  background: '#E8927C',
                  borderRadius: '50px',
                  boxShadow: '0 4px 0 #D0806C, 0 8px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 0 #D0806C, 0 12px 14px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 0 #D0806C, 0 8px 10px rgba(0,0,0,0.1)';
                }}
              >
                <span>&#x2764;&#xFE0F;</span> Favorite
              </button>
              <button
                className="flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 text-lg font-semibold cursor-pointer bg-white"
                style={{
                  fontFamily: 'var(--font-fredoka), sans-serif',
                  color: '#E8927C',
                  border: '2px solid #E8927C',
                  borderRadius: '50px',
                  boxShadow: '0 4px 0 #F5E6D3',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.background = '#FFF9F0';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'white';
                }}
              >
                <span>&#x1F4E4;</span> Share
              </button>
            </div>
          </div>
        </div>

        {/* Voting section — spans full width */}
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
