import { NextFunction, Request, Response, Router } from 'express';
import { authenticate } from '../../../middlewares/authMiddleware';
import { UserRole } from '../../auth/auth.interface';
import { getDashboardStats } from './dashboard.controllers';

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
 * /v1/api/admin/dashboard/stats:
 *   get:
 *     summary: Get stats for the admin dashboard cards
 *     description: >
 *       Returns user counts (total, verified, subscribed, blocked) and revenue
 *       from successful payments (total, today in IST, biodata, spotlight).
 *       Subscribed users are those with an active, non-expired subscription.
 *       Revenue amounts are in rupees.
 *     tags: [Dashboard (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats fetched successfully.
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
 *                   example: "Dashboard stats fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 13647
 *                     verifiedUsers:
 *                       type: integer
 *                       example: 8924
 *                     subscribedUsers:
 *                       type: integer
 *                       example: 4286
 *                     blockedUsers:
 *                       type: integer
 *                       example: 126
 *                     totalRevenue:
 *                       type: number
 *                       example: 123600
 *                     todayRevenue:
 *                       type: number
 *                       example: 18500
 *                     biodataRevenue:
 *                       type: number
 *                       example: 42800
 *                     spotlightRevenue:
 *                       type: number
 *                       example: 26400
 *       401:
 *         description: Missing, invalid or expired access token.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get('/stats', authenticate, requireAdmin, getDashboardStats);

export const dashboardRouter = router;
