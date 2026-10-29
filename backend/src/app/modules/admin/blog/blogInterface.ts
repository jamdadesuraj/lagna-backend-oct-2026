import { Document } from 'mongoose';

export interface IBlog extends Document {
  image: string;
  title: string;
  subtitle: string;
  desc: string;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
