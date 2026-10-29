import { Request, Response } from 'express';
import { Profile } from '../../profile-details/profile.model';
import { Payment } from '../../payment/payment.model';
import { PaymentStatus, PaymentType } from '../../payment/payment.interface';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const getStartOfTodayIST = (): Date => {
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);

  nowIST.setUTCHours(0, 0, 0, 0);

  return new Date(nowIST.getTime() - IST_OFFSET_MS);
};

// ==================================================
// DASHBOARD STATS (top cards)
// ==================================================
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = getStartOfTodayIST();

    const [
      totalUsers,
      verifiedUsers,
      blockedUsers,
      subscribedUsers,
      revenueByType,
      todayRevenueResult,
    ] = await Promise.all([
      Profile.countDocuments({ isDeleted: false }),

      Profile.countDocuments({ isDeleted: false, isVerified: true }),

      Profile.countDocuments({ isDeleted: false, isBlocked: true }),

      // Same rule as subscription-stats: active and not yet expired
      Profile.countDocuments({
        isDeleted: false,
        'subscription.isActive': true,
        'subscription.expiryDate': { $gt: now },
      }),

      // Revenue of every successful payment, grouped by payment type
      Payment.aggregate<{ _id: string | null; total: number }>([
        { $match: { status: PaymentStatus.SUCCESS } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),

      // Revenue of successful payments made today (IST)
      Payment.aggregate<{ _id: null; total: number }>([
        {
          $match: {
            status: PaymentStatus.SUCCESS,
            paidAt: { $gte: startOfToday },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalRevenue = revenueByType.reduce(
      (sum, item) => sum + (item.total ?? 0),
      0,
    );

    const revenueOf = (type: PaymentType): number =>
      revenueByType.find((item) => item._id === type)?.total ?? 0;

    return res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalUsers,
        verifiedUsers,
        subscribedUsers,
        blockedUsers,
        totalRevenue,
        todayRevenue: todayRevenueResult[0]?.total ?? 0,
        biodataRevenue: revenueOf(PaymentType.BIODATA),
        spotlightRevenue: revenueOf(PaymentType.SPOTLIGHT),
      },
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching dashboard stats',
    });
  }
};
