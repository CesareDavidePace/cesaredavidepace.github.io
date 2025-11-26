export type Language = 'en' | 'it';

export interface LocalizedString {
  en: string;
  it: string;
}

export interface SocialProfile {
  network: string;
  username: string;
  url: string;
  iconName: string; // string reference to Lucide icon
}

export interface TimelineItem {
  id: string;
  year: string;
  title: LocalizedString;
  institution: string;
  description: LocalizedString;
  type: 'education' | 'work' | 'award';
  logo?: string;
  logos?: string[];
}

export interface Project {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  technologies: string[];
  imageUrl?: string;
  link?: string;
  playStoreLink?: string;
  appStoreLink?: string;
  githubUrl?: string;
  category: 'vision' | 'biomechanics' | 'system' | 'web' | 'mobile';
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  pdfLink?: string;
  githubUrl?: string;
  tags: string[];
}

export interface ProfileData {
  name: string;
  role: LocalizedString;
  tagline: LocalizedString;
  email: string;
  location: string;
  socials: SocialProfile[];
  about: LocalizedString;
}

export interface AppData {
  profile: ProfileData;
  history: TimelineItem[];
  projects: Project[];
  publications: Publication[];
  ui: {
    [key: string]: LocalizedString;
  };
}