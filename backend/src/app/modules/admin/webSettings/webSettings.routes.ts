import { Router } from 'express';
import { upload } from '../../../config/cloudinary';
import { getWebSettings, updateWebSettings } from './webSettings.controllers';
import { authenticate } from '../../../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Web Settings (Admin)
 *   description: Website-wide settings — branding, contact details, SEO, social links and footer.
 */

/**
 * @swagger
 * /v1/api/admin/web-settings:
 *   get:
 *     summary: Get current website settings
 *     tags: [Web Settings (Admin)]
 *     responses:
 *       200:
 *         description: Fetched successfully.
 */
router.get('/', getWebSettings);

/**
 * @swagger
 * /v1/api/admin/web-settings:
 *   put:
 *     summary: Update website settings
 *     tags: [Web Settings (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - websiteName
 *             properties:
 *               websiteName:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *               tagline:
 *                 type: string
 *               mobileNo:
 *                 type: string
 *               whatsappNo:
 *                 type: string
 *               supportEmail:
 *                 type: string
 *               businessEmail:
 *                 type: string
 *               address:
 *                 type: string
 *               supportHours:
 *                 type: string
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               metaKeywords:
 *                 type: string
 *               facebookUrl:
 *                 type: string
 *               instagramUrl:
 *                 type: string
 *               youtubeUrl:
 *                 type: string
 *               linkedinUrl:
 *                 type: string
 *               twitterUrl:
 *                 type: string
 *               copyrightText:
 *                 type: string
 *               footerDescription:
 *                 type: string
 *               maintenanceMode:
 *                 type: boolean
 *               logo:
 *                 type: string
 *                 format: binary
 *               favicon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated successfully.
 *       400:
 *         description: Validation error.
 */
router.put(
  '/',
  authenticate,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  updateWebSettings,
);

export const webSettingsRouter = router;
