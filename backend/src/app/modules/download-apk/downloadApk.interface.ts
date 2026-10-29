import { Document } from 'mongoose';

export interface IDownloadApk {
  title: string;
  subtitle?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  qrCode?: string;
  apkImage?: string;
}

export interface IDownloadApkDocument extends IDownloadApk, Document {
  createdAt: Date;
  updatedAt: Date;
}
