import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description: string;
  location: string;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, required: true, trim: true },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
    grade: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: 'New Delhi, India' },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

EducationSchema.index({ displayOrder: 1 });

export const Education =
  mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);
