import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  description: string;
  certificateUrl?: string;
  image?: string;
  isAward: boolean;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, required: true },
    description: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
    image: { type: String, default: '' },
    isAward: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

CertificationSchema.index({ isAward: 1, displayOrder: 1 });

export const Certification =
  mongoose.models.Certification ||
  mongoose.model<ICertification>('Certification', CertificationSchema);
