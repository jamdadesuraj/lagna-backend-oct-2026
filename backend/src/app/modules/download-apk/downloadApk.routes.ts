import { Router } from 'express';
import { upload } from '../../config/cloudinary';
import {
  createOrUpdateDownloadApk,
  getDownloadApk,
} from './downloadApk.controllers';
import { authenticate } from '../../middlewares/authMiddleware';

const router = Router();

// Two separate optional files: qrCode and apkImage
const uploadDownloadApkFiles = upload.fields([
  { name: 'qrCode', maxCount: 1 },
  { name: 'apkImage', maxCount: 1 },
]);

/**
 * @swagger
 * tags:
 *   name: Download APK
 *   description: Download APK / App Download Section Management APIs
 */

/**
 * @swagger
 * /v1/api/admin/download-apk:
 *   post:
 *     summary: Create or Update Download APK settings
 *     tags: [Download APK]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Creates the Download APK settings if they do not exist.
 *       If they already exist, updates the existing settings.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Download Our App"
 *               subtitle:
 *                 type: string
 *                 example: "Available on Android and iOS"
 *               googlePlayUrl:
 *                 type: string
 *                 example: "https://play.google.com/store/apps/..."
 *               appStoreUrl:
 *                 type: string
 *                 example: "https://apps.apple.com/..."
 *               qrCode:
 *                 type: string
 *                 format: binary
 *               apkImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Download APK settings saved successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post(
  '/',
  authenticate,
  uploadDownloadApkFiles,
  createOrUpdateDownloadApk,
);

/**
 * @swagger
 * /v1/api/admin/download-apk:
 *   get:
 *     summary: Get Download APK settings
 *     tags: [Download APK]
 *     description: Retrieves the current Download APK settings.
 *     responses:
 *       200:
 *         description: Download APK settings fetched successfully.
 *       404:
 *         description: Download APK settings not found.
 */
router.get('/', getDownloadApk);

export const downloadApkRouter = router;
