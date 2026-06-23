'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureGsapPlugins, prefersReducedMotion } from '@/lib/gsap-setup';

/* ──────────────────────────── Icons ──────────────────────────────── */

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

const ICONS = [IconSearch, IconPencil, IconCode, IconRocket] as const;
const STEP_NUMS = ['01', '02', '03', '04'] as const;

/* ──────────────── Shared inactive/active style helpers ─────────────── */

const INACTIVE = {
  ring: { borderColor: '#1e1e2e', background: '#0d0d16', boxShadow: 'none' },
  icon: { color: '#4a4a62' },
  num:  { color: '#4a4a62' },
};

const ACTIVE = {
  ring: {
    borderColor: '#ff6b2c',
    background: 'rgba(255,107,44,0.1)',
    boxShadow: '0 0 32px rgba(255,107,44,0.35), inset 0 0 16px rgba(255,107,44,0.08)',
  },
  icon: { color: '#ff8a50' },
  num:  { color: '#ff6b2c' },
};

/* ─────────────────────────── Component ───────────────────────────── */

export function Process() {
  const t = useTranslations('process');

  const sectionRef    = useRef<HTMLElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  /* mobile */
  const mobileRef     = useRef<HTMLDivElement>(null);
  const vLineRef      = useRef<HTMLDivElement>(null);
  const mobileEls     = useRef<(HTMLDivElement | null)[]>([]);
  /* desktop */
  const desktopRef    = useRef<HTMLDivElement>(null);
  const segLineRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const desktopEls    = useRef<(HTMLDivElement | null)[]>([]);

  const STEPS = [
    { id: 'discovery', title: t('step1Title'), desc: t('step1Desc') },
    { id: 'design',    title: t('step2Title'), desc: t('step2Desc') },
    { id: 'dev',       title: t('step3Title'), desc: t('step3Desc') },
    { id: 'launch',    title: t('step4Title'), desc: t('step4Desc') },
  ];

  useEffect(() => {
    ensureGsapPlugins();

    /* Reduced motion: skip scrubbed reveals, render the timeline as complete. */
    if (prefersReducedMotion()) {
      const ctx = gsap.context(() => {
        gsap.set(vLineRef.current, { scaleY: 1, transformOrigin: 'top center' });
        segLineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { scaleX: 1, transformOrigin: 'left center' });
        });
        desktopEls.current.forEach((step) => {
          if (!step) return;
          gsap.set(step.querySelector<HTMLElement>('[data-step-ring]'), ACTIVE.ring);
          gsap.set(step.querySelector<HTMLElement>('[data-step-icon]'), ACTIVE.icon);
          gsap.set(step.querySelector<HTMLElement>('[data-step-num]'), ACTIVE.num);
          gsap.set(step.querySelector<HTMLElement>('[data-step-content]'), { opacity: 1, y: 0 });
        });
        mobileEls.current.forEach((step) => {
          if (!step) return;
          gsap.set(step.querySelector<HTMLElement>('[data-step-ring]'), { borderColor: '#ff6b2c', boxShadow: '0 0 24px rgba(255,107,44,0.3)' });
          gsap.set(step.querySelector<HTMLElement>('[data-step-icon]'), ACTIVE.icon);
          gsap.set(step.querySelector<HTMLElement>('[data-step-num]'), ACTIVE.num);
          gsap.set(step.querySelector<HTMLElement>('[data-step-title]'), { color: '#f0f0ee' });
        });
      }, sectionRef);
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {

      /* ── Heading entrance ── */
      const headingTrigger = { trigger: headingRef.current, start: 'top 86%', once: true };
      gsap.fromTo('[data-gsap="proc-badge"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: headingTrigger });
      gsap.fromTo('[data-gsap="proc-heading"]', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: headingTrigger });
      gsap.fromTo('[data-gsap="proc-sub"]',     { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: headingTrigger });

      /* ── Initialise line fills ── */
      gsap.set(vLineRef.current,  { scaleY: 0, transformOrigin: 'top center' });
      segLineRefs.current.forEach(el => {
        if (el) gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
      });

      /* ── Initialise desktop step elements to inactive ── */
      desktopEls.current.forEach(step => {
        if (!step) return;
        gsap.set(step.querySelector<HTMLElement>('[data-step-ring]'),    INACTIVE.ring);
        gsap.set(step.querySelector<HTMLElement>('[data-step-icon]'),    INACTIVE.icon);
        gsap.set(step.querySelector<HTMLElement>('[data-step-num]'),     INACTIVE.num);
        gsap.set(step.querySelector<HTMLElement>('[data-step-content]'), { opacity: 0.4, y: 8 });
      });

      /* ── Initialise mobile step elements to inactive ── */
      mobileEls.current.forEach(step => {
        if (!step) return;
        gsap.set(step.querySelector<HTMLElement>('[data-step-ring]'),  { borderColor: '#1e1e2e', boxShadow: 'none' });
        gsap.set(step.querySelector<HTMLElement>('[data-step-icon]'),  INACTIVE.icon);
        gsap.set(step.querySelector<HTMLElement>('[data-step-num]'),   INACTIVE.num);
        gsap.set(step.querySelector<HTMLElement>('[data-step-title]'), { color: '#8e8ea8' });
      });

      const mm = gsap.matchMedia();

      /* ════════════════════════════════════
         MOBILE / TABLET  (< 1024 px)
         ════════════════════════════════════ */
      mm.add('(max-width: 1023px)', () => {

        /* Staggered entrance */
        gsap.fromTo(
          mobileEls.current.filter(Boolean),
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.13,
            scrollTrigger: { trigger: mobileRef.current, start: 'top 82%', once: true },
          }
        );

        /* Scrub: vertical line fill + step activation */
        let lastActive = -1;

        ScrollTrigger.create({
          trigger: mobileRef.current,
          start: 'top 55%',
          end:   'bottom 60%',
          scrub: 1,
          onUpdate(self) {
            const p = self.progress;
            gsap.set(vLineRef.current, { scaleY: p });

            const bp = [0, 0.25, 0.55, 0.82];
            let active = 0;
            for (let i = bp.length - 1; i >= 0; i--) { if (p >= bp[i]) { active = i; break; } }
            if (active === lastActive) return;
            lastActive = active;

            mobileEls.current.forEach((step, i) => {
              if (!step) return;
              const on = i <= active;
              gsap.to(step.querySelector<HTMLElement>('[data-step-ring]'),  {
                borderColor: on ? '#ff6b2c' : '#1e1e2e',
                boxShadow:   on ? '0 0 24px rgba(255,107,44,0.3)' : 'none',
                duration: 0.4, ease: 'power2.out',
              });
              gsap.to(step.querySelector<HTMLElement>('[data-step-icon]'),  { color: on ? '#ff8a50' : '#4a4a62', duration: 0.4 });
              gsap.to(step.querySelector<HTMLElement>('[data-step-num]'),   { color: on ? '#ff6b2c' : '#4a4a62', duration: 0.4 });
              gsap.to(step.querySelector<HTMLElement>('[data-step-title]'), { color: on ? '#f0f0ee' : '#8e8ea8', duration: 0.4 });
            });
          },
        });
      });

      /* ════════════════════════════════════
         DESKTOP  (≥ 1024 px)
         ════════════════════════════════════ */
      mm.add('(min-width: 1024px)', () => {

        /* Scrub: 3 segment lines fill + step activation */
        let lastActive = -1;

        ScrollTrigger.create({
          trigger: desktopRef.current,
          start: 'top 55%',
          end:   'bottom 60%',
          scrub: 1,
          onUpdate(self) {
            const p = self.progress;

            /* Segment fills — each spans 1/3 of total progress */
            const SEG = 1 / 3;
            for (let i = 0; i < 3; i++) {
              const seg = Math.min(1, Math.max(0, (p - i * SEG) / SEG));
              if (segLineRefs.current[i]) gsap.set(segLineRefs.current[i], { scaleX: seg });
            }

            /* Step activation: 0% | 33% | 66% | 90% */
            const bp = [0, 0.33, 0.66, 0.9];
            let active = 0;
            for (let i = bp.length - 1; i >= 0; i--) { if (p >= bp[i]) { active = i; break; } }
            if (active === lastActive) return;
            lastActive = active;

            desktopEls.current.forEach((step, i) => {
              if (!step) return;
              const on = i <= active;
              gsap.to(step.querySelector<HTMLElement>('[data-step-ring]'),    { ...(on ? ACTIVE.ring : INACTIVE.ring), duration: 0.5, ease: 'power2.out' });
              gsap.to(step.querySelector<HTMLElement>('[data-step-icon]'),    { ...(on ? ACTIVE.icon : INACTIVE.icon), duration: 0.5 });
              gsap.to(step.querySelector<HTMLElement>('[data-step-num]'),     { ...(on ? ACTIVE.num  : INACTIVE.num),  duration: 0.5 });
              gsap.to(step.querySelector<HTMLElement>('[data-step-content]'), { opacity: on ? 1 : 0.4, y: on ? 0 : 8, duration: 0.5, ease: 'power2.out' });
            });
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ────────────────────────── Render ──────────────────────────── */
  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--color-bg) 0%, #0a0a10 30%, #0d0d16 70%, var(--color-bg) 100%)' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,107,44,0.6) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,107,44,0.6) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 35% at 20% 60%, rgba(255,107,44,0.05) 0%, transparent 70%)' }}
      />
      {/* Edge separators */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
           style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,44,0.2) 50%, transparent 100%)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
           style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,44,0.15) 50%, transparent 100%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div ref={headingRef} className="max-w-2xl mb-16 lg:mb-24">
          <div data-gsap="proc-badge" className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ignis flex-shrink-0" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
              {t('badge')}
            </span>
          </div>
          <h2
            data-gsap="proc-heading"
            className="font-display text-[clamp(2.2rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text mb-5"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t('heading')}
          </h2>
          <p data-gsap="proc-sub" className="text-lg text-text-secondary leading-relaxed">
            {t('subheading')}
          </p>
        </div>

        {/* ══════════════════════════════════════════════
            MOBILE / TABLET — Centered alternating timeline
            ══════════════════════════════════════════════ */}
        <div ref={mobileRef} className="lg:hidden">
          <div className="relative max-w-sm sm:max-w-md mx-auto">

            {/* Vertical track line — centred, starts at first icon centre */}
            <div
              className="absolute w-px bg-border pointer-events-none"
              style={{ top: '1.5rem', bottom: '1.5rem', left: '50%', transform: 'translateX(-0.5px)' }}
            >
              <div
                ref={vLineRef}
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, var(--color-ignis) 0%, var(--color-ignis-glow) 100%)',
                  boxShadow: '0 0 8px rgba(255,107,44,0.5)',
                }}
              />
            </div>

            {/* Steps */}
            {STEPS.map((step, i) => {
              const Icon   = ICONS[i];
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={step.id}
                  ref={(el) => { mobileEls.current[i] = el; }}
                  className="relative grid grid-cols-2 pb-16 last:pb-0"
                >
                  {/* Left column — content for even steps */}
                  <div className={`pr-8 flex flex-col gap-1.5 ${isLeft ? 'items-end text-right' : ''}`}>
                    {isLeft && (
                      <>
                        <span data-step-num className="font-mono text-xs font-bold tracking-[0.2em] uppercase">
                          {STEP_NUMS[i]}
                        </span>
                        <h3 data-step-title className="font-display text-sm font-bold leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed [hyphens:auto]">
                          {step.desc}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Icon ring — centred on the line */}
                  <div
                    data-step-ring
                    className="absolute top-0 left-1/2 -translate-x-1/2 z-10
                               w-12 h-12 rounded-full flex items-center justify-center
                               border-2 flex-shrink-0"
                    style={{ background: '#0d0d16' }}
                  >
                    <div data-step-icon>
                      <Icon />
                    </div>
                  </div>

                  {/* Right column — content for odd steps */}
                  <div className={`pl-8 flex flex-col gap-1.5 ${!isLeft ? 'items-start text-left' : ''}`}>
                    {!isLeft && (
                      <>
                        <span data-step-num className="font-mono text-xs font-bold tracking-[0.2em] uppercase">
                          {STEP_NUMS[i]}
                        </span>
                        <h3 data-step-title className="font-display text-sm font-bold leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed [hyphens:auto]">
                          {step.desc}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            DESKTOP — Horizontal timeline with segment fills
            ══════════════════════════════════════════════ */}
        <div ref={desktopRef} className="hidden lg:block relative">

          {/* Horizontal track — spans icon-centre to icon-centre */}
          <div
            className="absolute h-px bg-border pointer-events-none overflow-hidden"
            style={{ top: '2.25rem', left: '12.5%', right: '12.5%' }}
          >
            {/* Three independent segment fills */}
            {([0, 1, 2] as const).map((i) => (
              <div
                key={i}
                ref={(el) => { segLineRefs.current[i] = el; }}
                className="absolute top-0 h-full"
                style={{
                  left:       `${(i / 3) * 100}%`,
                  width:      `${100 / 3}%`,
                  background: 'linear-gradient(90deg, var(--color-ignis), var(--color-ignis-bright))',
                  boxShadow:  '0 0 8px rgba(255,107,44,0.7)',
                }}
              />
            ))}
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-8">
            {STEPS.map((step, i) => {
              const Icon = ICONS[i];
              return (
                <div
                  key={step.id}
                  ref={(el) => { desktopEls.current[i] = el; }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon ring */}
                  <div
                    data-step-ring
                    className="w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center
                               border-2 mb-7 flex-shrink-0 z-10 relative"
                    style={{ background: '#0d0d16' }}
                  >
                    <div data-step-icon>
                      <Icon />
                    </div>
                  </div>

                  {/* Text content — fades up on activation */}
                  <div data-step-content className="flex flex-col items-center gap-2">
                    <span data-step-num className="font-mono text-xs font-bold tracking-[0.2em] uppercase">
                      {STEP_NUMS[i]}
                    </span>
                    <h3 data-step-title className="font-display text-lg font-bold leading-snug text-text">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed max-w-[20ch]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
