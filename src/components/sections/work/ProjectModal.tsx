'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import gsap from 'gsap';
import type { Project } from './types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  triggerElement?: HTMLButtonElement | null;
}

export function ProjectModal({ project, onClose, triggerElement }: ProjectModalProps) {
  const t = useTranslations('work') as (key: string) => string;
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const entranceTl = useRef<gsap.core.Timeline | null>(null);
  const isClosingRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => { setMounted(true); }, []);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (!project) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [project]);

  /* ── Focus close button on open ── */
  useEffect(() => {
    if (!project || !mounted) return;
    const id = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [project, mounted]);

  /* ── Entrance animation ── */
  useEffect(() => {
    if (!project || !mounted) return;
    entranceTl.current = gsap.timeline()
      .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      .fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' },
        0.05
      );
    return () => { entranceTl.current?.kill(); };
  }, [project, mounted]);

  /* ── Exit animation ── */
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
  }, []);

  useEffect(() => {
    if (!isClosing) return;
    entranceTl.current?.kill();
    gsap.timeline({
      onComplete: () => {
        triggerElement?.focus();
        onCloseRef.current();
      },
    })
      .to(containerRef.current, { opacity: 0, scale: 0.96, y: 10, duration: 0.25, ease: 'power2.in' })
      .to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0);
  }, [isClosing, triggerElement]);

  /* ── ESC key + focus trap ── */
  useEffect(() => {
    if (!project) return;
    const FOCUSABLE =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { handleClose(); return; }
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, handleClose]);

  if (!project || !project.caseStudy || !mounted) return null;

  const cs = project.caseStudy;
  const hasMetaRow = cs.durationKey || cs.roleKey || cs.liveUrl;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Centering wrapper — pointer-events-none so gaps click through to backdrop */}
      <div className="flex min-h-full items-stretch md:items-center justify-center md:p-6 pointer-events-none">
        {/* Modal container */}
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${project.id}`}
          aria-describedby={`modal-desc-${project.id}`}
          className="relative pointer-events-auto w-full min-h-full md:min-h-0 md:max-w-[1100px] md:max-h-[85vh] md:rounded-2xl bg-surface md:border md:border-border md:shadow-2xl overflow-y-auto"
        >
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label={t('modal.close')}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ── Hero image ── */}
          <div className="relative w-full aspect-video overflow-hidden md:rounded-t-2xl">
            <Image
              src={cs.hero}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-cover"
            />
          </div>

          {/* ── Header ── */}
          <div className="px-6 lg:px-10 py-8">
            <span
              className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full mb-4"
              style={{
                background: `${project.accent}22`,
                color: project.accent,
                border: `1px solid ${project.accent}45`,
              }}
            >
              {t(`category.${project.category}`)}
            </span>

            <h2
              id={`modal-title-${project.id}`}
              className="font-display text-3xl lg:text-4xl font-bold text-text mb-3 leading-tight"
            >
              {t(project.titleKey)}
            </h2>

            <p
              id={`modal-desc-${project.id}`}
              className="text-lg text-text-secondary leading-relaxed mb-4"
            >
              {t(project.descriptionKey)}
            </p>

            {hasMetaRow && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
                {cs.durationKey && <span>{t(cs.durationKey)}</span>}
                {cs.durationKey && (cs.roleKey || cs.liveUrl) && <span aria-hidden>·</span>}
                {cs.roleKey && <span>{t(cs.roleKey)}</span>}
                {cs.roleKey && cs.liveUrl && <span aria-hidden>·</span>}
                {cs.liveUrl && (
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-text transition-colors"
                  >
                    {cs.liveUrl}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* ── Challenge / Solution ── */}
          <div className="grid md:grid-cols-2 gap-8 px-6 lg:px-10 py-6 border-t border-border">
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3">
                {t('modal.challenge')}
              </h3>
              <p className="text-text leading-relaxed">{t(cs.challengeKey)}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3">
                {t('modal.solution')}
              </h3>
              <p className="text-text leading-relaxed">{t(cs.solutionKey)}</p>
            </div>
          </div>

          {/* ── Results ── */}
          {cs.resultsKeys.length > 0 && (
            <div className="px-6 lg:px-10 py-6 border-t border-border">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4">
                {t('modal.results')}
              </h3>
              <ul className="space-y-2">
                {cs.resultsKeys.map((key, i) => (
                  <li key={i} className="flex items-start gap-2 text-text">
                    <span
                      className="mt-0.5 flex-shrink-0 text-base leading-none"
                      style={{ color: project.accent }}
                      aria-hidden
                    >
                      •
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Stack ── */}
          <div className="px-6 lg:px-10 py-6 border-t border-border">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4">
              {t('modal.builtWith')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cs.stack.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 text-sm rounded-full bg-surface-2 border border-border text-text"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── Gallery ── */}
          {cs.gallery.length > 0 && (
            <div className="px-6 lg:px-10 py-6 border-t border-border flex flex-col gap-4">
              {cs.gallery.map((src, i) => (
                <div key={i} className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 1020px, calc(100vw - 3rem)"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="px-6 lg:px-10 py-8 border-t border-border flex flex-wrap items-center gap-4">
            {cs.liveUrl && (
              <a
                href={cs.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
                style={{ background: project.accent }}
              >
                {t('modal.viewLiveSite')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <a
              href="#contact"
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-text-secondary rounded-lg border border-border hover:text-text hover:border-border-bright transition-colors"
            >
              {t('modal.startProject')}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
