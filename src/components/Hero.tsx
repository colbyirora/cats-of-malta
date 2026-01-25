'use client';

import Image from 'next/image';

// Featured cat photos for the floating polaroids - positioned closer to center
const floatingCats = [
  { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300', name: 'Marmalade', rotation: -6, top: '15%', left: '12%', delay: '0s', stamp: '/stamps/s1.png', location: 'Valletta' },
  { src: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300', name: 'Shadow', rotation: 4, top: '12%', right: '12%', delay: '1s', stamp: '/stamps/s2.png', location: 'Mdina' },
  { src: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=300', name: 'Luna', rotation: -3, bottom: '20%', left: '10%', delay: '2s', stamp: '/stamps/s3.png', location: 'Sliema' },
  { src: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300', name: 'Cappuccino', rotation: 5, bottom: '18%', right: '10%', delay: '0.5s', stamp: '/stamps/s4.png', location: 'Rabat' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen pb-32 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--warm-white)] via-[var(--cream)] to-[var(--terracotta-light)]/30 tile-pattern">
      {/* Soft floating shapes in background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-[var(--terracotta-light)]/20 rounded-full blur-3xl float-animation" />
        <div className="absolute top-40 right-[15%] w-48 h-48 bg-[var(--malta-blue-light)]/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-[20%] w-56 h-56 bg-[var(--golden-sun)]/15 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Polaroid Collage */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {floatingCats.map((cat, index) => (
          <div
            key={index}
            className="absolute float-animation"
            style={{
              top: cat.top,
              left: cat.left,
              right: cat.right,
              bottom: cat.bottom,
              animationDelay: cat.delay,
              zIndex: index,
            }}
          >
            <div
              className="relative p-2 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:z-20 pointer-events-auto cursor-pointer group border-[2px] border-[#f5f0e8]"
              style={{ transform: `rotate(${cat.rotation}deg)`, background: 'linear-gradient(145deg, #fffdf9 0%, #f9f5ee 50%, #f5f0e6 100%)' }}
            >
              {/* Tape effect */}
              <div
                className="absolute -top-2 left-1/2 w-10 h-4 rounded-sm z-10 bg-gradient-to-b from-amber-50/90 to-amber-100/80 shadow-sm"
                style={{ transform: `translateX(-50%) rotate(${-cat.rotation / 2}deg)` }}
              />

              {/* Location label - top left */}
              <div
                className="absolute -top-1 -left-1 z-20 px-2 py-0.5 rounded-sm shadow-sm"
                style={{ transform: 'rotate(-3deg)', background: 'linear-gradient(135deg, #fffdf9 0%, #f5f0e6 100%)' }}
              >
                <p className="text-[8px] font-bold text-[var(--terracotta)] tracking-wider" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                  {cat.location.toUpperCase()}
                </p>
              </div>

              {/* Malta stamp - top right */}
              <div
                className={`absolute -top-5 -right-5 z-20 ${cat.name === 'Luna' ? 'w-20 h-26' : 'w-16 h-20'}`}
                style={{ transform: 'rotate(10deg)', width: cat.name === 'Luna' ? '80px' : '64px', height: cat.name === 'Luna' ? '104px' : '80px' }}
              >
                <Image
                  src={cat.stamp}
                  alt="Malta stamp"
                  fill
                  className="object-contain drop-shadow-md"
                  sizes={cat.name === 'Luna' ? '80px' : '64px'}
                />
              </div>

              {/* Photo */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 overflow-hidden bg-gray-100">
                <Image
                  src={cat.src}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 sepia-[0.1]"
                  sizes="150px"
                />
              </div>

              {/* Name */}
              <div className="pt-2 pb-1 text-center">
                <p
                  className="text-lg text-gray-600"
                  style={{ fontFamily: 'var(--font-caveat), cursive' }}
                >
                  {cat.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle paw prints scattered */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <span className="absolute top-[15%] left-[25%] text-6xl rotate-12">🐾</span>
        <span className="absolute top-[35%] right-[25%] text-4xl -rotate-12">🐾</span>
        <span className="absolute bottom-[35%] left-[30%] text-5xl rotate-6">🐾</span>
        <span className="absolute bottom-[25%] right-[30%] text-6xl -rotate-6">🐾</span>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Main content */}
        <div className="mb-8">
          <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-72 md:h-72 mx-auto -mb-6 sm:-mb-8">
            <Image
              src="/logo.png"
              alt="Cats of Malta"
              width={224}
              height={224}
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 8px 20px rgba(180, 140, 100, 0.3))' }}
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-4 leading-tight" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
            Cats of <span className="text-[var(--terracotta)]">Malta</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[var(--stone-dark)] mb-8 font-light">
            Celebrating the picturesque street cats of Malta
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16">
          <a
            href="#gallery"
            className="soft-button px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
          >
            Meet the Cats ↓
          </a>
          <a
            href="#map"
            className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full bg-white text-[var(--golden-sun)] border-2 border-[var(--golden-sun)]/20 hover:border-[var(--golden-sun)] transition-all duration-300 hover:shadow-lg"
          >
            Explore the Map
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 text-center">
          <div className="group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--terracotta)] group-hover:scale-110 transition-transform duration-300">100+</div>
            <div className="text-xs sm:text-sm text-[var(--stone-dark)] mt-1">Cats Documented</div>
          </div>
          <div className="group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e67e22] group-hover:scale-110 transition-transform duration-300">50+</div>
            <div className="text-xs sm:text-sm text-[var(--stone-dark)] mt-1">Named by Community</div>
          </div>
          <div className="group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--golden-sun)] group-hover:scale-110 transition-transform duration-300">∞</div>
            <div className="text-xs sm:text-sm text-[var(--stone-dark)] mt-1">Cuteness</div>
          </div>
        </div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="var(--warm-white)"
          />
        </svg>
      </div>
    </section>
  );
}
