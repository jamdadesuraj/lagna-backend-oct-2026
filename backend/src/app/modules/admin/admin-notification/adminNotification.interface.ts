import { Document, Types } from 'mongoose';

export enum AdminNotificationType {
  PROFILE_VERIFICATION = 'PROFILE_VERIFICATION',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  REPORT_PROFILE = 'REPORT_PROFILE',
}

export interface IAdminNotification extends Document {
  type: AdminNotificationType;
  title: string;
  message: string;

  // Member the notification is about (used for navigation in the admin panel)
  profileId?: Types.ObjectId;

  // The related record: verification, payment or report id
  referenceId?: Types.ObjectId;

  // Extra display info, e.g. { paymentType, amount, matrimonyId, memberName }
  meta?: Record<string, unknown>;

  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdminNotificationInput {
  type: AdminNotificationType;
  title: string;
  message: string;
  profileId?: Types.ObjectId | string;
  referenceId?: Types.ObjectId | string;
  meta?: Record<string, unknown>;
}
