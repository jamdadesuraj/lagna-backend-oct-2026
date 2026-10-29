import { NextFunction, Request, Response, Router } from 'express';
import { upload } from '../../../config/cloudinary';
import { authenticate } from '../../../middlewares/authMiddleware';
import { UserRole } from '../../auth/auth.interface';
import {
  createBiodataTemplate,
  getBiodataTemplates,
  getActiveBiodataTemplates,
  getBiodataTemplateById,
  updateBiodataTemplate,
  updateBiodataTemplateStatus,
  deleteBiodataTemplate,
} from './biodataTemplate.controller';

const router = Router();

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin access required.',
    });
  }

  next();
};

/**
 * @swagger
 * tags:
 *   name: Biodata Template
 *   description: Biodata Template Management APIs (Admin CRUD, public read)
 */

/**
 * @swagger
 * /v1/api/admin/biodata-templates:
 *   post:
 *     summary: Create Biodata Template (Admin only)
 *     tags: [Biodata Template]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - template
 *               - title
 *               - price
 *               - description
 *             properties:
 *               template:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Classic Elegant Template
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 199
 *                 description: Price in rupees. Use 0 for a free template.
 *               description:
 *                 type: string
 *                 example: A clean, elegant biodata template suitable for all religions.
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       201:
 *         description: Biodata template created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('template'),
  createBiodataTemplate,
);

/**
 * @swagger
 * /v1/api/admin/biodata-templates:
 *   get:
 *     summary: Get All Biodata Templates (Public read - no auth required)
 *     tags: [Biodata Template]
 *     description: Anyone (admin or regular frontend user) can read the list. Pass ?status=active for the frontend to show only published templates.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: Elegant
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         example: active
 *     responses:
 *       200:
 *         description: Biodata templates fetched successfully.
 */
router.get('/', getBiodataTemplates);

/**
 * @swagger
 * /v1/api/admin/biodata-templates/active:
 *   get:
 *     summary: Get Active Biodata Templates (Public read - no auth required)
 *     tags: [Biodata Template]
 *     description: Returns every active, non-deleted template (including price), newest first, without pagination. Intended for the member app.
 *     responses:
 *       200:
 *         description: Biodata templates fetched successfully.
 */
router.get('/active', getActiveBiodataTemplates);

/**
 * @swagger
 * /v1/api/admin/biodata-templates/{id}:
 *   get:
 *     summary: Get Biodata Template By ID (Public read - no auth required)
 *     tags: [Biodata Template]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 686d0d858123456789abcd12
 *     responses:
 *       200:
 *         description: Biodata template fetched successfully.
 *       404:
 *         description: Biodata template not found.
 */
router.get('/:id', getBiodataTemplateById);

/**
 * @swagger
 * /v1/api/admin/biodata-templates/{id}:
 *   put:
 *     summary: Update Biodata Template (Admin only)
 *     tags: [Biodata Template]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 686d0d858123456789abcd12
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               template:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Classic Elegant Template
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 199
 *                 description: Price in rupees. Use 0 for a free template.
 *               description:
 *                 type: string
 *                 example: Updated description text.
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Biodata template updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Biodata template not found.
 */
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  upload.single('template'),
  updateBiodataTemplate,
);

/**
 * @swagger
 * /v1/api/admin/biodata-templates/{id}/status:
 *   patch:
 *     summary: Update Biodata Template Status (Admin only)
 *     tags: [Biodata Template]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 686d0d858123456789abcd12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Biodata template status updated successfully.
 *       400:
 *         description: Invalid status.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Biodata template not found.
 */
router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  updateBiodataTemplateStatus,
);

/**
 * @swagger
 * /v1/api/admin/biodata-templates/{id}:
 *   delete:
 *     summary: Delete Biodata Template (Admin only)
 *     tags: [Biodata Template]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 686d0d858123456789abcd12
 *     responses:
 *       200:
 *         description: Biodata template deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Biodata template not found.
 */
router.delete('/:id', authenticate, requireAdmin, deleteBiodataTemplate);

export const biodataTemplateRouter = router;
