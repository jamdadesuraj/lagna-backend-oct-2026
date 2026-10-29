import { Router } from 'express';
import { upload } from '../../../config/cloudinary';
import {
  createOrUpdateCareers,
  getCareers,
  removeCareerImage,
  deleteCareers,
} from './Careers.controllers';
import { authenticate } from '../../../middlewares/authMiddleware';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Careers
 *   description: Careers Page Management APIs
 */

/**
 * @swagger
 * /v1/api/admin/careers:
 *   put:
 *     summary: Create or Update Careers Page
 *     description: Creates the Careers page if it does not exist, otherwise updates it. Newly uploaded images are appended to the existing gallery.
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
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
 *                 example: "Join Our Team"
 *               subtitle:
 *                 type: string
 *                 example: "Explore career opportunities with us"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Careers page saved successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.put(
  '/',
  authenticate,
  upload.array('images', 20),
  createOrUpdateCareers,
);

/**
 * @swagger
 * /v1/api/admin/careers:
 *   get:
 *     summary: Get Careers Page
 *     tags: [Careers]
 *     responses:
 *       200:
 *         description: Careers page fetched successfully.
 *       404:
 *         description: Careers page not found.
 */
router.get('/', getCareers);

/**
 * @swagger
 * /v1/api/admin/careers/image:
 *   delete:
 *     summary: Remove a single image from the Careers gallery
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 example: "https://res.cloudinary.com/.../careers/abc123.jpg"
 *     responses:
 *       200:
 *         description: Image removed successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Careers page not found.
 */
router.delete('/image', authenticate, removeCareerImage);

/**
 * @swagger
 * /v1/api/admin/careers:
 *   delete:
 *     summary: Delete Careers Page
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Careers page deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Careers page not found.
 */
router.delete('/', authenticate, deleteCareers);

export const careersRouter = router;
