'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ensureGsapPlugins, prefersReducedMotion } from '@/lib/gsap-setup';
import type { Project } from '@/components/sections/work/types';
import { ProjectModal } from '@/components/sections/work/ProjectModal';
import { PROJECTS } from '@/components/sections/work/projects';

const SLIDE_INTERVAL_MS = 3500;

function ProjectSlideshow({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const slides = project.caseStudy
    ? [project.caseStudy.hero, ...project.caseStudy.gallery]
    : [project.thumbnail];

  const [index, setIndex] = useState(0);
  const tWork = useTranslations('work') as (key: string) => string;

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const go = (next: number) => {
    const total = slides.length;
    setIndex(((next % total) + total) % total);
  };

  return (
    <div
      data-pkg-image
      className={`relative w-full overflow-hidden rounded-2xl group ${className ?? ''}`}
      style={{
        aspectRatio: '16 / 10',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
      }}
    >
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={tWork(project.titleKey)}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-top transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
          priority={i === 0}
        />
      ))}

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1px ${project.accent}55, 0 0 50px ${project.accent}22`,
        }}
      />

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
            style={{
              background: 'rgba(4,4,10,0.7)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
            style={{
              background: 'rgba(4,4,10,0.7)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === index ? '20px' : '6px',
                  height: '6px',
                  background:
                    i === index ? project.accent : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function WorkPage() {
  const t = useTranslations('workPage');
  const tWork = useTranslations('work') as (key: string) => string;

  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);

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

      gsap.utils.toArray<HTMLElement>('.project-section').forEach((el) => {
        const reverse = el.getAttribute('data-reverse') === 'true';
        const image = el.querySelector<HTMLElement>('[data-pkg-image]');
        const details = el.querySelectorAll<HTMLElement>('[data-pkg-anim]');

        if (image) {
          gsap.fromTo(
            image,
            { opacity: 0, x: reverse ? 60 : -60 },
            {
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 78%', once: true },
            }
          );
        }
        gsap.fromTo(
          details,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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

      {/* ── Project sections ── */}
      <div className="relative z-10">
        {PROJECTS.map((project, i) => {
          const reverse = i % 2 === 1;
          const cs = project.caseStudy;
          const liveUrl = cs?.liveUrl;

          return (
            <article
              key={project.id}
              id={project.id}
              data-reverse={reverse}
              className="project-section relative scroll-mt-28 border-t border-border"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
                <div className="grid lg:grid-cols-[55fr_45fr] gap-10 lg:gap-14 items-center">
                  <ProjectSlideshow
                    project={project}
                    className={reverse ? 'lg:order-2' : 'lg:order-1'}
                  />

                  <div
                    className={`flex flex-col ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
                  >
                    <div data-pkg-anim className="flex items-center gap-2 mb-5">
                      <span
                        className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full"
                        style={{
                          background: `${project.accent}22`,
                          color: project.accent,
                          border: `1px solid ${project.accent}45`,
                        }}
                      >
                        {tWork(`category.${project.category}`)}
                      </span>
                      {project.concept && (
                        <span
                          className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--color-text)',
                            border: '1px solid rgba(255,255,255,0.18)',
                          }}
                        >
                          {t('conceptLabel')}
                        </span>
                      )}
                    </div>

                    <h2
                      data-pkg-anim
                      className="font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-text mb-5"
                    >
                      {tWork(project.titleKey)}
                    </h2>

                    <p
                      data-pkg-anim
                      className="text-base text-text-secondary leading-relaxed mb-7"
                    >
                      {tWork(project.descriptionKey)}
                    </p>

                    {cs && (
                      <div
                        data-pkg-anim
                        className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 pb-8"
                        style={{ borderBottom: '1px solid var(--color-border)' }}
                      >
                        <div>
                          <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-text-muted mb-2">
                            {t('stack')}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {cs.stack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 text-[11px] font-medium rounded-md"
                                style={{
                                  background: 'rgba(255,255,255,0.04)',
                                  color: '#c8c8d6',
                                  border: '1px solid var(--color-border)',
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        {cs.durationKey && (
                          <div>
                            <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-text-muted mb-2">
                              {t('duration')}
                            </div>
                            <div className="text-sm text-text">
                              {tWork(cs.durationKey)}
                            </div>
                          </div>
                        )}
                        {cs.roleKey && (
                          <div>
                            <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-text-muted mb-2">
                              {t('role')}
                            </div>
                            <div className="text-sm text-text">
                              {tWork(cs.roleKey)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div data-pkg-anim className="flex flex-wrap items-center gap-3">
                      {liveUrl && (
                        <button
                          onClick={() => window.open(liveUrl, '_blank', 'noopener,noreferrer')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                          style={{ background: 'linear-gradient(135deg, var(--color-ignis), var(--color-ignis-glow))' }}
                        >
                          {t('viewLive')}
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
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      )}
                      {cs && (
                        <button
                          onClick={(e) => {
                            setTriggerElement(e.currentTarget);
                            setSelectedProject(project);
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                          style={
                            liveUrl
                              ? {
                                  background: 'transparent',
                                  color: 'var(--color-text)',
                                  border: '1px solid #2a2a3a',
                                }
                              : {
                                  background: 'linear-gradient(135deg, var(--color-ignis), var(--color-ignis-glow))',
                                  color: '#fff',
                                  border: '1px solid transparent',
                                }
                          }
                        >
                          {t('viewProject')}
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
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
