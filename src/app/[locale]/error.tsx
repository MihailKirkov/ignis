'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors.error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[60vw] max-h-[600px] w-[60vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-ignis-red) 12%, transparent) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="mb-7 inline-flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ignis-red" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
          {t('label')}
        </span>
      </div>

      <h1
        className="font-display font-bold leading-[1.06] tracking-tight text-gradient-fire"
        style={{ fontSize: 'clamp(2.2rem, 6vw, 3.75rem)' }}
      >
        {t('title')}
      </h1>

      <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
        {t('description')}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button
          onClick={reset}
          className="group inline-flex cursor-pointer items-center gap-2.5 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
          style={{
            background:
              'linear-gradient(135deg, var(--color-ignis) 0%, var(--color-ignis-glow) 100%)',
            boxShadow: '0 4px 32px color-mix(in srgb, var(--color-ignis) 40%, transparent)',
          }}
        >
          {t('retry')}
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-sm font-semibold text-text-secondary transition-all duration-300 hover:text-text"
          style={{ border: '1px solid var(--color-border-bright)' }}
        >
          {t('home')}
        </Link>
      </div>
    </main>
  );
}
