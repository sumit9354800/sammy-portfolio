import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: 'Delhi, India' },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    currentJob: { type: Boolean, default: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    companyUrl: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ExperienceSchema.index({ displayOrder: 1 });

export const Experience =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
