export type Category = 'landing' | 'business' | 'webapp';

export interface CaseStudy {
  hero: string;
  gallery: string[];
  challengeKey: string;
  solutionKey: string;
  resultsKeys: string[];
  stack: string[];
  liveUrl?: string;
  durationKey?: string;
  roleKey?: string;
}

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: Category;
  accent: string;
  thumbnail: string;
  projectUrl?: string;
  caseStudy?: CaseStudy;
}
