import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LegalPage } from '@/components/legal/LegalPage';
import { cookiePolicyEn } from '@/content/legal/cookie-policy.en';

export const metadata: Metadata = {
  title: 'Cookie Policy | Ignis Web Studio',
  description: 'How Ignis Web Studio uses cookies and tracking technologies on our website.',
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TRANSLATION_NOTICE = `
> **Note:** This document is currently available in English only. Translations are coming soon.

---

`;

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === 'en'
    ? cookiePolicyEn
    : TRANSLATION_NOTICE + cookiePolicyEn;

  return <LegalPage content={content} />;
}
