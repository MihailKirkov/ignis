import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectModalProvider } from '@/components/ui/ProjectModal';
import { WorkPage } from '@/components/sections/WorkPage';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'workPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/work`,
      languages: {
        en: '/en/work',
        bg: '/bg/work',
        de: '/de/work',
        'x-default': '/en/work',
      },
    },
  };
}

export default async function WorkRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProjectModalProvider>
      <Navbar />
      <main>
        <WorkPage />
      </main>
      <Footer />
    </ProjectModalProvider>
  );
}
