'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────── Project data ──────────────────────────── */

type Category = 'landing' | 'business' | 'webapp';

interface Project {
  id: string;
  title: string;
  category: Category;
  description: string;
  fromColor: string;
  toColor: string;
  accentColor: string;
}

const PROJECTS: Project[] = [
  {
    id: 'luminary',
    title: 'Luminary Co.',
    category: 'landing',
    description: 'B2B SaaS landing page that tripled trial signups in 30 days through conversion-led design.',
    fromColor: '#07071e',
    toColor: '#110d32',
    accentColor: '#7c3aed',
  },
  {
    id: 'apex',
    title: 'Apex Digital',
    category: 'webapp',
    description: 'Real-time analytics dashboard serving 40k+ daily users with sub-200ms query response.',
    fromColor: '#021414',
    toColor: '#071e1c',
    accentColor: '#10b981',
  },
  {
    id: 'novabrand',
    title: 'NovaBrand Agency',
    category: 'business',
    description: 'Creative agency site with headless CMS, portfolio showcase, and integrated lead capture.',
    fromColor: '#130a16',
    toColor: '#1c0a1e',
    accentColor: '#ec4899',
  },
  {
    id: 'flowmetrics',
    title: 'FlowMetrics',
    category: 'webapp',
    description: 'SaaS platform for product metric tracking with customizable dashboards and smart alerts.',
    fromColor: '#03080f',
    toColor: '#070d1f',
    accentColor: '#3b82f6',
  },
  {
    id: 'ember',
    title: 'Ember Collective',
    category: 'landing',
    description: 'Premium lifestyle brand launch with immersive scroll storytelling and animated product reveals.',
    fromColor: '#160700',
    toColor: '#1d0c00',
    accentColor: '#f97316',
  },
  {
    id: 'nordvik',
    title: 'Nordvik Group',
    category: 'business',
    description: 'Corporate investment firm site built to communicate authority and acquire high-value clients.',
    fromColor: '#07090e',
    toColor: '#0b0f18',
    accentColor: '#94a3b8',
  },
];

/* ─────────────────────── Website mockup placeholder ───────────────── */

function ProjectMockup({
  fromColor,
  toColor,
  accentColor,
}: Pick<Project, 'fromColor' | 'toColor' | 'accentColor'>) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${fromColor} 0%, ${toColor} 100%)` }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${accentColor}22 1px, transparent 1px)`,
          backgroundSize: '22px 22px',
        }}
      />

      {/* Browser chrome bar */}
      <div
        className="absolute top-0 inset-x-0 h-7 flex items-center px-3 gap-1.5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {[0.28, 0.16, 0.1].map((op, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: `rgba(255,255,255,${op})` }}
          />
        ))}
        <div
          className="flex-1 mx-2 h-3 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
      </div>

      {/* Mock navbar */}
      <div
        className="absolute top-7 inset-x-0 h-9 flex items-center justify-between px-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="w-14 h-2 rounded-sm" style={{ background: `${accentColor}b0` }} />
        <div className="flex items-center gap-2.5">
          {[0.2, 0.14, 0.09].map((op, i) => (
            <div
              key={i}
              className="w-8 h-1.5 rounded-sm"
              style={{ background: `rgba(255,255,255,${op})` }}
            />
          ))}
          <div
            className="w-16 h-5 rounded-md"
            style={{
              background: `${accentColor}45`,
              border: `1px solid ${accentColor}65`,
            }}
          />
        </div>
      </div>

      {/* Hero copy area */}
      <div className="absolute top-20 left-5 right-5">
        <div
          className="w-20 h-2.5 rounded-full mb-3"
          style={{ background: `${accentColor}40` }}
        />
        <div
          className="w-4/5 h-4 rounded mb-2"
          style={{ background: 'rgba(255,255,255,0.14)' }}
        />
        <div
          className="w-3/5 h-4 rounded mb-3.5"
          style={{ background: 'rgba(255,255,255,0.09)' }}
        />
        <div
          className="w-full h-2 rounded mb-1.5"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        />
        <div
          className="w-4/5 h-2 rounded mb-5"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        <div className="flex items-center gap-2.5">
          <div
            className="w-20 h-6 rounded-lg"
            style={{ background: `${accentColor}70` }}
          />
          <div
            className="w-16 h-6 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </div>

      {/* Radial glow blob */}
      <div
        className="absolute bottom-6 right-5 w-28 h-28 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
          filter: 'blur(18px)',
        }}
      />

      {/* Content card row */}
      <div className="absolute bottom-5 left-4 right-4 flex gap-2.5">
        {[0.07, 0.05, 0.035].map((op, i) => (
          <div
            key={i}
            className="flex-1 h-10 rounded-xl"
            style={{
              background: `rgba(255,255,255,${op})`,
              border: `1px solid rgba(255,255,255,${op * 1.6})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── Project card ─────────────────────────── */

const CATEGORY_LABELS: Record<Category, string> = {
  landing: 'Landing Page',
  business: 'Business Site',
  webapp: 'Web App',
};

function ProjectCard({
  project,
  viewLabel,
}: {
  project: Project;
  viewLabel: string;
}) {
  return (
    <div
      data-category={project.category}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        height: '300px',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Mockup background */}
      <ProjectMockup
        fromColor={project.fromColor}
        toColor={project.toColor}
        accentColor={project.accentColor}
      />

      {/* Category pill */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full"
          style={{
            background: `${project.accentColor}22`,
            color: project.accentColor,
            border: `1px solid ${project.accentColor}45`,
          }}
        >
          {CATEGORY_LABELS[project.category]}
        </span>
      </div>

      {/* Hover overlay — slides up from below */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
        style={{
          background:
            'linear-gradient(to top, rgba(4,4,10,0.96) 0%, rgba(4,4,10,0.75) 55%, transparent 100%)',
          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <h3 className="font-display text-lg font-bold text-white mb-1.5 leading-tight">
          {project.title}
        </h3>
        <p className="text-xs text-white/55 mb-5 leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <button
          className="self-start flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all duration-200 hover:gap-3 cursor-pointer"
          style={{
            background: `${project.accentColor}55`,
            border: `1px solid ${project.accentColor}80`,
          }}
        >
          {viewLabel}
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Accent border + outer glow on hover */}
      <div
        className="absolute inset-0 z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${project.accentColor}50, 0 0 40px ${project.accentColor}18`,
        }}
      />

      {/* Subtle card scale */}
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.01] pointer-events-none" />
    </div>
  );
}

