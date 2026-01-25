'use client';

import Image from 'next/image';
import Link from 'next/link';

const actions = [
  {
    title: 'Browse & Share Photos',
    description: 'Discover Malta\'s street cats or submit your own sightings',
    icon: null,
    image: '/cat-photo.png',
    href: '/submit',
    color: 'var(--golden-sun)',
  },
  {
    title: 'Suggest Cat Names',
    description: 'Help name the unnamed cats waiting for their identity',
    icon: null,
    image: '/cat-suggest.png',
    href: '#gallery',
    color: '#e67e22',
  },
  {
    title: 'Vote for Best Names',
    description: 'Choose the winning names for our furry friends',
    icon: null,
    image: '/cat-vote.png',
    href: '/vote',
    color: 'var(--terracotta)',
  },
];

export default function Meowncil() {
  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 bg-[var(--cream)]">
      {/* Wave at top */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[calc(100%-1px)]">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V80Z"
            fill="var(--cream)"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="relative text-center mb-8 sm:mb-12">
          <div className="relative inline-block">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--foreground)] mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              The <span className="text-[var(--terracotta)]">Meowncil</span>
            </h2>
            {/* "Here's how it works" annotation */}
            <span
              className="hidden md:block absolute -right-40 top-1/2 text-[var(--stone-dark)] text-lg font-normal whitespace-nowrap"
              style={{ transform: 'rotate(8deg) translateY(-50%)', fontFamily: 'var(--font-caveat), cursive' }}
            >
              Here&apos;s how it works ↓
            </span>
          </div>
          <p className="text-base sm:text-lg text-[var(--stone-dark)] px-2">
            Join our community and help document, name, and celebrate Malta&apos;s beloved street cats
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="group soft-card p-5 sm:p-8 text-center h-full cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                <div className="mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {action.image ? (
                    <Image
                      src={action.image}
                      alt={action.title}
                      width={80}
                      height={80}
                      className="object-contain w-16 h-16 sm:w-20 sm:h-20"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl">{action.icon}</span>
                  )}
                </div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 transition-colors duration-300"
                  style={{ color: action.color, fontFamily: 'var(--font-fraunces), serif' }}
                >
                  {action.title}
                </h3>
                <p className="text-[var(--stone-dark)] text-xs sm:text-sm leading-relaxed">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
