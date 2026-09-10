import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { connectToDatabase, isDatabaseConnected } from './lib/mongodb.js';
import { initialPortfolioData } from './src/data/initialData.js';
import {
  createToken,
  requireAdminAuth,
  validateAdminCredentials,
  verifyToken,
} from './lib/auth.js';
import {
  ContactFormSchema,
  LoginSchema,
  ProjectSchemaZod,
  SkillSchemaZod,
  ExperienceSchemaZod,
  EducationSchemaZod,
  CertificationSchemaZod,
  HeroSchemaZod,
  AboutSchemaZod,
  SiteSettingsSchemaZod,
  SocialLinksSchemaZod,
} from './lib/validations.js';
import { sendContactNotification } from './lib/resend.js';
import { Project } from './models/Project.js';
import { Skill } from './models/Skill.js';
import { Experience } from './models/Experience.js';
import { Education } from './models/Education.js';
import { Certification } from './models/Certification.js';
import { About } from './models/About.js';
import { Hero } from './models/Hero.js';
import { SiteSettings } from './models/SiteSettings.js';
import { SocialLinks } from './models/SocialLinks.js';
import { Navigation } from './models/Navigation.js';
import { ContactMessage } from './models/ContactMessage.js';
import { ContactMessageItem, PortfolioFullData } from './src/types.js';

