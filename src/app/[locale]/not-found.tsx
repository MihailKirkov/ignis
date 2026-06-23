'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('errors.notFound');

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[60vw] max-h-[600px] w-[60vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-ignis) 12%, transparent) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <span
        className="font-display font-bold leading-none text-gradient-fire"
        style={{ fontSize: 'clamp(5rem, 18vw, 12rem)' }}
      >
        {t('code')}
      </span>

      <h1 className="font-display mt-4 text-2xl font-bold text-text sm:text-3xl">
        {t('title')}
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
        {t('description')}
      </p>

      <Link
        href="/"
        className="group mt-10 inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
        style={{
          background:
            'linear-gradient(135deg, var(--color-ignis) 0%, var(--color-ignis-glow) 100%)',
          boxShadow: '0 4px 32px color-mix(in srgb, var(--color-ignis) 40%, transparent)',
        }}
      >
        {t('home')}
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </main>
  );
}
