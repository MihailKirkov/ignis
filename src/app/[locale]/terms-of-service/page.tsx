import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LegalPage } from '@/components/legal/LegalPage';
import { termsOfServiceEn } from '@/content/legal/terms-of-service.en';

export const metadata: Metadata = {
  title: 'Terms of Service | Ignis Web Studio',
  description: 'The terms and conditions governing your use of Ignis Web Studio services.',
  robots: 'noindex, follow',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TRANSLATION_NOTICE = `
> **Note:** This document is currently available in English only. Translations are coming soon.

---

`;

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === 'en'
    ? termsOfServiceEn
    : TRANSLATION_NOTICE + termsOfServiceEn;

  return <LegalPage content={content} />;
}
