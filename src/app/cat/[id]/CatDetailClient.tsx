'use client';

import Image from 'next/image';

interface PolaroidFrameProps {
  photoUrl: string;
  name: string | null;
  stamp: string;
}

export function PolaroidFrame({ photoUrl, name, stamp }: PolaroidFrameProps) {
  return (
    <div
      className="group bg-white p-4 sm:p-5 pb-16 sm:pb-[60px] relative w-full max-w-[350px] cursor-pointer polaroid-kawaii"
      style={{
        boxShadow: '0 8px 0 rgba(232, 146, 124, 0.2), 0 12px 24px rgba(139, 129, 120, 0.15)',
        borderRadius: '4px',
        transform: 'rotate(-2deg)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(-2deg)'; }}
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

      {/* Malta stamp */}
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
          src={photoUrl}
          alt={name || 'Cat photo'}
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
          {name || '???'}
        </p>
      </div>
    </div>
  );
}

export function ActionButtons() {
  return (
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
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 0 #D0806C, 0 12px 14px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 0 #D0806C, 0 8px 10px rgba(0,0,0,0.1)';
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
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.background = '#FFF9F0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.background = 'white';
        }}
      >
        <span>&#x1F4E4;</span> Share
      </button>
    </div>
  );
}
