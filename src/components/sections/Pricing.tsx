'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useProjectModal, type ServiceKey } from '@/components/ui/ProjectModal';
import gsap from 'gsap';
import { ensureGsapPlugins } from '@/lib/gsap-setup';

/* ──────────────────────── Checkmark icon ──────────────────────── */

function CheckIcon({ featured }: { featured: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="7" cy="7" r="7" fill={featured ? 'rgba(255,107,44,0.18)' : 'rgba(255,255,255,0.06)'} />
      <path
        d="M4 7l2 2 4-4"
        stroke={featured ? '#ff6b2c' : '#8e8ea8'}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ──────────────────────── Tier config ─────────────────────────── */

const TIERS = [
  { key: 'starter' as const, featured: false, showFrom: true,  featureCount: 5, service: 'landing'  as ServiceKey },
  { key: 'growth'  as const, featured: true,  showFrom: true,  featureCount: 6, service: 'business' as ServiceKey },
  { key: 'scale'   as const, featured: false, showFrom: false, featureCount: 6, service: 'webapp'   as ServiceKey },
] as const;

/* ──────────────────────── Component ───────────────────────────── */

export function Pricing() {
  const t = useTranslations('pricing');
  const { open: openModal } = useProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      const headingTrigger = { trigger: headingRef.current, start: 'top 86%', once: true };

      gsap.fromTo('[data-gsap="price-badge"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo('[data-gsap="price-heading"]',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo('[data-gsap="price-sub"]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: headingTrigger }
      );

      /* Card stagger — featured card gets a different from/to for extra drama */
      gsap.fromTo('[data-pricing-card]',
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.75, ease: 'power3.out', stagger: 0.14,
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-28 lg:py-36 overflow-hidden bg-bg"
    >
      {/* Radial glow from bottom-center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(255,107,44,0.06) 0%, transparent 70%)',
        }}
      />
      {/* Top separator */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,44,0.2) 50%, transparent 100%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div ref={headingRef} className="max-w-2xl mx-auto text-center mb-16 lg:mb-20">
          <div data-gsap="price-badge" className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ignis flex-shrink-0" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
              {t('badge')}
            </span>
          </div>
          <h2
            data-gsap="price-heading"
            className="font-display text-[clamp(2.2rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text mb-5"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t('heading')}
          </h2>
          <p data-gsap="price-sub" className="text-lg text-text-secondary leading-relaxed">
            {t('subheading')}
          </p>
        </div>

        {/* Cards grid — centre card scales up on desktop */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-5 items-center"
        >
          {TIERS.map(({ key, featured, showFrom, featureCount, service }) => (
            <PricingCard
              key={key}
              tierKey={key}
              featured={featured}
              showFrom={showFrom}
              featureCount={featureCount}
              t={t}
              onCta={() => openModal(service)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ──────────────────────── PricingCard ─────────────────────────── */

type TKey = 'starter' | 'growth' | 'scale';
type TFunc = ReturnType<typeof useTranslations<'pricing'>>;

function PricingCard({
  tierKey,
  featured,
  showFrom,
  featureCount,
  t,
  onCta,
}: {
  tierKey: TKey;
  featured: boolean;
  showFrom: boolean;
  featureCount: number;
  t: TFunc;
  onCta: () => void;
}) {
  const featureKeys = Array.from({ length: featureCount }, (_, i) => `${tierKey}.feature${i + 1}` as Parameters<TFunc>[0]);

  return (
    <div
      data-pricing-card
      className={[
        'relative flex flex-col rounded-2xl border transition-all duration-350 cursor-default group',
        featured
          ? 'md:scale-[1.04] md:z-10 bg-surface-2 shadow-[0_0_80px_rgba(255,107,44,0.12)]'
          : 'bg-surface hover:scale-[1.02]',
      ].join(' ')}
      style={
        featured
          ? {
              border: '1px solid transparent',
              background: 'linear-gradient(#13131d, #13131d) padding-box, linear-gradient(135deg, #ff6b2c 0%, #cc4700 50%, #ff6b2c88 100%) border-box',
              boxShadow: '0 0 80px rgba(255,107,44,0.12), 0 0 0 1px transparent',
            }
          : { border: '1px solid #1e1e2e' }
      }
    >
      {/* Most popular badge */}
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #ff6b2c 0%, #ffb347 100%)',
              color: '#fff',
              boxShadow: '0 2px 16px rgba(255,107,44,0.45)',
            }}
          >
            <span className="w-1 h-1 rounded-full bg-white/70 flex-shrink-0" />
            {t('mostPopular')}
          </span>
        </div>
      )}

      {/* Card inner glow on hover (non-featured only) */}
      {!featured && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,107,44,0.2), 0 0 30px rgba(255,107,44,0.06)' }}
        />
      )}

      <div className={`flex flex-col flex-1 p-7 ${featured ? 'lg:p-9' : ''}`}>

        {/* Tier name */}
        <div className="mb-6">
          <span
            className={`text-xs font-bold tracking-[0.22em] uppercase ${featured ? 'text-ignis' : 'text-text-muted'}`}
          >
            {t(`${tierKey}.name` as Parameters<TFunc>[0])}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {showFrom && (
              <span className="text-sm text-text-muted font-medium">
                {t('from')}
              </span>
            )}
            <span
              className={`font-display font-bold leading-none ${featured ? 'text-5xl text-gradient-ignis' : 'text-4xl text-text'}`}
            >
              {t(`${tierKey}.price` as Parameters<TFunc>[0])}
            </span>
          </div>
        </div>

        {/* Description / tagline */}
        <p className="text-sm text-text-muted leading-relaxed mb-8">
          {t(`${tierKey}.description` as Parameters<TFunc>[0])}
        </p>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{
            background: featured
              ? 'linear-gradient(90deg, transparent, rgba(255,107,44,0.3), transparent)'
              : 'rgba(255,255,255,0.05)',
          }}
        />

        {/* Features */}
        <ul className="flex flex-col gap-3 mb-8 flex-1">
          {featureKeys.map((fKey) => (
            <li key={fKey} className="flex items-start gap-2.5">
              <CheckIcon featured={featured} />
              <span className="text-sm text-text-secondary leading-relaxed">
                {t(fKey)}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={onCta}
          className={[
            'relative w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 overflow-hidden cursor-pointer',
            featured
              ? 'text-white'
              : 'border border-border-bright text-text-secondary hover:border-ignis/50 hover:text-text',
          ].join(' ')}
          style={
            featured
              ? { background: 'linear-gradient(135deg, #ff6b2c 0%, #ffb347 100%)', boxShadow: '0 4px 20px rgba(255,107,44,0.3)' }
              : {}
          }
        >
          {featured && (
            <span
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #ff8a50 0%, #ffcb47 100%)' }}
            />
          )}
          <span className="relative z-10">
            {t(`${tierKey}.cta` as Parameters<TFunc>[0])}
          </span>
        </button>

      </div>
    </div>
  );
}
