import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLinks extends Document {
  github: string;
  linkedin: string;
  email: string;
  twitter?: string;
  instagram?: string;
  updatedAt: Date;
}

const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    github: { type: String, default: 'https://github.com/sumit9354800' },
    linkedin: { type: String, default: 'https://linkedin.com/in/sumit-srivastav-6636ab379' },
    email: { type: String, default: 'sumit9354800@gmail.com' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const SocialLinks =
  mongoose.models.SocialLinks || mongoose.model<ISocialLinks>('SocialLinks', SocialLinksSchema);
