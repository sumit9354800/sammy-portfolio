import mongoose, { Schema, Document } from 'mongoose';

export interface IHero extends Document {
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
  updatedAt: Date;
}

const HeroSchema = new Schema<IHero>(
  {
    headlineName: { type: String, required: true },
    rotatingTitles: [{ type: String }],
    availabilityStatus: { type: String, default: 'Available for opportunities' },
    isAvailable: { type: Boolean, default: true },
    description: { type: String, required: true },
    primaryCtaText: { type: String, default: 'Explore Work' },
    primaryCtaLink: { type: String, default: '#projects' },
    secondaryCtaText: { type: String, default: 'Get In Touch' },
    secondaryCtaLink: { type: String, default: '#contact' },
    locationBadge: { type: String, default: 'Uttam Nagar, Delhi – 110059' },
    hero3DEnabled: { type: Boolean, default: true },
    hero3DModel: { type: String, default: 'geometric-sculpture' },
    hero3DIntensity: { type: Number, default: 1.0 },
  },
  {
    timestamps: true,
  }
);

export const Hero =
  mongoose.models.Hero || mongoose.model<IHero>('Hero', HeroSchema);
