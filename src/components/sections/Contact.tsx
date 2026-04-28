'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useProjectModal } from '@/components/ui/ProjectModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────── Social icons ────────────────────────── */

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.988l4.256 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ──────────────────────── Component ───────────────────────────── */

export function Contact() {
  const t = useTranslations('contact');
  const { open: openModal } = useProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref    = useRef<HTMLDivElement>(null);
  const orb2Ref    = useRef<HTMLDivElement>(null);
  const orb3Ref    = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Ambient orb pulses — looping, no ScrollTrigger */
      gsap.to(orb1Ref.current, {
        scale: 1.45, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1,
      });
      gsap.to(orb2Ref.current, {
        scale: 1.3, x: 50, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8,
      });
      gsap.to(orb3Ref.current, {
        scale: 1.25, x: -40, y: 30, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3.5,
      });

      /* Content entrance */
      const st = { trigger: contentRef.current, start: 'top 82%', once: true };
      gsap.fromTo('[data-gsap="cta-badge"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: st });
      gsap.fromTo('[data-gsap="cta-heading"]', { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.05, scrollTrigger: st });
      gsap.fromTo('[data-gsap="cta-sub"]',     { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1,  scrollTrigger: st });
      gsap.fromTo('[data-gsap="cta-buttons"]', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.18, scrollTrigger: st });
      gsap.fromTo('[data-gsap="cta-email"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.26, scrollTrigger: st });
      gsap.fromTo('[data-gsap="cta-social"]',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.34, scrollTrigger: st });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 lg:py-44 overflow-hidden"
      style={{ background: '#06060a' }}
    >
      {/* Animated ambient orbs */}
      <div
        ref={orb1Ref}
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '50%', transform: 'translate(-50%, 0)',
          width: '70vw', height: '70vw', maxWidth: '900px', maxHeight: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,44,0.09) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute pointer-events-none"
        style={{
          top: '30%', right: '-10%',
          width: '40vw', height: '40vw', maxWidth: '600px', maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,179,71,0.07) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        ref={orb3Ref}
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', left: '-5%',
          width: '35vw', height: '35vw', maxWidth: '500px', maxHeight: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,61,0,0.06) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Noise/grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,107,44,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,107,44,0.8) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top separator */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,44,0.25) 50%, transparent 100%)' }}
      />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">

        {/* Badge */}
        <div data-gsap="cta-badge" className="inline-flex items-center gap-2.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-ignis flex-shrink-0" />
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
            {t('badge')}
          </span>
        </div>

        {/* Headline */}
        <h2
          data-gsap="cta-heading"
          className="font-display font-bold leading-[1.06] tracking-tight mb-7"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            whiteSpace: 'pre-line',
            background: 'linear-gradient(135deg, #f0f0ee 0%, #ff6b2c 45%, #ffb347 75%, #f0f0ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('heading')}
        </h2>

        {/* Subtext */}
        <p
          data-gsap="cta-sub"
          className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-12"
        >
          {t('subheading')}
        </p>

        {/* CTA buttons */}
        <div data-gsap="cta-buttons" className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mb-12">
          {/* Primary */}
          <button
            onClick={() => openModal()}
            className="relative group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(135deg, #ff6b2c 0%, #ffb347 100%)',
              boxShadow: '0 4px 32px rgba(255,107,44,0.4)',
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #ff8a50 0%, #ffcb47 100%)' }}
            />
            <span className="relative z-10">{t('cta')}</span>
            <svg className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Secondary */}
          <button
            onClick={() => window.open(process.env.NEXT_PUBLIC_CALENDLY_URL, '_blank')}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-text-secondary cursor-pointer transition-all duration-300 hover:text-text hover:border-ignis/50"
            style={{ border: '1px solid #2a2a3e' }}
          >
            <svg className="w-4 h-4 transition-colors duration-300 group-hover:text-ignis" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {t('bookCall')}
          </button>
        </div>

        {/* Email */}
        <div data-gsap="cta-email" className="mb-10">
          <p className="text-xs text-text-muted mb-2 tracking-wide uppercase">
            {t('emailLabel')}
          </p>
          <a
            href={`mailto:${t('email')}`}
            className="text-base font-medium text-text-secondary hover:text-ignis transition-colors duration-300"
            style={{ letterSpacing: '0.02em' }}
          >
            {t('email')}
          </a>
        </div>

        {/* Social links */}
        {/* <div data-gsap="cta-social" className="flex items-center justify-center gap-4">
          {[
            { icon: <IconX />,        href: '#', label: 'X / Twitter' },
            { icon: <IconGitHub />,   href: '#', label: 'GitHub' },
            { icon: <IconLinkedIn />, href: '#', label: 'LinkedIn' },
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex items-center justify-center w-10 h-10 rounded-full text-text-muted hover:text-text transition-all duration-300 hover:scale-110"
              style={{ border: '1px solid #1e1e2e', background: 'rgba(255,255,255,0.02)' }}
            >
              {icon}
            </a>
          ))}
        </div> */}

      </div>
    </section>
  );
}
