'use client';

import { ProjectModalProvider } from '@/components/ui/ProjectModal';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <ProjectModalProvider>{children}</ProjectModalProvider>;
}
