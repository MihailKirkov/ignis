'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ensureGsapPlugins, prefersReducedMotion } from '@/lib/gsap-setup';
import type { Project } from './work/types';
import { ProjectModal } from './work/ProjectModal';
import { ProjectCard } from './work/ProjectCard';
import { FilterTabs } from './work/FilterTabs';
import { PROJECTS } from './work/projects';

export default function Work() {
  const t = useTranslations('work');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const entranceDoneRef = useRef(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);

  const FILTERS = [
    { key: 'all', label: t('filterAll') },
    { key: 'landing', label: t('filterLanding') },
    { key: 'business', label: t('filterBusiness') },
    { key: 'webapp', label: t('filterApp') },
  ];

  useEffect(() => {
    ensureGsapPlugins();
    if (prefersReducedMotion()) return;
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
