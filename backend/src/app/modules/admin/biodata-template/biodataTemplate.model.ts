import { Schema, model } from 'mongoose';
import {
  IBiodataTemplate,
  BiodataTemplateStatus,
} from './biodataTemplate.interface';

const biodataTemplateSchema = new Schema<IBiodataTemplate>(
  {
    template: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: Object.values(BiodataTemplateStatus),
      default: BiodataTemplateStatus.ACTIVE,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const BiodataTemplate = model<IBiodataTemplate>(
  'BiodataTemplate',
  biodataTemplateSchema,
);
