import { NextFunction, Request, Response, Router } from 'express';
import { authenticate } from '../../../middlewares/authMiddleware';
import { UserRole } from '../../auth/auth.interface';
import {
  clearAllNotifications,
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './adminNotification.controllers';

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
 * components:
 *   schemas:
 *     AdminNotification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68ff12345678901234567890"
 *         type:
 *           type: string
 *           enum: [PROFILE_VERIFICATION, PAYMENT_RECEIVED, REPORT_PROFILE]
 *           example: PAYMENT_RECEIVED
 *         title:
 *           type: string
 *           example: "Payment received"
 *         message:
 *           type: string
 *           example: "Suraj Jamdade paid ₹199 for a biodata template"
 *         profileId:
 *           type: string
 *           nullable: true
 *         referenceId:
 *           type: string
 *           nullable: true
 *         meta:
 *           type: object
 *           nullable: true
 *         isRead:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /v1/api/admin/notifications:
 *   get:
 *     summary: Get admin notifications
 *     description: >
 *       Returns notifications newest first, together with the overall unread
 *       count for the bell badge. Notifications are created for profile
 *       verification requests, received payments and reported profiles, and
 *       are deleted automatically after 30 days.
 *     tags: [Admin Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *       - in: query
 *         name: unread
 *         schema:
 *           type: boolean
 *         description: When true, returns only unread notifications.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PROFILE_VERIFICATION, PAYMENT_RECEIVED, REPORT_PROFILE]
 *     responses:
 *       200:
 *         description: Notifications fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminNotification'
 *                 unreadCount:
 *                   type: integer
 *                   example: 3
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalNotifications:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Invalid type filter.
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get('/', authenticate, requireAdmin, getAdminNotifications);

/**
 * @swagger
 * /v1/api/admin/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Admin Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read.
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.patch('/read-all', authenticate, requireAdmin, markAllNotificationsRead);

/**
 * @swagger
 * /v1/api/admin/notifications/{id}/read:
 *   patch:
 *     summary: Mark one notification as read
 *     tags: [Admin Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read.
 *       400:
 *         description: Invalid notification ID.
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal server error.
 */
router.patch('/:id/read', authenticate, requireAdmin, markNotificationRead);

/**
 * @swagger
 * /v1/api/admin/notifications/clear-all:
 *   delete:
 *     summary: Delete all notifications
 *     tags: [Admin Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications cleared.
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.delete('/clear-all', authenticate, requireAdmin, clearAllNotifications);

export const adminNotificationRouter = router;
