import { Router } from 'express';
import {
  getSpotlightSettings,
  updateSpotlightSettings,
} from './spotlightSettings.controllers';
import { authenticate } from '../../../middlewares/authMiddleware';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Spotlight Settings (Admin)
 *   description: Admin-configurable amount charged to spotlight a profile for 24 hours.
 */
/**
 * @swagger
 * /v1/api/admin/spotlight-settings:
 *   get:
 *     summary: Get current spotlight amount
 *     tags: [Spotlight Settings (Admin)]
 *     responses:
 *       200:
 *         description: Fetched successfully.
 */
router.get('/', getSpotlightSettings);
/**
 * @swagger
 * /v1/api/admin/spotlight-settings:
 *   put:
 *     summary: Update spotlight amount
 *     tags: [Spotlight Settings (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 99
 *     responses:
 *       200:
 *         description: Updated successfully.
 *       400:
 *         description: Validation error.
 */
router.put('/', authenticate, updateSpotlightSettings);

export const spotlightSettingsRouter = router;
