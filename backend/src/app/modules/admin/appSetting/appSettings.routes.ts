import { Router } from 'express';
import { upload } from '../../../config/cloudinary';
import { getAppSettings, updateAppSettings } from './appSettings.controllers';
import { authenticate } from '../../../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: App Settings (Admin)
 *   description: Application-wide settings — contact details, store links, footer and social profiles.
 */

/**
 * @swagger
 * /v1/api/admin/app-settings:
 *   get:
 *     summary: Get current app settings
 *     tags: [App Settings (Admin)]
 *     responses:
 *       200:
 *         description: Fetched successfully.
 */
router.get('/', getAppSettings);

/**
 * @swagger
 * /v1/api/admin/app-settings:
 *   put:
 *     summary: Update app settings
 *     tags: [App Settings (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - appName
 *             properties:
 *               appName:
 *                 type: string
 *               mobileNo:
 *                 type: string
 *               whatsappNo:
 *                 type: string
 *               supportEmail:
 *                 type: string
 *               businessEmail:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *               address:
 *                 type: string
 *               googlePlayUrl:
 *                 type: string
 *               appStoreUrl:
 *                 type: string
 *               supportHours:
 *                 type: string
 *               copyrightText:
 *                 type: string
 *               facebookUrl:
 *                 type: string
 *               instagramUrl:
 *                 type: string
 *               youtubeUrl:
 *                 type: string
 *               linkedinUrl:
 *                 type: string
 *               appLogo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated successfully.
 *       400:
 *         description: Validation error.
 */
router.put('/', authenticate, upload.single('appLogo'), updateAppSettings);

export const appSettingsRouter = router;
