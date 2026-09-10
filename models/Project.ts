import mongoose, { Schema, Document } from 'mongoose';

export interface IProject {
  _id?: string;
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
  colSpan: number;
  rowSpan: number;
  challenges: string;
  solution: string;
  keyFeatures: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    role: { type: String, required: true },
    technologies: [{ type: String, trim: true }],
    image: { type: String, required: true },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    colSpan: { type: Number, default: 1, min: 1, max: 3 },
    rowSpan: { type: Number, default: 1, min: 1, max: 2 },
    challenges: { type: String, default: '' },
    solution: { type: String, default: '' },
    keyFeatures: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ published: 1, displayOrder: 1 });
ProjectSchema.index({ featured: 1, displayOrder: 1 });

export const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
