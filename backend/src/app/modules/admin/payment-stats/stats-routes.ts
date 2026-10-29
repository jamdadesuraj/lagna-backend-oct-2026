import { NextFunction, Request, Response, Router } from 'express';
import { authenticate } from '../../../middlewares/authMiddleware';
import { UserRole } from '../../auth/auth.interface';

import {
  getBiodataPayments,
  getBiodataStats,
  getSpotlightPayments,
  getSpotlightStats,
  getSubscribedMembers,
  getSubscriptionStats,
} from './stats';
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
 * /v1/api/admin/payment/subscription-stats:
 *   get:
 *     summary: Get subscription stats for the admin dashboard cards
 *     description: >
 *       Returns total active subscribed members, members subscribed today
 *       (IST) and total revenue from successful package payments. A member
 *       counts as active only if the subscription is active and not yet
 *       expired. Spotlight payments are not included in the revenue.
 *     tags: [Payment Stats (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription stats fetched successfully.
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
 *                   example: "Subscription stats fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSubscribed:
 *                       type: integer
 *                       example: 12648
 *                     todaySubscribed:
 *                       type: integer
 *                       example: 148
 *                     totalRevenue:
 *                       type: number
 *                       example: 845620
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/subscription-stats',
  authenticate,
  requireAdmin,
  getSubscriptionStats,
);

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscribedMember:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68bb12345678901234567890"
 *         matrimonyId:
 *           type: string
 *           nullable: true
 *           example: "SJ01012000"
 *         firstName:
 *           type: string
 *           example: "Suraj"
 *         lastName:
 *           type: string
 *           example: "Jamdade"
 *         packageName:
 *           type: string
 *           nullable: true
 *           example: "Gold"
 *         price:
 *           type: number
 *           nullable: true
 *           example: 99
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         duration:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         durationType:
 *           type: string
 *           enum: [DAY, MONTH, YEAR]
 *           nullable: true
 *           example: MONTH
 *         status:
 *           type: string
 *           enum: [ACTIVE, EXPIRED]
 *           example: ACTIVE
 */

/**
 * @swagger
 * /v1/api/admin/payment/subscribed-members:
 *   get:
 *     summary: Get paginated list of subscribed members
 *     description: >
 *       Lists every member who has purchased a package (active and expired),
 *       newest subscription first. Status is ACTIVE only when the subscription
 *       is active and its expiry date is in the future.
 *     tags: [Payment Stats (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by matrimony ID or member name.
 *     responses:
 *       200:
 *         description: Subscribed members fetched successfully.
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
 *                   example: "Subscribed members fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubscribedMember'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalMembers:
 *                       type: integer
 *                       example: 42
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/subscribed-members',
  authenticate,
  requireAdmin,
  getSubscribedMembers,
);

/**
 * @swagger
 * /v1/api/admin/payment/spotlight-stats:
 *   get:
 *     summary: Get spotlight stats for the admin dashboard cards
 *     description: >
 *       Built from successful spotlight payments. Total members and today
 *       members count distinct members (today follows IST). Total revenue is
 *       the sum of successful spotlight payment amounts.
 *     tags: [Payment Stats (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spotlight stats fetched successfully.
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
 *                   example: "Spotlight stats fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalMembers:
 *                       type: integer
 *                       example: 320
 *                     todayMembers:
 *                       type: integer
 *                       example: 12
 *                     totalRevenue:
 *                       type: number
 *                       example: 95680
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get('/spotlight-stats', authenticate, requireAdmin, getSpotlightStats);

/**
 * @swagger
 * components:
 *   schemas:
 *     SpotlightPayment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68dd12345678901234567890"
 *         matrimonyId:
 *           type: string
 *           nullable: true
 *           example: "SJ01012000"
 *         firstName:
 *           type: string
 *           example: "Suraj"
 *         lastName:
 *           type: string
 *           example: "Jamdade"
 *         price:
 *           type: number
 *           nullable: true
 *           example: 299
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Payment time (paidAt).
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Derived as paidAt plus 24 hours.
 *         status:
 *           type: string
 *           enum: [ACTIVE, EXPIRED]
 *           example: ACTIVE
 */

/**
 * @swagger
 * /v1/api/admin/payment/spotlight-payments:
 *   get:
 *     summary: Get paginated list of spotlight payments
 *     description: >
 *       Lists successful spotlight payments, newest first. Status is ACTIVE
 *       while the derived expiry date (payment time plus 24 hours) is in the
 *       future.
 *     tags: [Payment Stats (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by matrimony ID or member name.
 *     responses:
 *       200:
 *         description: Spotlight payments fetched successfully.
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
 *                   example: "Spotlight payments fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SpotlightPayment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPayments:
 *                       type: integer
 *                       example: 57
 *                     totalPages:
 *                       type: integer
 *                       example: 6
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/spotlight-payments',
  authenticate,
  requireAdmin,
  getSpotlightPayments,
);

/**
 * @swagger
 * /v1/api/admin/payment/biodata-stats:
 *   get:
 *     summary: Get biodata payment stats for the admin dashboard cards
 *     description: >
 *       Built from successful biodata template payments. Total members and
 *       today members count distinct members (today follows IST). Total
 *       revenue is the sum of successful biodata payment amounts.
 *     tags: [Payment Stats (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Biodata stats fetched successfully.
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
 *                   example: "Biodata stats fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalMembers:
 *                       type: integer
 *                       example: 210
 *                     todayMembers:
 *                       type: integer
 *                       example: 8
 *                     totalRevenue:
 *                       type: number
 *                       example: 41800
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get('/biodata-stats', authenticate, requireAdmin, getBiodataStats);

/**
 * @swagger
 * components:
 *   schemas:
 *     BiodataPayment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68ee12345678901234567890"
 *         matrimonyId:
 *           type: string
 *           nullable: true
 *           example: "SJ01012000"
 *         firstName:
 *           type: string
 *           example: "Suraj"
 *         lastName:
 *           type: string
 *           example: "Jamdade"
 *         price:
 *           type: number
 *           nullable: true
 *           example: 199
 *         createdAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Payment time (paidAt).
 */

/**
 * @swagger
 * /v1/api/admin/payment/biodata-payments:
 *   get:
 *     summary: Get paginated list of biodata payments
 *     description: >
 *       Lists successful biodata template payments, newest first.
 *     tags: [Payment Stats (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by matrimony ID or member name.
 *     responses:
 *       200:
 *         description: Biodata payments fetched successfully.
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
 *                   example: "Biodata payments fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BiodataPayment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPayments:
 *                       type: integer
 *                       example: 57
 *                     totalPages:
 *                       type: integer
 *                       example: 6
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get('/biodata-payments', authenticate, requireAdmin, getBiodataPayments);

export const paymentStatsRouter = router;
