'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const NAV_LINKS = [
  { key: 'services' as const, href: '#services' },
  { key: 'work'     as const, href: '#work'     },
  { key: 'process'  as const, href: '#process'  },
  { key: 'pricing'  as const, href: '#pricing'  },
  { key: 'contact'  as const, href: '#contact'  },
] as const;

export function Footer() {
  const tn = useTranslations('nav');
  const tf = useTranslations('footer');

  return (
    <footer
      className="relative border-t"
      style={{ borderColor: 'rgba(255,107,44,0.1)', background: '#06060a' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">

          {/* ── Logo + tagline ── */}
          <div className="flex flex-col gap-3 lg:max-w-[260px]">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-ignis opacity-15 blur-sm" />
                <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 relative z-10">
                  <path
                    d="M16 4C16 4 8 12 8 20C8 24.4 11.6 28 16 28C20.4 28 24 24.4 24 20C24 16 20 12 20 12C20 12 20 16 16 18C16 18 12 14 16 4Z"
                    fill="url(#footer-flame)"
                  />
                  <defs>
                    <linearGradient id="footer-flame" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%"   stopColor="#ffcb47" />
                      <stop offset="50%"  stopColor="#ff6b2c" />
                      <stop offset="100%" stopColor="#ff3d00" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span
                className="font-display text-lg font-bold tracking-wider text-text group-hover:text-ignis transition-colors duration-300"
                style={{ letterSpacing: '0.15em' }}
              >
                IGNIS
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              {tf('tagline')}
            </p>
          </div>

          {/* ── Nav links ── */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 lg:gap-x-10">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="text-sm text-text-muted hover:text-text transition-colors duration-250"
              >
                {tn(key)}
              </a>
            ))}
          </nav>

          {/* ── Copyright ── */}
          <div className="flex flex-col gap-1.5 lg:text-right lg:max-w-[220px]">
            <p className="text-xs text-text-muted leading-relaxed">
              {tf('copyright')}
            </p>
            <p className="text-xs text-text-muted opacity-50">
              {tf('madeBy')}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
