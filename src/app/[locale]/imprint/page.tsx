import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LegalPage } from '@/components/legal/LegalPage';
import { imprintEn } from '@/content/legal/imprint.en';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'de' ? 'Impressum | Ignis Web Studio' : 'Imprint | Ignis Web Studio',
    description: 'Legal information and contact details for Ignis Web Studio.',
    robots: 'noindex, follow',
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalPage content={imprintEn} />;
}
