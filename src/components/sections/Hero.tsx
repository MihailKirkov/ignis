'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useProjectModal } from '@/components/ui/ProjectModal';
import gsap from 'gsap';
import { ensureGsapPlugins } from '@/lib/gsap-setup';

const TECH_STACK = [
  {
    name: 'Next.js',
    svg: (
      <svg viewBox="0 0 180 180" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="90" cy="90" r="87" stroke="currentColor" strokeWidth="5" />
        <path
          d="M60 125V57l58 68V57"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: 'React',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="50" cy="50" r="8" fill="currentColor" />
        <ellipse cx="50" cy="50" rx="46" ry="17" stroke="currentColor" strokeWidth="3.5" />
        <ellipse cx="50" cy="50" rx="46" ry="17" stroke="currentColor" strokeWidth="3.5" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="46" ry="17" stroke="currentColor" strokeWidth="3.5" transform="rotate(-60 50 50)" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
        <rect x="3" y="3" width="94" height="94" rx="12" fill="currentColor" fillOpacity="0.15" />
        <text
          x="13"
          y="72"
          fontSize="50"
          fontWeight="800"
          fill="currentColor"
          fontFamily="system-ui,-apple-system,sans-serif"
        >
          TS
        </text>
      </svg>
    ),
  },
  {
    name: 'Tailwind CSS',
    svg: (
      <svg viewBox="0 0 54 33" fill="none" className="w-full h-full" aria-hidden="true">
        <path
          d="M27 0C19.8 0 15.3 3.6 13.5 10.8c2.7-3.6 5.85-4.95 9.45-4.05 2.03.508 3.48 1.98 5.085 3.615C30.63 13.02 33.64 16.05 40.5 16.05c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.03-.508-3.48-1.98-5.085-3.615C37.37 3.03 34.36 0 27 0zM13.5 16.05C6.3 16.05 1.8 19.65 0 26.85c2.7-3.6 5.85-4.95 9.45-4.05 2.03.508 3.48 1.98 5.085 3.615 2.595 2.648 5.605 5.678 12.465 5.678 7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.03-.508-3.48-1.98-5.085-3.615C23.87 19.08 20.86 16.05 13.5 16.05z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'Supabase',
    svg: (
      <svg viewBox="0 0 109 113" fill="none" className="w-full h-full" aria-hidden="true">
        <path
          d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97L53.974 40.063h45.22c8.19 0 12.759 9.46 7.665 15.875L63.708 110.284z"
          fill="currentColor"
        />
        <path
          d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.547 67.251H9.832C1.641 72.292-2.927 62.832 2.166 56.417L45.317 2.071z"
          fill="currentColor"
          fillOpacity="0.5"
        />
      </svg>
    ),
  },
  {
    name: 'Three.js',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" aria-hidden="true">
        <rect x="20" y="35" width="42" height="40" stroke="currentColor" strokeWidth="4" />
        <path d="M20 35L36 18L78 18L62 35" stroke="currentColor" strokeWidth="4" fill="none" />
        <path d="M62 35L78 18L78 58L62 75" stroke="currentColor" strokeWidth="4" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Node.js',
    svg: (
      <svg viewBox="0 0 100 116" fill="none" className="w-full h-full" aria-hidden="true">
        <path d="M50 5L95 29V87L50 111L5 87V29L50 5Z" stroke="currentColor" strokeWidth="4" />
        <text
          x="50"
          y="66"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="currentColor"
          fontFamily="system-ui,-apple-system,sans-serif"
        >
          NODE
        </text>
      </svg>
    ),
  },
];

export function Hero() {
  const t = useTranslations('hero');
  const { open: openModal } = useProjectModal();

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const content = contentRef.current;
    if (!content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('[data-gsap="badge"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .fromTo('[data-gsap="headline"]',
          { opacity: 0, y: 40, skewY: 3 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12 },
          '-=0.3')
        .fromTo('[data-gsap="sub"]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.4')
        .fromTo('[data-gsap="cta"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
          '-=0.4')
        .fromTo('[data-gsap="tech-label"]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3')
        .fromTo('[data-gsap="tech-logo"]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 },
          '-=0.4');

      gsap.to('[data-gsap="hero-content"]', {
        y: -80,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end:   'bottom top',
          scrub: true,
        },
      });
    }, content);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,107,44,0.03) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,107,44,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          zIndex: 1,
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-24">
        <div ref={contentRef}>
          <div data-gsap="hero-content" className="max-w-4xl">

            <div data-gsap="badge" className="inline-flex items-center gap-2.5 mb-8">
              <span className="flex items-center justify-center w-1.5 h-1.5 rounded-full bg-ignis" />
              <span className="text-xs font-semibold tracking-[0.12em] sm:tracking-[0.2em] lg:tracking-[0.25em] uppercase text-text-secondary">
                {t('badge')}
              </span>
              <span className="flex-1 w-16 h-px bg-gradient-to-r from-ignis/50 to-transparent" />
            </div>

            <h1 className="font-display font-bold leading-[1.0] tracking-tight mb-7 overflow-hidden">
              <span
                data-gsap="headline"
                className="block text-[clamp(3.5rem,8vw,7rem)] text-text"
              >
                {t('headline1')}
              </span>
              <span
                data-gsap="headline"
                className="block text-[clamp(3.5rem,8vw,7rem)] text-gradient-fire"
              >
                {t('headline2')}
              </span>
            </h1>

            <p
              data-gsap="sub"
              className="text-lg lg:text-xl text-text-secondary max-w-xl leading-relaxed mb-10"
            >
              {t('subheadline')}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-16">
              <button
                data-gsap="cta"
                onClick={() => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 text-sm font-semibold text-white rounded-xl overflow-hidden cursor-pointer"
              >
                <span
                  className="absolute inset-0 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #ff6b2c, #ffb347)' }}
                />
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #ff8c42, #ffd700)' }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {t('ctaPrimary')}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>

              <button
                data-gsap="cta"
                onClick={() => openModal()}
                className="group px-8 py-4 text-sm font-semibold text-text border border-border hover:border-ignis/50 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-ignis/0 group-hover:bg-ignis/5 transition-colors duration-300" />
                <span className="relative z-10">{t('ctaSecondary')}</span>
              </button>
            </div>

            {/* Tech stack strip */}
            <div>
              <p
                data-gsap="tech-label"
                className="text-[10px] font-semibold tracking-[0.22em] uppercase text-text-muted mb-5"
              >
                {t('techStackLabel')}
              </p>
              <div className="flex flex-wrap items-center gap-7 lg:gap-9">
                {TECH_STACK.map(({ name, svg }) => (
                  <div
                    key={name}
                    data-gsap="tech-logo"
                    title={name}
                    className="w-8 h-8 text-white/25 hover:text-white/75 transition-colors duration-300 cursor-default"
                  >
                    {svg}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs text-text-muted tracking-[0.2em] uppercase">
          {t('scrollText')}
        </span>
        <div className="w-0.5 h-12 relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-full bg-linear-to-b from-ignis to-transparent"
            style={{ animation: 'scrollLine 1.8s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0%   { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(100%);  opacity: 0; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
