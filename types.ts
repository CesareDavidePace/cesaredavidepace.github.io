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
  shortName?: string;
  pipeline?: LocalizedString[];
  link?: string;
  playStoreLink?: string;
  appStoreLink?: string;
  githubUrl?: string;
  group?: 'research' | 'software';
  /** Generated illustration for projects without an image */
  art?: 'frames' | 'landmarks';
  category: 'vision' | 'biomechanics' | 'system' | 'web' | 'mobile' | 'deep-learning';
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

export interface NewsItem {
  date: string;
  en: string;
  it: string;
  link?: string;
}

export interface StoryItem {
  id: string;
  /** YYYY, YYYY-MM or YYYY-MM-DD */
  date: string;
  title: LocalizedString;
  detail?: LocalizedString;
  image?: string;
  link?: string;
  /** URL of the LinkedIn post this moment comes from */
  linkedin?: string;
  finale?: boolean;
  /** Institutions shown as logos: keys of ORGS in components/Story.tsx */
  orgs?: ('unicas' | 'lunex')[];
}

export interface Talk {
  id: string;
  /** YYYY-MM-DD, or YYYY-MM when the day is not known */
  date: string;
  title: LocalizedString;
  kind: LocalizedString;
  place: LocalizedString;
  detail: LocalizedString;
  /** First image is the cover */
  images: string[];
  video?: string;
  linkedin?: string;
}

export interface ResearchArea {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface ResearchData {
  title: LocalizedString;
  tagline: LocalizedString;
  areas: ResearchArea[];
}

export interface AppData {
  profile: ProfileData;
  history: TimelineItem[];
  projects: Project[];
  publications: Publication[];
  news: NewsItem[];
  story: StoryItem[];
  talks: Talk[];
  research: ResearchData;
  ui: {
    [key: string]: LocalizedString;
  };
}