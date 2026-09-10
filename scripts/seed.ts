import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { About } from '../models/About.js';
import { Hero } from '../models/Hero.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { SocialLinks } from '../models/SocialLinks.js';
import { Navigation } from '../models/Navigation.js';
import { initialPortfolioData } from '../src/data/initialData.js';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is missing in .env');
    process.exit(1);
  }

  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected. Beginning database seed for Sumit Shrivastav portfolio...');

  // 1. Site Settings
  await SiteSettings.deleteMany({});
  await SiteSettings.create(initialPortfolioData.siteSettings);
  console.log('  ✓ SiteSettings seeded');

  // 2. Hero
  await Hero.deleteMany({});
  await Hero.create(initialPortfolioData.hero);
  console.log('  ✓ Hero seeded');

  // 3. About
  await About.deleteMany({});
  await About.create(initialPortfolioData.about);
  console.log('  ✓ About seeded');

  // 4. Social Links
  await SocialLinks.deleteMany({});
  await SocialLinks.create(initialPortfolioData.socialLinks);
  console.log('  ✓ SocialLinks seeded');

  // 5. Navigation
  await Navigation.deleteMany({});
  for (const nav of initialPortfolioData.navigation) {
    const { _id, ...rest } = nav;
    await Navigation.create(rest);
  }
  console.log(`  ✓ Navigation seeded (${initialPortfolioData.navigation.length} items)`);

  // 6. Skills
  await Skill.deleteMany({});
  for (const skill of initialPortfolioData.skills) {
    const { _id, ...rest } = skill;
    await Skill.create(rest);
  }
  console.log(`  ✓ Skills seeded (${initialPortfolioData.skills.length} items)`);

  // 7. Projects
  await Project.deleteMany({});
  for (const proj of initialPortfolioData.projects) {
    const { _id, ...rest } = proj;
    await Project.create(rest);
  }
  console.log(`  ✓ Projects seeded (${initialPortfolioData.projects.length} projects)`);

  // 8. Experience
  await Experience.deleteMany({});
  for (const exp of initialPortfolioData.experience) {
    const { _id, ...rest } = exp;
    await Experience.create(rest);
  }
  console.log(`  ✓ Experience seeded (${initialPortfolioData.experience.length} items)`);

  // 9. Education
  await Education.deleteMany({});
  for (const edu of initialPortfolioData.education) {
    const { _id, ...rest } = edu;
    await Education.create(rest);
  }
  console.log(`  ✓ Education seeded (${initialPortfolioData.education.length} items)`);

  // 10. Certifications
  await Certification.deleteMany({});
  for (const cert of initialPortfolioData.certifications) {
    const { _id, ...rest } = cert;
    await Certification.create(rest);
  }
  console.log(`  ✓ Certifications seeded (${initialPortfolioData.certifications.length} items)`);

  console.log('\n🎉 Seed complete! Database populated with Sumit Shrivastav production portfolio data.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
