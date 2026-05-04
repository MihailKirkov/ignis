'use client';

import dynamic from 'next/dynamic';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';

const Services = dynamic(() => import('@/components/sections/Services'), {
  loading: () => <SectionSkeleton />,
});
const Work = dynamic(() => import('@/components/sections/Work'), {
  loading: () => <SectionSkeleton />,
});
const Process = dynamic(
  () => import('@/components/sections/Process').then((m) => ({ default: m.Process })),
  { loading: () => <SectionSkeleton /> },
);
const Pricing = dynamic(
  () => import('@/components/sections/Pricing').then((m) => ({ default: m.Pricing })),
  { loading: () => <SectionSkeleton /> },
);
const FAQ = dynamic(
  () => import('@/components/sections/FAQ').then((m) => ({ default: m.FAQ })),
  { loading: () => <SectionSkeleton /> },
);
const Contact = dynamic(
  () => import('@/components/sections/Contact').then((m) => ({ default: m.Contact })),
  { loading: () => <SectionSkeleton /> },
);

export function HomeSections() {
  return (
    <>
      <Services />
      <Work />
      <Process />
      <Pricing />
      <FAQ />
      <Contact />
    </>
  );
}
