import { Schema, model } from 'mongoose';
import { IBlog } from './blogInterface';

const blogSchema = new Schema<IBlog>(
  {
    image: {
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

    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    isActive: {
      type: Boolean,
      default: true,
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

export const Blog = model<IBlog>('Blog', blogSchema);
