'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useProjectModal } from '@/components/ui/ProjectModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const t = useTranslations('hero');
  const { open: openModal } = useProjectModal();

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        .fromTo('[data-gsap="stats"]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
          '-=0.3');

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

            <div className="flex flex-wrap items-center gap-4 mb-20">
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

            <div className="flex flex-wrap gap-10">
              {[
                { val: t('stat1Value'), label: t('stat1Label') },
                { val: t('stat2Value'), label: t('stat2Label') },
                { val: t('stat3Value'), label: t('stat3Label') },
              ].map(({ val, label }) => (
                <div key={label} data-gsap="stats" className="flex flex-col gap-1">
                  <span className="font-display text-3xl font-bold text-gradient-ignis">
                    {val}
                  </span>
                  <span className="text-xs text-text-muted tracking-wide uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs text-text-muted tracking-[0.2em] uppercase">
          {t('scrollText')}
        </span>
        <div className="w-px h-12 relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-ignis to-transparent"
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
