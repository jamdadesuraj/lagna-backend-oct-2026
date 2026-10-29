import { Router } from 'express';
import { upload } from '../../../config/cloudinary';
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} from './blogControllers';
import { authenticate } from '../../../middlewares/authMiddleware';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog Management APIs
 */

/**
 * @swagger
 * /v1/api/admin/blogs:
 *   post:
 *     summary: Create Blog
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - title
 *               - subtitle
 *               - desc
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: "5 Tips For A Successful Match"
 *               subtitle:
 *                 type: string
 *                 example: "Finding the right partner made easy"
 *               desc:
 *                 type: string
 *                 example: "Full blog description goes here."
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Blog created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', authenticate, upload.single('image'), createBlog);

/**
 * @swagger
 * /v1/api/admin/blogs:
 *   get:
 *     summary: Get All Blogs
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: Blogs fetched successfully.
 */
router.get('/', getBlogs);

/**
 * @swagger
 * /v1/api/admin/blogs/{id}:
 *   get:
 *     summary: Get Blog by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog fetched successfully.
 *       404:
 *         description: Blog not found.
 */
router.get('/:id', getBlog);

/**
 * @swagger
 * /v1/api/admin/blogs/{id}:
 *   put:
 *     summary: Update Blog
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               desc:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Blog not found.
 */
router.put('/:id', authenticate, upload.single('image'), updateBlog);

/**
 * @swagger
 * /v1/api/admin/blogs/{id}:
 *   delete:
 *     summary: Delete Blog
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Blog not found.
 */
router.delete('/:id', authenticate, deleteBlog);

export const blogRouter = router;
