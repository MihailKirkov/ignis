import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Work from '@/components/sections/Work';
import { Process } from '@/components/sections/Process';
import { Pricing } from '@/components/sections/Pricing';
import { Contact } from '@/components/sections/Contact';
import { FAQ } from '@/components/sections/FAQ';
import { Footer } from '@/components/Footer';
import { HomepageJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('home.title'),
    description: t('home.description'),
    keywords: t('home.keywords'),
    authors: [{ name: 'Ignis Web Studio' }],
    creator: 'Ignis Web Studio',
    publisher: 'Ignis Web Studio',
    metadataBase: new URL('https://www.ignis-mls.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        bg: '/bg',
        de: '/de',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      url: `https://www.ignis-mls.com/${locale}`,
      title: t('home.ogTitle'),
      description: t('home.ogDescription'),
      siteName: 'Ignis Web Studio',
      locale: locale === 'en' ? 'en_US' : locale === 'de' ? 'de_DE' : 'bg_BG',
      images: [
        {
          url: '/api/og',
          width: 997,
          height: 630,
          alt: 'Ignis Web Studio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.ogTitle'),
      description: t('home.ogDescription'),
      images: ['/api/og'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomepageJsonLd locale={locale} />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Work />
        <Process />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
