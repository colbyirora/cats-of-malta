'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Cat } from '@/lib/types';

interface CatCardProps {
  cat: Cat;
}

const stamps = [
  '/stamps/s1.png',
  '/stamps/s2.png',
  '/stamps/s3.png',
  '/stamps/s4.png',
  '/stamps/s5.png',
  '/stamps/s6.png',
];

export default function CatCard({ cat }: CatCardProps) {
  // Generate consistent random rotation based on cat id
  const getRotation = (id: string) => {
    const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const rotations = [-3, -2, -1, 1, 2, 3];
    return rotations[hash % rotations.length];
  };

  // Generate consistent random stamp based on cat id
  const getStamp = (id: string) => {
    const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return stamps[hash % stamps.length];
  };

  const rotation = getRotation(cat.id);
  const stamp = getStamp(cat.id);

  const getVotingBadge = () => {
    switch (cat.voting_status) {
      case 'suggesting':
        return (
          <span className="absolute top-3 right-3 z-20 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-md">
            💡 Suggest Names
          </span>
        );
      case 'voting':
        return (
          <span className="absolute top-3 right-3 z-20 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-md">
            🗳️ Vote Now
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={`/cat/${cat.id}`}>
      <div
        className="group cursor-pointer h-full transition-transform duration-300 hover:scale-105 hover:rotate-0 hover:z-10"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Polaroid frame */}
        <div className="relative p-2 sm:p-3 pb-20 sm:pb-24 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.12)] group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.15),0_16px_40px_rgba(0,0,0,0.2)] transition-shadow duration-300 border-[2px] sm:border-[3px] border-[#f5f0e8]" style={{ background: 'linear-gradient(145deg, #fffdf9 0%, #f9f5ee 50%, #f5f0e6 100%)' }}>
          {/* Tape effect */}
          <div
            className="absolute -top-2 sm:-top-2.5 left-1/2 -translate-x-1/2 w-10 sm:w-14 h-4 sm:h-5 rounded-sm z-10 bg-gradient-to-b from-amber-50/95 to-amber-100/90 shadow-sm"
            style={{ transform: `translateX(-50%) rotate(${rotation > 0 ? -2 : 2}deg)` }}
          />

          {/* Location label - top left */}
          <div
            className="absolute -top-1 -left-1 z-20 px-1.5 sm:px-2 py-0.5 rounded-sm shadow-sm"
            style={{ transform: 'rotate(-3deg)', background: 'linear-gradient(135deg, #fffdf9 0%, #f5f0e6 100%)' }}
          >
            <p className="text-[7px] sm:text-[8px] font-bold text-[var(--terracotta)] tracking-wider" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              {cat.location_name.toUpperCase()}
            </p>
          </div>

          {/* Malta stamp - top right */}
          <div
            className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 z-20 w-12 h-15 sm:w-[72px] sm:h-[90px]"
            style={{ transform: 'rotate(8deg)' }}
          >
            <Image
              src={stamp}
              alt="Malta stamp"
              fill
              className="object-contain drop-shadow-md"
              sizes="(max-width: 640px) 48px, 72px"
            />
          </div>

          {/* Photo container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={cat.primary_photo}
              alt={cat.name || 'Unnamed cat'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 sepia-[0.08]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {getVotingBadge()}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Profile →
              </span>
            </div>
          </div>

          {/* Polaroid caption - handwritten style */}
          <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-3 pt-1.5 sm:pt-2 pb-2 sm:pb-3 text-center" style={{ background: 'linear-gradient(180deg, #f9f5ee 0%, #f5f0e6 100%)' }}>
            <p
              className="text-lg sm:text-2xl text-gray-700 truncate group-hover:text-[var(--terracotta)] transition-colors mb-0.5 sm:mb-1"
              style={{ fontFamily: 'var(--font-caveat), cursive' }}
            >
              {cat.name || '??? (name me!)'}
            </p>

            {/* Info row */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5 flex-wrap">
              <span>📍 {cat.location_name}</span>
              <span className="text-gray-300">•</span>
              <span>🎨 {cat.color}</span>
            </div>

            {/* Tags row */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
              {cat.breed && (
                <span className="text-[9px] sm:text-[10px] bg-gray-100 text-gray-500 px-1.5 sm:px-2 py-0.5 rounded-full">
                  {cat.breed}
                </span>
              )}
              {cat.age && (
                <span className="text-[9px] sm:text-[10px] bg-gray-100 text-gray-500 px-1.5 sm:px-2 py-0.5 rounded-full">
                  {cat.age}
                </span>
              )}
              {cat.is_stray ? (
                <span className="text-[9px] sm:text-[10px] bg-amber-50 text-amber-600 px-1.5 sm:px-2 py-0.5 rounded-full">
                  Street Cat
                </span>
              ) : (
                <span className="text-[9px] sm:text-[10px] bg-blue-50 text-blue-500 px-1.5 sm:px-2 py-0.5 rounded-full">
                  Has Home
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