// In-memory data store mirror for instant reactivity and graceful fallback
let memoryData: PortfolioFullData = JSON.parse(JSON.stringify(initialPortfolioData));
let memoryMessages: ContactMessageItem[] = [
  {
    _id: 'msg-sample-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@venturecapital.io',
    subject: 'Full Stack Engineering Role Discussion',
    message: 'Hi Sumit, impressed by your MERN stack and 3D portfolio projects. Would love to discuss an engineering role with our team.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];
let lastUpdatedTimestamp = new Date().toISOString();

// Simple IP-based rate limiter for contact form
const contactRateLimits = new Map<string, number[]>();

function getZodErrorMessage(error: any): string {
  if (error?.issues && Array.isArray(error.issues) && error.issues[0]?.message) {
    return error.issues[0].message;
  }
  if (error?.errors && Array.isArray(error.errors) && error.errors[0]?.message) {
    return error.errors[0].message;
  }
  return 'Invalid data format';
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));
  app.use(cookieParser());

  // Security headers (allowing Three.js, inline styles, Google Fonts, and images)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Attempt initial MongoDB connection in the background
  connectToDatabase().then(async (m) => {
    if (m) {
      try {
        // Auto-seed if empty
        const projCount = await Project.countDocuments();
        if (projCount === 0) {
          console.log('[MongoDB] Collections empty, auto-seeding initial data...');
          await Hero.create(initialPortfolioData.hero);
          await SiteSettings.create(initialPortfolioData.siteSettings);
          await SocialLinks.create(initialPortfolioData.socialLinks);
          await About.create(initialPortfolioData.about);
          for (const s of initialPortfolioData.skills) await Skill.create(s);
          for (const p of initialPortfolioData.projects) await Project.create(p);
          for (const e of initialPortfolioData.experience) await Experience.create(e);
          for (const ed of initialPortfolioData.education) await Education.create(ed);
          for (const c of initialPortfolioData.certifications) await Certification.create(c);
          for (const n of initialPortfolioData.navigation) await Navigation.create(n);
          console.log('[MongoDB] Auto-seeding completed.');
        }
      } catch (err: any) {
        console.warn('[MongoDB] Sync warning:', err.message);
      }
    }
  });

  // -------------------------------------------------------------
  // PUBLIC API ROUTES
  // -------------------------------------------------------------

  // Health check & DB status
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      mongodb: isDatabaseConnected() ? 'connected' : 'in-memory-fallback',
      timestamp: new Date().toISOString(),
    });
  });

  // Fetch full portfolio data
  app.get('/api/portfolio', async (_req, res) => {
    if (isDatabaseConnected()) {
      try {
        const [
          heroDoc,
          aboutDoc,
          siteDoc,
          socialDoc,
          navDocs,
          projectDocs,
          skillDocs,
          expDocs,
          eduDocs,
          certDocs,
        ] = await Promise.all([
          Hero.findOne().lean(),
          About.findOne().lean(),
          SiteSettings.findOne().lean(),
          SocialLinks.findOne().lean(),
          Navigation.find().sort({ displayOrder: 1 }).lean(),
          (Project as any).find({ published: true }).sort({ displayOrder: 1 }).lean(),
          Skill.find().sort({ displayOrder: 1 }).lean(),
          Experience.find().sort({ displayOrder: 1 }).lean(),
          Education.find().sort({ displayOrder: 1 }).lean(),
          Certification.find().sort({ displayOrder: 1 }).lean(),
        ]);

        const sortedProjects = [...(projectDocs?.length ? projectDocs : memoryData.projects)].sort(
          (a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
        const baseAbout = aboutDoc || memoryData.about;
        const syncedAbout = syncAboutWithRealProjects(baseAbout, sortedProjects);

        return res.json({
          hero: heroDoc || memoryData.hero,
          about: syncedAbout,
          siteSettings: siteDoc || memoryData.siteSettings,
          socialLinks: socialDoc || memoryData.socialLinks,
          navigation: navDocs?.length ? navDocs : memoryData.navigation,
          projects: sortedProjects,
          skills: skillDocs?.length ? skillDocs : memoryData.skills,
          experience: expDocs?.length ? expDocs : memoryData.experience,
          education: eduDocs?.length ? eduDocs : memoryData.education,
          certifications: certDocs?.length ? certDocs : memoryData.certifications,
          lastUpdated: lastUpdatedTimestamp,
        });
      } catch (err) {
        console.error('[API /api/portfolio error]', err);
      }
    }

    const sortedProjects = [...memoryData.projects].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const syncedAbout = syncAboutWithRealProjects(memoryData.about, sortedProjects);

    res.json({
      ...memoryData,
      about: syncedAbout,
      projects: sortedProjects,
      lastUpdated: lastUpdatedTimestamp,
    });
  });

  // Projects list
  app.get('/api/projects', async (req, res) => {
    const { category, featured, all } = req.query;

    if (isDatabaseConnected()) {
      try {
        const filter: any = {};
        if (all !== 'true') filter.published = true;
        if (category && typeof category === 'string') filter.category = category;
        if (featured === 'true') filter.featured = true;

        const projects = await Project.find(filter).sort({ displayOrder: 1 }).lean();
        return res.json(projects);
      } catch (err) {
        console.error('[API /api/projects error]', err);
      }
    }

    let result = [...memoryData.projects];
    if (all !== 'true') {
      result = result.filter((p) => p.published);
    }
    if (category && typeof category === 'string') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (featured === 'true') {
      result = result.filter((p) => p.featured);
    }
    result.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    res.json(result);
  });

  // Single project by slug or ID
  app.get('/api/projects/:identifier', async (req, res) => {
    const { identifier } = req.params;

    if (isDatabaseConnected()) {
      try {
        let proj = await (Project as any).findOne({ slug: identifier }).lean();
        if (!proj) {
          proj = await (Project as any).findById(identifier).lean();
        }
        if (proj) return res.json(proj);
      } catch (err) {
        console.error('[API /api/projects/:id error]', err);
      }
    }

    const proj = memoryData.projects.find(
      (p) => p.slug === identifier || p._id === identifier
    );
    if (!proj) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(proj);
  });

  // Skills
  app.get('/api/skills', async (_req, res) => {
    if (isDatabaseConnected()) {
      try {
        const skills = await Skill.find().sort({ displayOrder: 1 }).lean();
        return res.json(skills);
      } catch (err) {
        console.error('[API /api/skills error]', err);
      }
    }
    res.json(memoryData.skills);
  });

  // Experience
  app.get('/api/experience', async (_req, res) => {
    if (isDatabaseConnected()) {
      try {
        const items = await Experience.find().sort({ displayOrder: 1 }).lean();
        return res.json(items);
      } catch (err) {
        console.error('[API /api/experience error]', err);
      }
    }
    res.json(memoryData.experience);
  });

  // Education
  app.get('/api/education', async (_req, res) => {
    if (isDatabaseConnected()) {
      try {
        const items = await Education.find().sort({ displayOrder: 1 }).lean();
        return res.json(items);
      } catch (err) {
        console.error('[API /api/education error]', err);
      }
    }
    res.json(memoryData.education);
  });

  // Certifications
  app.get('/api/certifications', async (_req, res) => {
    if (isDatabaseConnected()) {
      try {
        const items = await Certification.find().sort({ displayOrder: 1 }).lean();
        return res.json(items);
      } catch (err) {
        console.error('[API /api/certifications error]', err);
      }
    }
    res.json(memoryData.certifications);
  });

  // Contact form submission with Zod validation, honeypot & Resend dispatch
  app.post('/api/contact', async (req, res) => {
    try {
      // 1. IP rate limiting (max 5 requests per 10 minutes)
      const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const now = Date.now();
      const userRequests = contactRateLimits.get(ip) || [];
      const windowRequests = userRequests.filter((t) => now - t < 10 * 60 * 1000);

      if (windowRequests.length >= 5) {
        return res.status(429).json({
          error: 'Rate limit exceeded. Please wait a few minutes before sending another inquiry.',
        });
      }
      contactRateLimits.set(ip, [...windowRequests, now]);

      // 2. Validate input schema & honeypot
      const parseResult = ContactFormSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: getZodErrorMessage(parseResult.error) || 'Invalid input data',
        });
      }

      const { name, email, subject, message, website } = parseResult.data;

      // 3. Honeypot check
      if (website && website.trim() !== '') {
        return res.status(400).json({ error: 'Spam submission detected.' });
      }

      // 4. Record to Database / Memory
      const newMsg: ContactMessageItem = {
        _id: `msg-${Date.now()}`,
        name,
        email,
        subject,
        message,
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      if (isDatabaseConnected()) {
        try {
          const doc = await ContactMessage.create({
            name,
            email,
            subject,
            message,
            status: 'new',
          });
          newMsg._id = doc._id.toString();
        } catch (dbErr) {
          console.warn('[Contact DB save warning]', dbErr);
        }
      }

      memoryMessages.unshift(newMsg);

      // 5. Send notification via Resend service
      const emailResult = await sendContactNotification({ name, email, subject, message });

      res.status(201).json({
        success: true,
        message: 'Message sent successfully. Thank you for reaching out!',
        deliveryMode: emailResult.mode,
      });
    } catch (err: any) {
      console.error('[API /api/contact error]', err);
      res.status(500).json({
        error: 'Something went wrong while transmitting your message. Please try again.',
      });
    }
  });

  // -------------------------------------------------------------
  // AUTHENTICATION ROUTES
  // -------------------------------------------------------------

  app.post('/api/auth/login', (req, res) => {
    const parse = LoginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid email or password format.' });
    }

    const { email, password } = parse.data;
    if (!validateAdminCredentials(email, password)) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const token = createToken(email);

    // Set secure HTTP-only cookie
    res.cookie('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        email,
        role: 'admin',
        name: 'Sumit Shrivastav',
      },
    });
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie('admin_session');
    res.json({ success: true, message: 'Logged out successfully' });
  });

  app.get('/api/auth/me', (req, res) => {
    const token =
      req.cookies?.admin_session ||
      req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return res.json({ authenticated: false });
    }

    const session = verifyToken(token);
    if (!session) {
      return res.json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user: {
        email: session.email,
        role: session.role,
        name: 'Sumit Shrivastav',
      },
    });
  });

  // -------------------------------------------------------------
  // PROTECTED ADMIN CMS ROUTES
  // -------------------------------------------------------------

  // Admin stats
  app.get('/api/admin/stats', requireAdminAuth, async (_req, res) => {
    let totalProjects = memoryData.projects.length;
    let publishedProjects = memoryData.projects.filter((p) => p.published).length;
    let featuredProjects = memoryData.projects.filter((p) => p.featured).length;
    let totalSkills = memoryData.skills.length;
    let totalExperience = memoryData.experience.length;
    let totalEducation = memoryData.education.length;
    let totalCertifications = memoryData.certifications.length;
    let unreadMessages = memoryMessages.filter((m) => m.status === 'new').length;

    if (isDatabaseConnected()) {
      try {
        [
          totalProjects,
          publishedProjects,
          featuredProjects,
          totalSkills,
          totalExperience,
          totalEducation,
          totalCertifications,
          unreadMessages,
        ] = await Promise.all([
          Project.countDocuments(),
          Project.countDocuments({ published: true }),
          Project.countDocuments({ featured: true }),
          Skill.countDocuments(),
          Experience.countDocuments(),
          Education.countDocuments(),
          Certification.countDocuments(),
          ContactMessage.countDocuments({ status: 'new' }),
        ]);
      } catch (err) {
        console.warn('[Admin stats DB query warning]', err);
      }
    }

    res.json({
      totalProjects,
      publishedProjects,
      featuredProjects,
      totalSkills,
      totalExperience,
      totalEducation,
      totalCertifications,
      unreadMessages,
      lastUpdated: lastUpdatedTimestamp,
    });
  });

  // Admin: Project CRUD
  app.post('/api/admin/projects', requireAdminAuth, async (req, res) => {
    const parsed = ProjectSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: getZodErrorMessage(parsed.error) });
    }

    const projectData = parsed.data;
    const newId = `proj-${Date.now()}`;
    const newProject = {
      _id: newId,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDatabaseConnected()) {
      try {
        const doc = await Project.create(projectData);
        newProject._id = doc._id.toString();
      } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Failed to save project' });
      }
    }

    memoryData.projects.push(newProject as any);
    lastUpdatedTimestamp = new Date().toISOString();

    res.status(201).json({ success: true, project: newProject });
  });

  app.put('/api/admin/projects/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const parsed = ProjectSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: getZodErrorMessage(parsed.error) });
    }

    if (isDatabaseConnected()) {
      try {
        await (Project as any).findByIdAndUpdate(id, parsed.data, { new: true });
      } catch (err: any) {
        console.warn('[Project update DB warning]', err);
      }
    }

    const idx = memoryData.projects.findIndex((p) => p._id === id);
    if (idx !== -1) {
      memoryData.projects[idx] = {
        ...memoryData.projects[idx],
        ...parsed.data,
        updatedAt: new Date().toISOString(),
      };
    }
    lastUpdatedTimestamp = new Date().toISOString();

    res.json({ success: true, message: 'Project saved successfully' });
  });

  app.delete('/api/admin/projects/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;

    if (isDatabaseConnected()) {
      try {
        await (Project as any).findByIdAndDelete(id);
      } catch (err) {
        console.warn('[Project delete DB warning]', err);
      }
    }

    memoryData.projects = memoryData.projects.filter((p) => p._id !== id);
    lastUpdatedTimestamp = new Date().toISOString();

    res.json({ success: true, message: 'Project deleted successfully' });
  });

  // Admin: Skills CRUD
  app.post('/api/admin/skills', requireAdminAuth, async (req, res) => {
    const parsed = SkillSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: getZodErrorMessage(parsed.error) });
    }

    const newSkill = {
      _id: `sk-${Date.now()}`,
      ...parsed.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDatabaseConnected()) {
      try {
        const doc = await Skill.create(parsed.data);
        newSkill._id = doc._id.toString();
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    memoryData.skills.push(newSkill as any);
    lastUpdatedTimestamp = new Date().toISOString();
    res.status(201).json({ success: true, skill: newSkill });
  });

  app.put('/api/admin/skills/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const parsed = SkillSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: getZodErrorMessage(parsed.error) });
    }

    if (isDatabaseConnected()) {
      try {
        await (Skill as any).findByIdAndUpdate(id, parsed.data, { new: true });
      } catch (err) {
        console.warn('[Skill update warning]', err);
      }
    }

    const idx = memoryData.skills.findIndex((s) => s._id === id);
    if (idx !== -1) {
      memoryData.skills[idx] = {
        ...memoryData.skills[idx],
        ...parsed.data,
        updatedAt: new Date().toISOString(),
      };
    }
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true, message: 'Skill updated successfully' });
  });

  app.delete('/api/admin/skills/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    if (isDatabaseConnected()) {
      try {
        await (Skill as any).findByIdAndDelete(id);
      } catch (err) {
        console.warn('[Skill delete warning]', err);
      }
    }

    memoryData.skills = memoryData.skills.filter((s) => s._id !== id);
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true, message: 'Skill deleted' });
  });

  // Admin: Experience CRUD
  app.post('/api/admin/experience', requireAdminAuth, async (req, res) => {
    const parsed = ExperienceSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    const newExp = {
      _id: `exp-${Date.now()}`,
      ...parsed.data,
      createdAt: new Date().toISOString(),
    };

    if (isDatabaseConnected()) {
      try {
        const doc = await Experience.create(parsed.data);
        newExp._id = doc._id.toString();
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    memoryData.experience.push(newExp as any);
    lastUpdatedTimestamp = new Date().toISOString();
    res.status(201).json({ success: true, experience: newExp });
  });

  app.put('/api/admin/experience/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const parsed = ExperienceSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    if (isDatabaseConnected()) {
      try {
        await (Experience as any).findByIdAndUpdate(id, parsed.data);
      } catch (err) {
        console.warn('[Exp update warning]', err);
      }
    }

    const idx = memoryData.experience.findIndex((e) => e._id === id);
    if (idx !== -1) {
      memoryData.experience[idx] = { ...memoryData.experience[idx], ...parsed.data };
    }
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true });
  });

  app.delete('/api/admin/experience/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    if (isDatabaseConnected()) {
      try {
        await (Experience as any).findByIdAndDelete(id);
      } catch (err) {
        console.warn('[Exp delete warning]', err);
      }
    }
    memoryData.experience = memoryData.experience.filter((e) => e._id !== id);
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true });
  });

  // Admin: Education CRUD
  app.post('/api/admin/education', requireAdminAuth, async (req, res) => {
    const parsed = EducationSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    const newEdu = { _id: `edu-${Date.now()}`, ...parsed.data };
    if (isDatabaseConnected()) {
      try {
        const doc = await Education.create(parsed.data);
        newEdu._id = doc._id.toString();
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    memoryData.education.push(newEdu as any);
    lastUpdatedTimestamp = new Date().toISOString();
    res.status(201).json({ success: true, education: newEdu });
  });

  app.put('/api/admin/education/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const parsed = EducationSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    if (isDatabaseConnected()) {
      try {
        await (Education as any).findByIdAndUpdate(id, parsed.data);
      } catch (err) {
        console.warn('[Edu update warning]', err);
      }
    }

    const idx = memoryData.education.findIndex((e) => e._id === id);
    if (idx !== -1) memoryData.education[idx] = { ...memoryData.education[idx], ...parsed.data };
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true });
  });

  app.delete('/api/admin/education/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    if (isDatabaseConnected()) {
      try {
        await (Education as any).findByIdAndDelete(id);
      } catch (err) {
        console.warn('[Edu delete warning]', err);
      }
    }
    memoryData.education = memoryData.education.filter((e) => e._id !== id);
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true });
  });

  // Admin: Certifications CRUD
  app.post('/api/admin/certifications', requireAdminAuth, async (req, res) => {
    const parsed = CertificationSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    const newCert = { _id: `cert-${Date.now()}`, ...parsed.data };
    if (isDatabaseConnected()) {
      try {
        const doc = await Certification.create(parsed.data);
        newCert._id = doc._id.toString();
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    memoryData.certifications.push(newCert as any);
    lastUpdatedTimestamp = new Date().toISOString();
    res.status(201).json({ success: true, certification: newCert });
  });

  app.put('/api/admin/certifications/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const parsed = CertificationSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    if (isDatabaseConnected()) {
      try {
        await (Certification as any).findByIdAndUpdate(id, parsed.data);
      } catch (err) {
        console.warn('[Cert update warning]', err);
      }
    }

    const idx = memoryData.certifications.findIndex((c) => c._id === id);
    if (idx !== -1) memoryData.certifications[idx] = { ...memoryData.certifications[idx], ...parsed.data };
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true });
  });

  app.delete('/api/admin/certifications/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    if (isDatabaseConnected()) {
      try {
        await (Certification as any).findByIdAndDelete(id);
      } catch (err) {
        console.warn('[Cert delete warning]', err);
      }
    }
    memoryData.certifications = memoryData.certifications.filter((c) => c._id !== id);
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true });
  });

  // Admin: Hero update
  app.put('/api/admin/hero', requireAdminAuth, async (req, res) => {
    const parsed = HeroSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    if (isDatabaseConnected()) {
      try {
        await (Hero as any).findOneAndUpdate({}, parsed.data, { upsert: true });
      } catch (err) {
        console.warn('[Hero update warning]', err);
      }
    }

    memoryData.hero = { ...memoryData.hero, ...parsed.data };
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true, hero: memoryData.hero });
  });

  // Admin: About update
  app.put('/api/admin/about', requireAdminAuth, async (req, res) => {
    const parsed = AboutSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    if (isDatabaseConnected()) {
      try {
        await (About as any).findOneAndUpdate({}, parsed.data, { upsert: true });
      } catch (err) {
        console.warn('[About update warning]', err);
      }
    }

    memoryData.about = { ...memoryData.about, ...parsed.data };
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true, about: memoryData.about });
  });

  // Admin: Site Settings update
  app.put('/api/admin/site', requireAdminAuth, async (req, res) => {
    const parsed = SiteSettingsSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    if (isDatabaseConnected()) {
      try {
        await (SiteSettings as any).findOneAndUpdate({}, parsed.data, { upsert: true });
      } catch (err) {
        console.warn('[SiteSettings update warning]', err);
      }
    }

    memoryData.siteSettings = { ...memoryData.siteSettings, ...parsed.data };
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true, siteSettings: memoryData.siteSettings });
  });

  // Admin: Social Links update
  app.put('/api/admin/social', requireAdminAuth, async (req, res) => {
    const parsed = SocialLinksSchemaZod.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: getZodErrorMessage(parsed.error) });

    if (isDatabaseConnected()) {
      try {
        await (SocialLinks as any).findOneAndUpdate({}, parsed.data, { upsert: true });
      } catch (err) {
        console.warn('[Social update warning]', err);
      }
    }

    memoryData.socialLinks = { ...memoryData.socialLinks, ...parsed.data };
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true, socialLinks: memoryData.socialLinks });
  });

  // Admin: Navigation
  app.put('/api/admin/navigation', requireAdminAuth, async (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Array required' });

    if (isDatabaseConnected()) {
      try {
        await Navigation.deleteMany({});
        for (const item of items) {
          const { _id, ...rest } = item;
          await Navigation.create(rest);
        }
      } catch (err) {
        console.warn('[Nav update warning]', err);
      }
    }

    memoryData.navigation = items;
    lastUpdatedTimestamp = new Date().toISOString();
    res.json({ success: true, navigation: items });
  });

  // Admin: Messages (Contact inquiries management)
  app.get('/api/admin/messages', requireAdminAuth, async (_req, res) => {
    if (isDatabaseConnected()) {
      try {
        const msgs = await ContactMessage.find().sort({ createdAt: -1 }).lean();
        return res.json(msgs);
      } catch (err) {
        console.warn('[Messages query warning]', err);
      }
    }
    res.json(memoryMessages);
  });

  app.patch('/api/admin/messages/:id/status', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (isDatabaseConnected()) {
      try {
        await (ContactMessage as any).findByIdAndUpdate(id, { status });
      } catch (err) {
        console.warn('[Message status DB warning]', err);
      }
    }

    const idx = memoryMessages.findIndex((m) => m._id === id);
    if (idx !== -1) {
      memoryMessages[idx].status = status;
    }
    res.json({ success: true, status });
  });

  app.delete('/api/admin/messages/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    if (isDatabaseConnected()) {
      try {
        await (ContactMessage as any).findByIdAndDelete(id);
      } catch (err) {
        console.warn('[Message delete DB warning]', err);
      }
    }

    memoryMessages = memoryMessages.filter((m) => m._id !== id);
    res.json({ success: true, message: 'Message deleted' });
  });

  // -------------------------------------------------------------
  // VITE / STATIC FILE SERVING
  // -------------------------------------------------------------

function syncAboutWithRealProjects(about: any, projects: any[]) {
  if (!about || !about.stats || !Array.isArray(about.stats)) return about;
  const publishedCount = projects.filter((p: any) => p.published).length;
  const count = publishedCount > 0 ? publishedCount : projects.length;
  if (count <= 0) return about;

  const stats = about.stats.map((stat: any) => {
    if (
      stat.label?.toLowerCase().includes('project') ||
      stat.subtext?.toLowerCase().includes('shipped') ||
      stat.label?.toLowerCase().includes('production')
    ) {
      return {
        ...stat,
        value: `${count}+`,
        subtext: `${count} shipped & live`,
      };
    }
    return stat;
  });

  return {
    ...about,
    stats,
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] Sumit Shrivastav Portfolio & CMS running on http://0.0.0.0:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
