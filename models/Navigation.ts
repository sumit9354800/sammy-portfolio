import mongoose, { Schema, Document } from 'mongoose';

export interface INavigation {
  _id?: string;
  label: string;
  href: string;
  enabled: boolean;
  displayOrder: number;
}

const NavigationSchema = new Schema<INavigation>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    label: { type: String, required: true },
    href: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

NavigationSchema.index({ displayOrder: 1 });

export const Navigation =
  mongoose.models.Navigation || mongoose.model<INavigation>('Navigation', NavigationSchema);
