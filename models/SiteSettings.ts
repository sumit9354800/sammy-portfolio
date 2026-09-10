import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
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
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    name: { type: String, default: 'Sumit Shrivastav' },
    title: { type: String, default: 'Full Stack Developer' },
    author: { type: String, default: 'Sumit Shrivastav' },
    email: { type: String, default: 'sumit9354800@gmail.com' },
    phone: { type: String, default: '+91 9354800375' },
    location: { type: String, default: 'Uttam Nagar, Delhi – 110059' },
    pageTitle: { type: String, default: 'Sumit Shrivastav — Full Stack Developer & MERN Engineer' },
    metaDescription: {
      type: String,
      default: 'Production-ready portfolio of Sumit Shrivastav, building fast, clean web apps from database to deployment.',
    },
    keywords: { type: String, default: 'Full Stack Developer, MERN, React, Next.js, Node.js, MongoDB' },
    ogTitle: { type: String, default: 'Sumit Shrivastav — Full Stack Developer' },
    ogDescription: { type: String, default: 'Self-taught MERN stack developer building fast, clean web applications.' },
    ogImage: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
