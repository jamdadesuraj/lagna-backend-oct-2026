import mongoose, { Schema } from 'mongoose';
import { IDownloadApkDocument } from './downloadApk.interface';

const downloadApkSchema = new Schema<IDownloadApkDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    googlePlayUrl: {
      type: String,
      trim: true,
    },
    appStoreUrl: {
      type: String,
      trim: true,
    },
    qrCode: {
      type: String,
      trim: true,
    },
    apkImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const DownloadApk = mongoose.model<IDownloadApkDocument>(
  'DownloadApk',
  downloadApkSchema,
);
