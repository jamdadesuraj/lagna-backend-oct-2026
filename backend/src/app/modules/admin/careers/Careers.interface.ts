import { Document } from 'mongoose';

export interface ICareers extends Document {
  title: string;
  subtitle: string;

  images: string[];

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
