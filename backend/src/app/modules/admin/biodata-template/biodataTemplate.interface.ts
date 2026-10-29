import { Document } from 'mongoose';

export enum BiodataTemplateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface IBiodataTemplate extends Document {
  template: string;
  title: string;
  price: number;
  description: string;
  status: BiodataTemplateStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
