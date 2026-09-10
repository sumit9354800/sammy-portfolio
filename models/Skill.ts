import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill {
  _id?: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database & Tools';
  displayOrder: number;
  featured: boolean;
  yearsOfExperience: string;
  level: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Database & Tools'],
    },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    yearsOfExperience: { type: String, default: '1+' },
    level: { type: String, default: 'Advanced' },
    icon: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

SkillSchema.index({ category: 1, displayOrder: 1 });

export const Skill =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
