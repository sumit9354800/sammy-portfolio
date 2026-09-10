import mongoose, { Schema, Document } from 'mongoose';

export interface IAbout extends Document {
  sectionTag: string;
  headline: string;
  introParagraph: string;
  learningStory: string;
  achievementsParagraph: string;
  stats: { label: string; value: string; subtext: string }[];
  highlights: string[];
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    sectionTag: { type: String, default: 'About Sumit' },
    headline: { type: String, required: true },
    introParagraph: { type: String, required: true },
    learningStory: { type: String, required: true },
    achievementsParagraph: { type: String, required: true },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        subtext: { type: String, default: '' },
      },
    ],
    highlights: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const About =
  mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);
