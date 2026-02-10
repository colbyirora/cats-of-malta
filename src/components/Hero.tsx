'use client';

import { useState, useCallback } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
  dx: number;
  size: number;
  delay: number;
}

let heartCounter = 0;

export default function Hero() {
  const [isPetting, setIsPetting] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const petCat = useCallback(() => {
    if (isPetting) return;
    setIsPetting(true);

    // Spawn hearts from both cheeks
    const newHearts: Heart[] = [];
    const cheeks = [
      { x: 60, y: 105 },  // left cheek
      { x: 140, y: 105 }, // right cheek
    ];

    for (const cheek of cheeks) {
      for (let i = 0; i < 3; i++) {
        newHearts.push({
          id: heartCounter++,
          x: cheek.x + (Math.random() - 0.5) * 10,
          y: cheek.y,
          dx: (cheek.x < 100 ? -1 : 1) * (8 + Math.random() * 12),
          size: 0.4 + Math.random() * 0.3,
          delay: i * 0.15,
        });
      }
    }

    setHearts((prev) => [...prev, ...newHearts]);

    // Reset after animation
    setTimeout(() => {
      setIsPetting(false);
    }, 800);

    // Clean up hearts after they fade
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 1500);
  }, [isPetting]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--warm-white)]">
      {/* Background blobs */}
      <div
        className="absolute rounded-full opacity-60"
        style={{
          width: 400,
          height: 400,
          background: 'var(--stone)',
          top: -100,
          left: -100,
          filter: 'blur(60px)',
          animation: 'hero-float 10s infinite ease-in-out',
        }}
      />
      <div
        className="absolute rounded-full opacity-60"
        style={{
          width: 300,
          height: 300,
          background: 'rgba(196, 30, 58, 0.15)',
          bottom: 50,
          right: -50,
          filter: 'blur(60px)',
          animation: 'hero-float 12s infinite ease-in-out reverse',
        }}
      />

      <div className="relative z-10 w-full max-w-[1200px] min-h-[90vh] flex justify-center items-center flex-col px-6">
        {/* Annotation: So fluffy */}
        <div
          className="absolute z-20 hidden md:block"
          style={{
            fontFamily: 'var(--font-gochi-hand), cursive',
            fontSize: '1.5rem',
            color: 'var(--terracotta)',
            top: '25%',
            left: '20%',
            transform: 'rotate(-5deg)',
          }}
        >
          So fluffy~
        </div>

        {/* Title */}
        <h1
          className="relative z-10 text-center leading-tight pointer-events-none"
          style={{
            fontFamily: 'var(--font-fredoka), cursive',
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            color: 'var(--terracotta)',
            WebkitTextStroke: '12px white',
            paintOrder: 'stroke fill',
            filter: 'drop-shadow(4px 6px 0px rgba(0,0,0,0.1))',
            transform: 'rotate(-2deg)',
            marginBottom: -40,
          }}
        >
          <span className="inline-block" style={{ animation: 'wiggle 4s infinite ease-in-out' }}>Cats</span>{' '}
          <span className="inline-block" style={{ animation: 'wiggle 4s infinite ease-in-out 0.2s' }}>of</span>
          <br />
          <span className="inline-block" style={{ animation: 'wiggle 4s infinite ease-in-out 0.4s' }}>Malta</span>
        </h1>

        {/* Kawaii Cat SVG */}
        <div
          className="relative flex justify-center items-end cursor-pointer"
          style={{
            width: 400,
            height: 400,
            zIndex: 5,
            filter: 'drop-shadow(0px 20px 30px rgba(139, 129, 120, 0.2))',
          }}
          onClick={petCat}
        >
          <svg id="kawaii-cat" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
            {/* Tail */}
            <path id="cat-tail" d="M160,150 Q180,110 170,90 T150,80" fill="none" stroke="var(--stone)" strokeWidth="20" strokeLinecap="round" />

            <g id="cat-body">
              {/* Body */}
              <ellipse cx="100" cy="140" rx="70" ry="55" fill="var(--stone)" />
              {/* Belly */}
              <ellipse cx="100" cy="150" rx="35" ry="25" fill="var(--warm-white)" />
              {/* Paws */}
              <ellipse cx="70" cy="185" rx="12" ry="10" fill="var(--terracotta-light)" />
              <ellipse cx="130" cy="185" rx="12" ry="10" fill="var(--terracotta-light)" />

              <g id="cat-head">
                {/* Head */}
                <ellipse cx="100" cy="90" rx="60" ry="50" fill="var(--stone)" />

                {/* Left ear */}
                <path d="M55,60 L45,30 L75,50 Z" fill="var(--stone)" stroke="var(--stone)" strokeWidth="5" strokeLinejoin="round" />
                <path d="M50,55 L48,40 L65,50 Z" fill="var(--terracotta-light)" />

                {/* Right ear */}
                <path d="M145,60 L155,30 L125,50 Z" fill="var(--stone)" stroke="var(--stone)" strokeWidth="5" strokeLinejoin="round" />
                <path d="M150,55 L152,40 L135,50 Z" fill="var(--terracotta-light)" />

                {/* Eyes - swap between normal and happy */}
                {isPetting ? (
                  <>
                    {/* Happy squint eyes ^_^ */}
                    <path d="M67,88 Q75,82 83,88" fill="none" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M117,88 Q125,82 133,88" fill="none" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle id="left-eye" cx="75" cy="90" r="5" fill="var(--foreground)" />
                    <circle id="right-eye" cx="125" cy="90" r="5" fill="var(--foreground)" />
                  </>
                )}

                {/* Mouth & Nose */}
                {isPetting ? (
                  <>
                    {/* Happy open mouth */}
                    <ellipse cx="100" cy="98" rx="3" ry="2" fill="var(--terracotta-light)" />
                    <path d="M92,100 Q96,103 100,106 Q104,103 108,100" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" />
                    <ellipse cx="100" cy="104" rx="5" ry="3" fill="var(--terracotta-light)" opacity="0.6" />
                  </>
                ) : (
                  <>
                    <path d="M96,100 Q100,105 104,100" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" />
                    <ellipse cx="100" cy="98" rx="3" ry="2" fill="var(--terracotta-light)" />
                  </>
                )}

                {/* Blush - intensify when petting */}
                <ellipse cx="60" cy="105" rx="8" ry="5" fill="var(--terracotta-light)" opacity={isPetting ? 0.7 : 0.4}>
                  {isPetting && (
                    <animate attributeName="rx" values="8;10;8" dur="0.4s" repeatCount="2" />
                  )}
                </ellipse>
                <ellipse cx="140" cy="105" rx="8" ry="5" fill="var(--terracotta-light)" opacity={isPetting ? 0.7 : 0.4}>
                  {isPetting && (
                    <animate attributeName="rx" values="8;10;8" dur="0.4s" repeatCount="2" />
                  )}
                </ellipse>

                {/* Whiskers */}
                <path d="M50,95 L30,90" stroke="var(--stone-dark)" strokeWidth="2" strokeLinecap="round" />
                <path d="M50,105 L30,110" stroke="var(--stone-dark)" strokeWidth="2" strokeLinecap="round" />
                <path d="M150,95 L170,90" stroke="var(--stone-dark)" strokeWidth="2" strokeLinecap="round" />
                <path d="M150,105 L170,110" stroke="var(--stone-dark)" strokeWidth="2" strokeLinecap="round" />

                {/* Scarf */}
                <path d="M70,130 Q100,150 130,130" fill="none" stroke="var(--malta-blue)" strokeWidth="6" strokeLinecap="round" />
              </g>
            </g>

            {/* Floating hearts */}
            {hearts.map((heart) => (
              <g
                key={heart.id}
                style={{
                  animation: `heart-rise 1.2s ease-out ${heart.delay}s forwards`,
                  opacity: 0,
                }}
              >
                <text
                  x={heart.x + heart.dx}
                  y={heart.y}
                  fontSize={14 * heart.size}
                  textAnchor="middle"
                  fill="var(--terracotta-light)"
                >
                  &#x2764;
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Decorative shapes */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 40,
            height: 40,
            background: 'var(--stone)',
            borderRadius: '50%',
            border: '3px solid white',
            top: '40%',
            left: '15%',
            animation: 'hero-float-fast 4s infinite ease-in-out',
          }}
        />
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '25px solid var(--malta-blue)',
            top: '30%',
            right: '15%',
            transform: 'rotate(35deg)',
            animation: 'hero-float 5s infinite ease-in-out',
          }}
        />

        {/* Annotation: Mediterranean Vibes */}
        <div
          className="absolute z-20 hidden md:block"
          style={{
            fontFamily: 'var(--font-gochi-hand), cursive',
            fontSize: '1.5rem',
            color: 'var(--stone-dark)',
            top: '30%',
            right: '22%',
            transform: 'rotate(5deg)',
          }}
        >
          Mediterranean<br />Vibes!
        </div>

        {/* Annotation: Pet me */}
        <div
          className="absolute z-20 hidden md:block"
          style={{
            fontFamily: 'var(--font-gochi-hand), cursive',
            fontSize: '1.2rem',
            color: 'var(--stone-dark)',
            bottom: '15%',
            left: '65%',
          }}
        >
          &larr; Pet me?
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 z-20">
          <a
            href="#gallery"
            className="px-8 py-4 rounded-full text-lg text-white border-4 border-white cursor-pointer transition-all duration-200 text-center"
            style={{
              fontFamily: 'var(--font-fredoka), cursive',
              backgroundColor: 'var(--terracotta)',
              boxShadow: '0px 8px 0px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0px 12px 0px rgba(196, 30, 58, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0px 8px 0px rgba(0,0,0,0.05)';
            }}
          >
            Meet the Cats
          </a>
          <a
            href="#map"
            className="px-8 py-4 rounded-full text-lg text-white border-4 border-white cursor-pointer transition-all duration-200 text-center"
            style={{
              fontFamily: 'var(--font-fredoka), cursive',
              backgroundColor: 'var(--malta-blue)',
              boxShadow: '0px 8px 0px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0px 12px 0px rgba(74, 144, 217, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0px 8px 0px rgba(0,0,0,0.05)';
            }}
          >
            Explore the Map
          </a>
        </div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="var(--warm-white)"
          />
        </svg>
      </div>
    </section>
  );
}
