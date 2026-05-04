'use client';

import { useEffect, useRef } from 'react';
import { useProjectModal, type ServiceKey } from '@/components/ui/ProjectModal';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ensureGsapPlugins } from '@/lib/gsap-setup';

/* ─────────────────────────────── Icons ─────────────────────────────── */

function IconLanding() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="4" y="8" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="8" width="40" height="8" rx="3" fill="currentColor" opacity="0.15" />
      <line x1="4" y1="16" x2="44" y2="16" stroke="currentColor" strokeWidth="2" />
      <rect x="9" y="21" width="14" height="10" rx="1.5" fill="currentColor" opacity="0.2" />
      <rect x="27" y="21" width="12" height="3" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="27" y="27" width="8" height="2" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="10" y="40" width="28" height="2.5" rx="1.25" fill="currentColor" opacity="0.4" />
      <rect x="17" y="36" width="14" height="4" rx="1" fill="currentColor" opacity="0.15" />
      <circle cx="38" cy="12" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="33" cy="12" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="28" cy="12" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function IconBusiness() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="24" cy="24" rx="8" ry="18" stroke="currentColor" strokeWidth="2" />
      <line x1="6" y1="17" x2="42" y2="17" stroke="currentColor" strokeWidth="2" />
      <line x1="6" y1="31" x2="42" y2="31" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="6" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function IconWebApp() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="4" y="8" width="40" height="32" rx="3" stroke="currentColor" strokeWidth="2" />
      <line x1="4" y1="18" x2="44" y2="18" stroke="currentColor" strokeWidth="2" />
      <circle cx="10" cy="13" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="17" cy="13" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="24" cy="13" r="2" fill="currentColor" opacity="0.2" />
      <path
        d="M14 28l-4 4 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 26l4 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M34 28l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ────────────────────────────── Card ───────────────────────────────── */

interface CardProps {
  icon: React.ReactNode;
  accentIndex: number;
  title: string;
  description: string;
  features: string[];
  cta: string;
  onCta: () => void;
}

const ACCENT_GRADIENTS = [
  'from-[#ff3d00] to-[#ff6b2c]',
  'from-[#ff6b2c] to-[#ffb347]',
  'from-[#ffb347] to-[#ffd700]',
];

const GLOW_COLORS = [
  'rgba(255,61,0,0.25)',
  'rgba(255,107,44,0.25)',
  'rgba(255,179,71,0.2)',
];

function ServiceCard({ icon, accentIndex, title, description, features, cta, onCta }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    let mounted = true;

    (async () => {
      const VanillaTilt = (await import('vanilla-tilt')).default;
      if (!mounted) return;
      VanillaTilt.init(el, {
        max: 8,
        speed: 600,
        glare: true,
        'max-glare': 0.08,
        scale: 1.02,
        perspective: 1000,
        reset: true,
      });
    })();

    return () => {
      mounted = false;
      (el as HTMLElement & { vanillaTilt?: { destroy: () => void } }).vanillaTilt?.destroy();
    };
  }, []);

  const glowColor = GLOW_COLORS[accentIndex];
  const gradient = ACCENT_GRADIENTS[accentIndex];

  return (
    <div
      ref={cardRef}
      className="service-card group relative flex flex-col rounded-2xl p-8 cursor-default overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #0f0f1a 0%, #12121e 60%, #0d0d16 100%)',
        border: '1px solid #1e1e2e',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Hover border glow — driven by CSS group-hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `0 0 0 1px rgba(255,107,44,0.35), 0 8px 50px ${glowColor}, 0 0 80px ${glowColor.replace('0.25', '0.08')}`,
        }}
      />

      {/* Top accent line */}
      <div
        className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Icon */}
      <div className="relative mb-7" style={{ transform: 'translateZ(20px)' }}>
        <div
          className={`relative w-14 h-14 rounded-xl p-3 bg-gradient-to-br ${gradient} bg-opacity-10`}
          style={{ background: 'rgba(255,107,44,0.08)', border: '1px solid rgba(255,107,44,0.15)' }}
        >
          <div
            className={`w-full h-full text-transparent bg-gradient-to-br ${gradient}`}
            style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
          >
            {/* Render icon with ember color */}
            <div
              className="w-full h-full"
              style={{ color: accentIndex === 0 ? '#ff6b2c' : accentIndex === 1 ? '#ff8c42' : '#ffb347' }}
            >
              {icon}
            </div>
          </div>
        </div>
        {/* Icon glow blob */}
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />
      </div>

      {/* Title */}
      <h3
        className="font-display text-lg sm:text-xl font-bold text-text mb-3 tracking-tight break-words"
        style={{ transform: 'translateZ(15px)' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-sm text-text-secondary leading-relaxed mb-6"
        style={{ transform: 'translateZ(12px)' }}
      >
        {description}
      </p>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 mb-8 flex-1" style={{ transform: 'translateZ(10px)' }}>
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary leading-snug">
            <span
              className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-br ${gradient}`}
              style={{ opacity: 0.85 }}
            >
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCta}
        className="group/btn mt-auto flex items-center gap-2 text-sm font-semibold cursor-pointer"
        style={{
          transform: 'translateZ(18px)',
          color: accentIndex === 0 ? '#ff6b2c' : accentIndex === 1 ? '#ff8c42' : '#ffb347',
        }}
      >
        <span className="transition-all duration-300 group-hover/btn:underline underline-offset-4 decoration-from-font">
          {cta}
        </span>
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>

      {/* Vanilla Tilt glare element (appended by the lib) sits inside here automatically */}
    </div>
  );
}

/* ──────────────────────────── Section ──────────────────────────────── */

export default function Services() {
  const t = useTranslations('services');
  const { open: openModal } = useProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      /* Heading reveal */
      gsap.fromTo(
        '[data-gsap="services-badge"]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '[data-gsap="services-heading"]',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '[data-gsap="services-sub"]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );

      /* Cards stagger */
      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cards = [
    {
      icon: <IconLanding />,
      accentIndex: 0,
      title: t('landing.title'),
      description: t('landing.description'),
      features: [
        t('landing.feature1'),
        t('landing.feature2'),
        t('landing.feature3'),
        t('landing.feature4'),
      ],
      cta: t('landing.cta'),
    },
    {
      icon: <IconBusiness />,
      accentIndex: 1,
      title: t('business.title'),
      description: t('business.description'),
      features: [
        t('business.feature1'),
        t('business.feature2'),
        t('business.feature3'),
        t('business.feature4'),
      ],
      cta: t('business.cta'),
    },
    {
      icon: <IconWebApp />,
      accentIndex: 2,
      title: t('webapp.title'),
      description: t('webapp.description'),
      features: [
        t('webapp.feature1'),
        t('webapp.feature2'),
        t('webapp.feature3'),
        t('webapp.feature4'),
      ],
      cta: t('webapp.cta'),
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,107,44,0.05) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,44,0.3) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div ref={headingRef} className="max-w-2xl mb-16 lg:mb-20">
          <div data-gsap="services-badge" className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ignis flex-shrink-0" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
              {t('badge')}
            </span>
          </div>

          <h2
            data-gsap="services-heading"
            className="font-display text-[clamp(2.2rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text mb-5"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t('heading')}
          </h2>

          <p data-gsap="services-sub" className="text-lg text-text-secondary leading-relaxed">
            {t('subheading')}
          </p>
        </div>

        {/* Cards grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(['landing', 'business', 'webapp'] as ServiceKey[]).map((svc, i) => (
            <ServiceCard key={cards[i].title} {...cards[i]} onCta={() => openModal(svc)} />
          ))}
        </div>
      </div>
    </section>
  );
}
