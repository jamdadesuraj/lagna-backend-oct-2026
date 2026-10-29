import { Router } from 'express';
import { upload } from '../../../config/cloudinary';
import { createOrUpdateAboutUs, getAboutUs } from './aboutUs.controllers';
import { authenticate } from '../../../middlewares/authMiddleware';

const router = Router();

const uploadAboutUsFiles = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'ceoImage', maxCount: 1 },
  { name: 'aboutImage', maxCount: 1 },
]);

/**
 * @swagger
 * tags:
 *   name: About Us
 *   description: About Us Page Management APIs
 */

/**
 * @swagger
 * /v1/api/admin/about-us:
 *   post:
 *     summary: Create or Update About Us content
 *     tags: [About Us]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               heroBadge: { type: string }
 *               heroTitle: { type: string }
 *               heroHighlightedTitle: { type: string }
 *               heroDescription: { type: string }
 *               heroBadgeText: { type: string }
 *               heroImage: { type: string, format: binary }
 *               ceoSectionTitle: { type: string }
 *               ceoName: { type: string }
 *               ceoDesignation: { type: string }
 *               ceoLetter: { type: string }
 *               ceoImage: { type: string, format: binary }
 *               missionVisionTitle: { type: string }
 *               missionTitle: { type: string }
 *               missionDescription: { type: string }
 *               visionTitle: { type: string }
 *               visionDescription: { type: string }
 *               aboutSectionTitle: { type: string }
 *               aboutDescription: { type: string }
 *               aboutImage: { type: string, format: binary }
 *               stats:
 *                 type: string
 *                 description: JSON stringified array of { value, label }
 *               awardSectionTitle: { type: string }
 *               awards:
 *                 type: string
 *                 description: JSON stringified array of { title, subtitle, year }
 *               howToTitle: { type: string }
 *               steps:
 *                 type: string
 *                 description: JSON stringified array of { title, description }
 *     responses:
 *       200:
 *         description: About Us content saved successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', authenticate, uploadAboutUsFiles, createOrUpdateAboutUs);

/**
 * @swagger
 * /v1/api/admin/about-us:
 *   get:
 *     summary: Get About Us content
 *     tags: [About Us]
 *     responses:
 *       200:
 *         description: About Us content fetched successfully.
 *       404:
 *         description: About Us content not found.
 */
router.get('/', getAboutUs);

export const manageAboutUsRouter = router;
