'use client';

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ensureGsapPlugins } from '@/lib/gsap-setup';
import { FaqJsonLd } from '@/components/seo/JsonLd';

/* ─────────────────────────── Chevron icon ──────────────────────────── */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ──────────────────────────── Accordion item ───────────────────────── */

interface FaqItem {
  question: string;
  answer: string;
}

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}) {
  const answerId = `faq-answer-${index}`;
  const buttonId = `faq-button-${index}`;

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(index);
    }
  }

  return (
    <div
      data-gsap="faq-item"
      style={{
        border: isOpen
          ? '1px solid rgba(255, 107, 44, 0.35)'
          : '1px solid #1e1e2e',
        borderRadius: '0.75rem',
        background: '#0d0d14',
        overflow: 'hidden',
        boxShadow: isOpen
          ? '0 0 24px rgba(255, 107, 44, 0.08), inset 0 0 0 1px rgba(255,107,44,0.12)'
          : 'none',
        transition:
          'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a3e';
        }
      }}
      onMouseLeave={(e) => {
        if (!isOpen) {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e2e';
        }
      }}
    >
      {/* Question row */}
      <button
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => onToggle(index)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
        style={{ background: 'none', border: 'none' }}
      >
        <span
          className="font-display font-medium text-base lg:text-[1.0625rem] leading-snug"
          style={{ color: isOpen ? '#f0f0ee' : '#d0d0cc' }}
        >
          {item.question}
        </span>
        <span
          style={{
            color: isOpen ? '#ff6b2c' : '#4a4a62',
            transition: 'color 0.3s ease',
          }}
        >
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      {/* Answer — CSS max-height transition */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          maxHeight: isOpen ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <div className="px-6 pb-5 pt-0">
          <div
            className="h-px mb-5 w-full"
            style={{
              background: isOpen
                ? 'linear-gradient(90deg, rgba(255,107,44,0.3) 0%, transparent 70%)'
                : 'transparent',
              transition: 'background 0.3s ease',
            }}
          />
          <p className="text-sm lg:text-base text-text-secondary leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Section ────────────────────────────── */

export function FAQ() {
  const t = useTranslations('faq');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const rawItems = t.raw('items') as { question: string; answer: string }[];

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  useEffect(() => {
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      const headingTrigger = {
        trigger: headingRef.current,
        start: 'top 85%',
        once: true,
      };

      gsap.fromTo(
        '[data-gsap="faq-badge"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo(
        '[data-gsap="faq-heading"]',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo(
        '[data-gsap="faq-sub"]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: headingTrigger }
      );
      gsap.fromTo(
        '[data-gsap="faq-item"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: '[data-gsap="faq-item"]',
            start: 'top 85%',
            once: true,
          },
        }
      );
      gsap.fromTo(
        '[data-gsap="faq-cta"]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap="faq-cta"]',
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      {/* Structured data */}
      <FaqJsonLd items={rawItems} />

      {/* Background accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 15% 60%, rgba(255,107,44,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,107,44,0.2) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div ref={headingRef} className="mb-12 lg:mb-14">
          <div data-gsap="faq-badge" className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ignis flex-shrink-0" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
              {t('badge')}
            </span>
          </div>

          <h2
            data-gsap="faq-heading"
            className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight text-text mb-5"
          >
            {t('heading')}
          </h2>

          <p data-gsap="faq-sub" className="text-lg text-text-secondary leading-relaxed max-w-2xl">
            {t('subheading')}
          </p>
        </div>

        {/* Accordion list */}
        <div className="flex flex-col gap-3">
          {rawItems.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* CTA */}
        <div
          data-gsap="faq-cta"
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
        >
          <p className="text-text-secondary text-sm">{t('ctaText')}</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200"
            style={{ color: '#ff6b2c' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#ff8a50';
              (e.currentTarget as HTMLAnchorElement).style.gap = '10px';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#ff6b2c';
              (e.currentTarget as HTMLAnchorElement).style.gap = '6px';
            }}
          >
            {t('ctaLink')}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
