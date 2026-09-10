export interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  year: string;
  role: string;
  technologies: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  colSpan?: number; // 1 (default), 2 (wide), 3 (full width)
  rowSpan?: number; // 1 (default), 2 (tall)
  challenges: string;
  solution: string;
  keyFeatures: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Database & Tools';

export interface SkillItem {
  _id: string;
  name: string;
  category: SkillCategory;
  displayOrder: number;
  featured: boolean;
  yearsOfExperience: string;
  level: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceItem {
  _id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  currentJob: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  companyUrl?: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationItem {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description: string;
  location: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationItem {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  description: string;
  certificateUrl?: string;
  image?: string;
  isAward: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutStat {
  label: string;
  value: string;
  subtext: string;
}

export interface AboutData {
  _id?: string;
  sectionTag: string;
  headline: string;
  introParagraph: string;
  learningStory: string;
  achievementsParagraph: string;
  stats: AboutStat[];
  highlights: string[];
  updatedAt?: string;
}

export interface HeroData {
  _id?: string;
  headlineName: string;
  rotatingTitles: string[];
  availabilityStatus: string;
  isAvailable: boolean;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  locationBadge: string;
  hero3DEnabled: boolean;
  hero3DModel: string;
  hero3DIntensity: number;
}

export interface SiteSettingsData {
  _id?: string;
  name: string;
  title: string;
  author: string;
  email: string;
  phone: string;
  location: string;
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface SocialLinksData {
  _id?: string;
  github: string;
  linkedin: string;
  email: string;
  twitter?: string;
  instagram?: string;
}

export interface NavigationItem {
  _id: string;
  label: string;
  href: string;
  enabled: boolean;
  displayOrder: number;
}

export interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface PortfolioFullData {
  hero: HeroData;
  about: AboutData;
  siteSettings: SiteSettingsData;
  socialLinks: SocialLinksData;
  navigation: NavigationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}
