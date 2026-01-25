import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sampleCats, sampleNameSuggestions } from '@/lib/sample-data';
import VotingSection from './VotingSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CatDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cat = sampleCats.find((c) => c.id === id);

  if (!cat) {
    notFound();
  }

  const suggestions = sampleNameSuggestions.filter((s) => s.cat_id === cat.id);

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
    <div className="min-h-screen bg-gradient-to-b from-[var(--warm-white)] to-[var(--cream)]">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-8 pb-48">
        {/* Back button */}
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-2 text-[var(--terracotta)] hover:text-[var(--terracotta-dark)] transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to all cats
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Polaroid Photo */}
          <div className="flex justify-center lg:justify-end pt-4 sm:pt-8">
            <div className="group -rotate-2 hover:rotate-0 transition-transform duration-300">
              <div
                className="relative p-2 sm:p-4 pb-16 sm:pb-20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.15)] group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.12),0_20px_40px_rgba(0,0,0,0.18)] transition-shadow duration-300 group-hover:scale-[1.02] border-[2px] sm:border-[3px] border-[#f5f0e8]"
                style={{ background: 'linear-gradient(145deg, #fffdf9 0%, #f9f5ee 50%, #f5f0e6 100%)' }}
              >
                {/* Tape effect */}
                <div className="absolute -top-2.5 sm:-top-3.5 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-5 sm:h-7 rounded-sm z-10 rotate-1 bg-gradient-to-b from-amber-50/95 to-amber-100/90 shadow-sm" />

                {/* Location label - top left */}
                <div
                  className="absolute -top-1 -left-1 z-20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-sm shadow-sm"
                  style={{ transform: 'rotate(-3deg)', background: 'linear-gradient(135deg, #fffdf9 0%, #f5f0e6 100%)' }}
                >
                  <p className="text-[8px] sm:text-[10px] font-bold text-[var(--terracotta)] tracking-wider" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                    {cat.location_name.toUpperCase()}
                  </p>
                </div>

                {/* Malta stamp - top right */}
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

                {/* Photo */}
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 overflow-hidden bg-gray-100">
                  <Image
                    src={cat.primary_photo}
                    alt={cat.name || 'Cat photo'}
                    fill
                    className="object-cover sepia-[0.08]"
                    sizes="320px"
                    priority
                  />
                </div>

                {/* Polaroid caption area */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-2 sm:px-4 py-2 sm:py-3 text-center"
                  style={{ background: 'linear-gradient(180deg, #f9f5ee 0%, #f5f0e6 100%)' }}
                >
                  <p
                    className="text-2xl sm:text-3xl text-gray-700 mb-0.5"
                    style={{ fontFamily: 'var(--font-caveat), cursive' }}
                  >
                    {cat.name || '???'}
                  </p>
                  <p
                    className="text-xs sm:text-sm text-gray-400"
                    style={{ fontFamily: 'var(--font-caveat), cursive' }}
                  >
                    First spotted: {getFirstSpottedDate(cat.id)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cat info */}
          <div className="lg:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2">
                  {cat.name || '??? (Help name me!)'}
                </h1>
                <p className="text-sm sm:text-base text-[var(--stone-dark)] flex items-center gap-2">
                  <span>📍</span> {cat.location_name}
                </p>
              </div>
              {cat.is_stray ? (
                <span className="bg-[var(--stone)]/50 text-[var(--foreground)] px-4 py-1.5 rounded-full text-sm font-medium">
                  Street Cat
                </span>
              ) : (
                <span className="bg-[var(--sea-blue)]/15 text-[var(--sea-blue)] px-4 py-1.5 rounded-full text-sm font-medium">
                  Has Home
                </span>
              )}
            </div>

            {/* Quick facts */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-sm">
                🎨 {cat.color}
              </span>
              {cat.breed && (
                <span className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-sm">
                  🐱 {cat.breed}
                </span>
              )}
              {cat.age && (
                <span className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-sm">
                  📅 {cat.age}
                </span>
              )}
            </div>

            {/* Story */}
            {cat.background_story && (
              <div className="mb-8 soft-card p-6 bg-white/80">
                <h2 className="text-lg font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
                  <span>📖</span> Their Story
                </h2>
                <p className="text-[var(--stone-dark)] leading-relaxed">{cat.background_story}</p>
              </div>
            )}

            {/* Share buttons */}
            <div className="flex justify-center gap-3 sm:gap-4">
              <button className="group px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 bg-[var(--cream)] text-[var(--malta-blue)] border-2 border-[var(--malta-blue)] hover:bg-[var(--malta-blue)] hover:text-white">
                <span className="flex items-center gap-2">Share <span className="group-hover:rotate-12 transition-transform">📤</span></span>
              </button>
              <button className="group px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-dark)] shadow-md hover:shadow-lg">
                <span className="flex items-center gap-2"><span className="group-hover:scale-125 transition-transform">❤️</span> Favorite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Voting section */}
        {(cat.voting_status === 'suggesting' || cat.voting_status === 'voting') && (
          <VotingSection cat={cat} suggestions={suggestions} />
        )}

        {/* Named cat - show winning name stats */}
        {cat.voting_status === 'complete' && cat.name && (
          <div className="mt-8 bg-[var(--golden-sun)]/10 soft-card p-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--golden-sun)] mb-2">
              🏆 Community Named: {cat.name}
            </h2>
            <p className="text-[var(--stone-dark)]">
              This cat was named by the Cats of Malta community!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
