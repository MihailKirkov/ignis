import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LegalPage } from '@/components/legal/LegalPage';
import { privacyPolicyEn } from '@/content/legal/privacy-policy.en';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ignis Web Studio',
  description: 'How Ignis Web Studio collects, uses, and protects your personal information.',
  robots: 'noindex, follow',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TRANSLATION_NOTICE = `
> **Note:** This document is currently available in English only. Translations are coming soon.

---

`;

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === 'en'
    ? privacyPolicyEn
    : TRANSLATION_NOTICE + privacyPolicyEn;

  return <LegalPage content={content} />;
}
