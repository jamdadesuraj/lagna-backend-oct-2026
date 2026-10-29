import { Router } from 'express';

import {
  loginAdmin,
  refreshAdminToken,
  logoutAdmin,
  getCurrentAdmin,
  updateAdminCredentials,
} from './adminAuth.controller';

import { authenticate } from '../../../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /v1/api/admin/auth/update-credentials:
 *   put:
 *     summary: Update Admin Login Credentials
 *     description: Updates the authenticated administrator's username (email) and password.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin@matrimony.com
 *               password:
 *                 type: string
 *                 example: NewAdmin@123
 *               confirmPassword:
 *                 type: string
 *                 example: NewAdmin@123
 *     responses:
 *       200:
 *         description: Login credentials updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Admin not found.
 *       409:
 *         description: Username already in use.
 */
router.put('/update-credentials', authenticate, updateAdminCredentials);

/**
 * @swagger
 * /v1/api/admin/auth/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticates an administrator using email and password and returns an access token and refresh token.
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@matrimony.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Admin logged in successfully.
 *       401:
 *         description: Invalid email or password.
 *       404:
 *         description: Admin not found.
 */
router.post('/login', loginAdmin);
/**
 * @swagger
 * /v1/api/admin/auth/refresh-token:
 *   post:
 *     summary: Refresh Admin Access Token
 *     description: Generates a new access token using a valid admin refresh token.
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Access token generated successfully.
 *       401:
 *         description: Invalid or expired refresh token.
 */
router.post('/refresh-token', refreshAdminToken);
/**
 * @swagger
 * /v1/api/admin/auth/logout:
 *   post:
 *     summary: Admin Logout
 *     description: Logs out the authenticated administrator by invalidating the stored refresh token.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Admin logged out successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Admin not found.
 */
router.post('/logout', authenticate, logoutAdmin);
/**
 * @swagger
 * /v1/api/admin/auth/me:
 *   get:
 *     summary: Get Current Admin
 *     description: Retrieves the authenticated administrator's profile information.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Admin not found.
 */
router.get('/me', authenticate, getCurrentAdmin);

export const adminAuthRouter = router;
