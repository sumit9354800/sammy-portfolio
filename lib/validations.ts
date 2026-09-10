import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters' }).max(200),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }).max(5000),
  website: z.string().max(0, { message: 'Spam detected' }).optional().or(z.literal('')),
});

export const ProjectSchemaZod = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  shortDescription: z.string().min(1, 'Short description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  category: z.string().min(1, 'Category is required'),
  year: z.string().min(1, 'Year is required'),
  role: z.string().min(1, 'Role is required'),
  technologies: z.array(z.string()).default([]),
  image: z.string().min(1, 'Image URL is required'),
  liveUrl: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  displayOrder: z.number().default(0),
  colSpan: z.number().min(1).max(3).optional().default(1),
  rowSpan: z.number().min(1).max(2).optional().default(1),
  challenges: z.string().optional().default(''),
  solution: z.string().optional().default(''),
  keyFeatures: z.array(z.string()).default([]),
});

export const SkillSchemaZod = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['Frontend', 'Backend', 'Database & Tools']),
  displayOrder: z.number().default(0),
  featured: z.boolean().default(false),
  yearsOfExperience: z.string().default('1+'),
  level: z.string().default('Advanced'),
  icon: z.string().optional().default(''),
});

export const ExperienceSchemaZod = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().default('Delhi, India'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().default('Present'),
  currentJob: z.boolean().default(true),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  companyUrl: z.string().optional().default(''),
  displayOrder: z.number().default(0),
});

export const EducationSchemaZod = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endYear: z.string().min(1, 'End year is required'),
  grade: z.string().optional().default(''),
  description: z.string().optional().default(''),
  location: z.string().default('New Delhi, India'),
  displayOrder: z.number().default(0),
});

export const CertificationSchemaZod = z.object({
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  description: z.string().optional().default(''),
  certificateUrl: z.string().optional().default(''),
  image: z.string().optional().default(''),
  isAward: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export const HeroSchemaZod = z.object({
  headlineName: z.string().min(1, 'Headline name is required'),
  rotatingTitles: z.array(z.string()).min(1, 'At least one title is required'),
  availabilityStatus: z.string().default('Available for opportunities'),
  isAvailable: z.boolean().default(true),
  description: z.string().min(1, 'Description is required'),
  primaryCtaText: z.string().default('Explore Work'),
  primaryCtaLink: z.string().default('#projects'),
  secondaryCtaText: z.string().default('Get In Touch'),
  secondaryCtaLink: z.string().default('#contact'),
  locationBadge: z.string().default('Uttam Nagar, Delhi – 110059'),
  hero3DEnabled: z.boolean().default(true),
  hero3DModel: z.string().default('geometric-sculpture'),
  hero3DIntensity: z.number().default(1.0),
});

export const AboutSchemaZod = z.object({
  sectionTag: z.string().default('About Sumit'),
  headline: z.string().min(1, 'Headline is required'),
  introParagraph: z.string().min(1, 'Intro paragraph is required'),
  learningStory: z.string().min(1, 'Learning story is required'),
  achievementsParagraph: z.string().min(1, 'Achievements paragraph is required'),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      subtext: z.string(),
    })
  ),
  highlights: z.array(z.string()),
});

export const SiteSettingsSchemaZod = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  pageTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  keywords: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string().optional().default(''),
  canonicalUrl: z.string().optional().default(''),
});

export const SocialLinksSchemaZod = z.object({
  github: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  email: z.string().optional().default(''),
  twitter: z.string().optional().default(''),
  instagram: z.string().optional().default(''),
});

export const NavigationSchemaZod = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  enabled: z.boolean().default(true),
  displayOrder: z.number().default(0),
});
