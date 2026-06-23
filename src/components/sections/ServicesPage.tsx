'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ensureGsapPlugins, prefersReducedMotion } from '@/lib/gsap-setup';
import { useProjectModal, type ServiceKey } from '@/components/ui/ProjectModal';

const PACKAGES: ReadonlyArray<{
  id: string;
  ns: 'landing' | 'business' | 'webapp';
  serviceKey: ServiceKey;
  gradient: string;
  accent: string;
  glow: string;
}> = [
  {
    id: 'landing-page',
    ns: 'landing',
    serviceKey: 'landing',
    gradient: 'linear-gradient(90deg, var(--color-ignis-red), var(--color-ignis))',
    accent: 'var(--color-ignis)',
    glow: 'rgba(255,61,0,0.22)',
  },
  {
    id: 'business-website',
    ns: 'business',
    serviceKey: 'business',
    gradient: 'linear-gradient(90deg, var(--color-ignis), var(--color-ignis-glow))',
    accent: '#ff8c42',
    glow: 'rgba(255,107,44,0.22)',
  },
  {
    id: 'web-app',
    ns: 'webapp',
    serviceKey: 'webapp',
    gradient: 'linear-gradient(90deg, var(--color-ignis-glow), #ffd700)',
    accent: 'var(--color-ignis-glow)',
    glow: 'rgba(255,179,71,0.20)',
  },
];

function CheckIcon({ accent }: { accent: string }) {
  return (
    <span
      className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center"
      style={{ background: accent, opacity: 0.9 }}
    >
      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
        <path
          d="M2 5l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ServicesPage() {
  const t = useTranslations('servicesPage');
  const { open: openModal } = useProjectModal();

  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const addonsRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-gsap="hero-badge"]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: heroRef.current, start: 'top 90%', once: true },
        }
      );
      gsap.fromTo(
        '[data-gsap="hero-heading"]',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: heroRef.current, start: 'top 88%', once: true },
        }
      );
      gsap.fromTo(
        '[data-gsap="hero-sub"]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: heroRef.current, start: 'top 85%', once: true },
        }
      );

      gsap.utils.toArray<HTMLElement>('.pkg-section').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll<HTMLElement>('[data-pkg-anim]'),
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          }
        );
      });

      gsap.fromTo(
        '.addon-card',
        { opacity: 0, y: 28, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: addonsRef.current, start: 'top 82%', once: true },
        }
      );

      gsap.fromTo(
        '[data-gsap="final-cta"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: finalRef.current, start: 'top 85%', once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addonItems = t.raw('addons.items') as Array<{ name: string; detail: string }>;

  return (
    <section ref={sectionRef} className="relative pt-32 lg:pt-40 pb-20 overflow-hidden">
      {/* ── Top decorative gradient ── */}
      <div
        className="absolute inset-x-0 top-0 h-[600px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,107,44,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,107,44,0.3) 50%, transparent 100%)',
        }}
      />

      {/* ── Hero ── */}
      <div
        ref={heroRef}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mb-20 lg:mb-28"
      >
        <div className="max-w-3xl">
          <div data-gsap="hero-badge" className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ignis flex-shrink-0" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
              {t('hero.badge')}
            </span>
          </div>
          <h1
            data-gsap="hero-heading"
            className="font-display text-[clamp(2.4rem,5.5vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-text mb-6"
          >
            {t('hero.heading')}
          </h1>
          <p
            data-gsap="hero-sub"
            className="text-lg lg:text-xl text-text-secondary leading-relaxed"
          >
            {t('hero.subheading')}
          </p>
        </div>
      </div>

      {/* ── Package sections ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-12 lg:gap-20">
        {PACKAGES.map((pkg) => {
          const features = t.raw(`${pkg.ns}.features`) as string[];
          return (
            <article
              key={pkg.id}
              id={pkg.id}
              className="pkg-section relative scroll-mt-28 rounded-2xl overflow-hidden"
              style={{
                background:
                  'linear-gradient(145deg, #0f0f1a 0%, #12121e 60%, #0d0d16 100%)',
                border: '1px solid var(--color-border)',
                boxShadow:
                  '0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: pkg.gradient, opacity: 0.85 }}
              />
              <div
                className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none"
                style={{ background: pkg.glow }}
              />

              <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 p-8 sm:p-10 lg:p-14">
                {/* Left: copy */}
                <div className="flex flex-col">
                  <div
                    data-pkg-anim
                    className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                    style={{
                      border: `1px solid ${pkg.accent}40`,
                      background: `${pkg.accent}12`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: pkg.accent }}
                    />
                    <span
                      className="text-[11px] font-semibold tracking-[0.2em] uppercase"
                      style={{ color: pkg.accent }}
                    >
                      {t(`${pkg.ns}.badge`)}
                    </span>
                  </div>

                  <h2
                    data-pkg-anim
                    className="font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-text mb-5"
                  >
                    {t(`${pkg.ns}.headline`)}
                  </h2>

                  <p
                    data-pkg-anim
                    className="text-base text-text-secondary leading-relaxed mb-7"
                  >
                    {t(`${pkg.ns}.description`)}
                  </p>

                  <div data-pkg-anim className="flex flex-wrap items-end gap-4 mb-7">
                    <div
                      className="font-display text-3xl sm:text-4xl font-bold"
                      style={{
                        backgroundImage: pkg.gradient,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {t(`${pkg.ns}.price`)}
                    </div>
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-text-secondary"
                      style={{
                        border: '1px solid var(--color-border)',
                        background: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      {t(`${pkg.ns}.timeline`)}
                    </span>
                  </div>

                  <button
                    data-pkg-anim
                    onClick={() => openModal(pkg.serviceKey)}
                    className="mt-auto inline-flex w-fit items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                    style={{ background: pkg.gradient }}
                  >
                    {t(`${pkg.ns}.cta`)}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>

                {/* Right: features */}
                <div data-pkg-anim>
                  <div
                    className="text-[11px] font-semibold tracking-[0.25em] uppercase text-text-muted mb-4"
                  >
                    {t(`${pkg.ns}.included`)}
                  </div>
                  <ul className="flex flex-col gap-3">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm sm:text-[15px] text-text-secondary leading-snug"
                      >
                        <CheckIcon accent={pkg.accent} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Add-ons ── */}
      <div
        ref={addonsRef}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mt-24 lg:mt-32"
      >
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-ignis flex-shrink-0" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
              {t('addons.badge')}
            </span>
          </div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-text">
            {t('addons.heading')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {addonItems.map((item) => (
            <div
              key={item.name}
              className="addon-card relative rounded-2xl p-6 lg:p-7 transition-colors duration-300"
              style={{
                background: 'linear-gradient(145deg, #0f0f1a 0%, #12121e 100%)',
                border: '1px solid var(--color-border)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
            >
              <h3 className="font-display text-base font-semibold text-text mb-2">
                {item.name}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div
        ref={finalRef}
        className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 mt-28 lg:mt-36 text-center"
      >
        <div data-gsap="final-cta">
          <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-[1.1] tracking-tight text-text mb-4">
            {t('finalCta.heading')}
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto">
            {t('finalCta.sub')}
          </p>
          <button
            onClick={() => openModal('landing')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--color-ignis), var(--color-ignis-glow))' }}
          >
            {t('finalCta.cta')}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
