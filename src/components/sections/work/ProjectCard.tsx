'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Project } from './types';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project, trigger: HTMLElement) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
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
      onClick={(e) => {
        if (project.caseStudy) {
          onOpen(project, e.currentTarget);
        } else if (project.projectUrl) {
          window.open(project.projectUrl, '_blank');
        }
      }}
    >
      <Image
        src={project.thumbnail}
        alt={t(project.titleKey)}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-top"
        priority={false}
      />

      <div
        className="absolute inset-x-0 top-0 h-24 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
        }}
      />

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
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
          tabIndex={-1}
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

      <div
        className="absolute inset-0 z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${project.accent}50, 0 0 40px ${project.accent}18`,
        }}
      />

      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.01] pointer-events-none" />
    </div>
  );
}
