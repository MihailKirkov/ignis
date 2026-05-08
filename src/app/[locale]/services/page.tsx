import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectModalProvider } from '@/components/ui/ProjectModal';
import { ServicesPage } from '@/components/sections/ServicesPage';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servicesPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/services`,
      languages: {
        en: '/en/services',
        bg: '/bg/services',
        de: '/de/services',
        'x-default': '/en/services',
      },
    },
  };
}

export default async function ServicesRoute({
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
        <ServicesPage />
      </main>
      <Footer />
    </ProjectModalProvider>
  );
}
