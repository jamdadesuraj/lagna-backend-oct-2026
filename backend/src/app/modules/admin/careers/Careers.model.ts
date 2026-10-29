import { Schema, model } from 'mongoose';
import { ICareers } from './Careers.interface';

const careersSchema = new Schema<ICareers>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },

    images: {
      type: [String],
      default: [],
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

export const Careers = model<ICareers>('Careers', careersSchema);