/* ──────────────────────────── Filter tabs ─────────────────────────── */

function FilterTabs({
  active,
  filters,
  onChange,
}: {
  active: string;
  filters: { key: string; label: string }[];
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all duration-250 cursor-pointer whitespace-nowrap"
          style={
            active === key
              ? {
                  background: 'linear-gradient(135deg, #ff6b2c 0%, #ffb347 100%)',
                  color: '#fff',
                  border: '1px solid transparent',
                  boxShadow: '0 2px 16px rgba(255,107,44,0.3)',
                }
              : {
                  background: 'transparent',
                  color: '#8e8ea8',
                  border: '1px solid #1e1e2e',
                }
          }
          onMouseEnter={(e) => {
            if (active !== key)
              (e.currentTarget as HTMLButtonElement).style.color = '#f0f0ee';
          }}
          onMouseLeave={(e) => {
            if (active !== key)
              (e.currentTarget as HTMLButtonElement).style.color = '#8e8ea8';
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ───────────────────────────── Section ────────────────────────────── */

export default function Work() {
  const t = useTranslations('work');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const entranceDoneRef = useRef(false);

  const FILTERS = [
    { key: 'all', label: t('filterAll') },
    { key: 'landing', label: t('filterLanding') },
    { key: 'business', label: t('filterBusiness') },
    { key: 'webapp', label: t('filterApp') },
  ];

  /* ── Entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const headingTrigger = { trigger: headingRef.current, start: 'top 86%', once: true };
      const gridTrigger = { trigger: gridRef.current, start: 'top 84%', once: true };

      gsap.fromTo(
        '[data-gsap="work-badge"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo(
        '[data-gsap="work-heading"]',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo(
        '[data-gsap="work-sub"]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo(
        tabsRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo(
        '[data-category]',
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            ...gridTrigger,
            onEnter: () => { entranceDoneRef.current = true; },
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Filter handler ── */
  const handleFilter = (newFilter: string) => {
    if (newFilter === activeFilter) return;
    setActiveFilter(newFilter);

    const grid = gridRef.current;
    if (!grid) return;

    const allCards = Array.from(
      grid.querySelectorAll('[data-category]')
    ) as HTMLElement[];

    const matching = allCards.filter(
      (el) => newFilter === 'all' || el.getAttribute('data-category') === newFilter
    );
    const hiding = allCards.filter(
      (el) => newFilter !== 'all' && el.getAttribute('data-category') !== newFilter
    );

    const revealMatching = () => {
      /* Pull hidden cards out of flow so the grid reflows */
      hiding.forEach((el) => {
        el.style.display = 'none';
        el.style.pointerEvents = 'none';
      });

      /* Restore display on any matching card that was previously hidden */
      matching.forEach((el) => {
        if (el.style.display === 'none') {
          el.style.display = '';
          gsap.set(el, { opacity: 0, scale: 0.96 });
        }
        el.style.pointerEvents = 'auto';
      });

      gsap.to(matching, {
        opacity: 1,
        scale: 1,
        duration: 0.42,
        ease: 'power2.out',
        stagger: 0.07,
        overwrite: 'auto',
      });
    };

    /* Fade out visible non-matching cards first, then reflow */
    const visibleHiding = hiding.filter((el) => el.style.display !== 'none');
    if (visibleHiding.length > 0) {
      gsap.to(visibleHiding, {
        opacity: 0,
        scale: 0.93,
        duration: 0.25,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: revealMatching,
      });
    } else {
      revealMatching();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      {/* Background accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 75% 50%, rgba(255,107,44,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,107,44,0.3) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div ref={headingRef} className="max-w-2xl mb-12 lg:mb-14">
          <div data-gsap="work-badge" className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ignis flex-shrink-0" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
              {t('badge')}
            </span>
          </div>

          <h2
            data-gsap="work-heading"
            className="font-display text-[clamp(2.2rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text mb-5"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t('heading')}
          </h2>

          <p data-gsap="work-sub" className="text-lg text-text-secondary leading-relaxed">
            {t('subheading')}
          </p>
        </div>

        {/* Filter tabs */}
        <div ref={tabsRef} className="mb-10">
          <FilterTabs
            active={activeFilter}
            filters={FILTERS}
            onChange={handleFilter}
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewLabel={t('viewProject')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
