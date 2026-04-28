interface JsonLdProps {
  locale: string;
}

export function HomepageJsonLd({ locale }: JsonLdProps) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ignis Web Studio',
    alternateName: 'Ignis MLS',
    url: 'https://www.ignis-mls.com',
    logo: 'https://www.ignis-mls.com/logo.svg',
    email: 'team@ignis-mls.com',
    telephone: '+359882395117',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. "Sheynovo" 11',
      addressLocality: 'Pleven',
      postalCode: '5800',
      addressCountry: 'BG',
    },
    founder: {
      '@type': 'Person',
      name: 'Mihail Milenov Kirkov',
    },
  };

  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Ignis Web Studio',
    description:
      'Web development studio specializing in landing pages, business websites, and custom web applications for small and mid-sized businesses in Europe.',
    url: 'https://www.ignis-mls.com',
    image: 'https://www.ignis-mls.com/api/og',
    priceRange: '€490–€10,000+',
    areaServed: [
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Austria' },
      { '@type': 'Country', name: 'Switzerland' },
      { '@type': 'Country', name: 'Netherlands' },
      { '@type': 'Place', name: 'Europe' },
    ],
    knowsLanguage: ['en', 'de', 'bg'],
    serviceType: ['Web Development', 'Landing Page Design', 'Web Application Development'],
    provider: {
      '@type': 'Organization',
      name: 'Ignis Web Studio',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Landing Page',
            description:
              'Single-page conversion-focused website built with Next.js and modern web tooling.',
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: '490',
            priceCurrency: 'EUR',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business Website',
            description:
              'Multi-page business website with CMS, SEO foundations, and performance optimization.',
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: '997',
            priceCurrency: 'EUR',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Web Application',
            description:
              'Bespoke web applications, dashboards, and SaaS-style products built with React, Next.js, and modern backends.',
          },
        },
      ],
    },
  };

  void locale;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
    </>
  );
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
