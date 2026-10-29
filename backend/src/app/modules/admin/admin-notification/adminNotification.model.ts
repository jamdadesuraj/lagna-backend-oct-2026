import { Schema, model } from 'mongoose';
import {
  AdminNotificationType,
  IAdminNotification,
} from './adminNotification.interface';

// Notifications older than this are deleted automatically by MongoDB
const NOTIFICATION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

const adminNotificationSchema = new Schema<IAdminNotification>(
  {
    type: {
      type: String,
      enum: Object.values(AdminNotificationType),
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },

    referenceId: {
      type: Schema.Types.ObjectId,
    },

    meta: {
      type: Schema.Types.Mixed,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

adminNotificationSchema.index({ createdAt: -1 });

adminNotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: NOTIFICATION_TTL_SECONDS },
);

export const AdminNotification = model<IAdminNotification>(
  'AdminNotification',
  adminNotificationSchema,
);
