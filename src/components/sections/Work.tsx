'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from './work/types';
import { ProjectModal } from './work/ProjectModal';

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────── Project data ──────────────────────────── */

const PROJECTS: Project[] = [
  {
    id: 'kaboom-bg',
    titleKey: 'projects.kaboom-bg.title',
    descriptionKey: 'projects.kaboom-bg.description',
    category: 'landing',
    accent: '#ed3a3a',
    thumbnail: '/images/work/kaboom-bg/thumb.webp',
    caseStudy: {
      hero: '/images/work/kaboom-bg/hero.png',
      gallery: [
        '/images/work/kaboom/gallery-1.webp',
        '/images/work/kaboom/gallery-2.webp',
      ],
      challengeKey: 'projects.kaboom-bg.challenge',
      solutionKey: 'projects.kaboom-bg.solution',
      resultsKeys: [],
      stack: ['Next.js', 'Tailwind', 'GSAP'],
      liveUrl: 'https://kaboom.bg',
      durationKey: 'projects.kaboom-bg.duration',
      roleKey: 'projects.kaboom-bg.role',
    },
  },
  {
    id: 'lead-hq',
    titleKey: 'projects.lead-hq.title',
    descriptionKey: 'projects.lead-hq.description',
    category: 'webapp',
    accent: '#ff6b35',
    thumbnail: '/images/work/lead-hq/thumb.webp',
    caseStudy: {
      hero: '/images/work/lead-hq/hero.webp',
      gallery: ['/images/work/lead-hq/lead-hq-leads-table.webp', '/images/work/lead-hq/lead-hq-scraper.webp'],
      challengeKey: 'projects.lead-hq.challenge',
      solutionKey: 'projects.lead-hq.solution',
      resultsKeys: [],
      stack: ['Next.js', 'Supabase', 'Python', 'OpenAI'],
      durationKey: 'projects.lead-hq.duration',
      roleKey: 'projects.lead-hq.role',
    },
  },
  {
    id: 'the-sharp-cut',
    titleKey: 'projects.the-sharp-cut.title',
    descriptionKey: 'projects.the-sharp-cut.description',
    category: 'business',
    accent: '#d4a853',
    thumbnail: '/images/work/the-sharp-cut/thumb.webp',
    caseStudy: {
      hero: '/images/work/the-sharp-cut/hero.webp',
      gallery: ['/images/work/the-sharp-cut/gallery-1.webp', '/images/work/the-sharp-cut/gallery-2.webp'],
      challengeKey: 'projects.the-sharp-cut.challenge',
      solutionKey: 'projects.the-sharp-cut.solution',
      resultsKeys: [],
      stack: ['Next.js', 'Tailwind'],
      durationKey: 'projects.the-sharp-cut.duration',
      roleKey: 'projects.the-sharp-cut.role',
      liveUrl: 'https://the-sharp-cut.vercel.app/',
    },
  },
];

/* ─────────────────────────── Project card ─────────────────────────── */

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project, trigger: HTMLButtonElement) => void;
}) {
  const t = useTranslations('work') as (key: string) => string;

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
      {/* Screenshot */}
      <Image
        src={project.thumbnail}
        alt={t(project.titleKey)}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-top"
        priority={false}
      />

      {/* Top gradient so category pill stays legible on any image */}
      <div
        className="absolute inset-x-0 top-0 h-24 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
        }}
      />

      {/* Category pill */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full"
          style={{
            background: `${project.accent}22`,
            color: project.accent,
            border: `1px solid ${project.accent}45`,
          }}
        >
          {t(`category.${project.category}`)}
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
          {t(project.titleKey)}
        </h3>
        <p className="text-xs text-white/55 mb-5 leading-relaxed line-clamp-2">
          {t(project.descriptionKey)}
        </p>
        <button
          className="self-start flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all duration-200 hover:gap-3 cursor-pointer"
          style={{
            background: `${project.accent}55`,
            border: `1px solid ${project.accent}80`,
          }}
          onClick={(e) => {
            if (project.caseStudy) {
              onOpen(project, e.currentTarget as HTMLButtonElement);
            } else if (project.projectUrl) {
              window.open(project.projectUrl, '_blank');
            }
          }}
        >
          {t('viewProject')}
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
          boxShadow: `inset 0 0 0 1px ${project.accent}50, 0 0 40px ${project.accent}18`,
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

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLButtonElement | null>(null);

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
      hiding.forEach((el) => {
        el.style.display = 'none';
        el.style.pointerEvents = 'none';
      });

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
              onOpen={(proj, btn) => {
                setTriggerElement(btn);
                setSelectedProject(proj);
              }}
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => {
            setSelectedProject(null);
            setTriggerElement(null);
          }}
          triggerElement={triggerElement}
        />
      )}
    </section>
  );
}
