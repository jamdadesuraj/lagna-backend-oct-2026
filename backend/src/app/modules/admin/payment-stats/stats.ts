import { Request, Response } from 'express';
import { Profile } from '../../profile-details/profile.model';
import { Payment } from '../../payment/payment.model';
import { PaymentStatus, PaymentType } from '../../payment/payment.interface';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const SPOTLIGHT_DURATION_MS = 24 * 60 * 60 * 1000;

const getStartOfTodayIST = (): Date => {
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);

  nowIST.setUTCHours(0, 0, 0, 0);

  return new Date(nowIST.getTime() - IST_OFFSET_MS);
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getSubscriptionStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = getStartOfTodayIST();

    const [totalSubscribed, todaySubscribed, revenueResult] = await Promise.all(
      [
        Profile.countDocuments({
          'subscription.isActive': true,
          'subscription.expiryDate': { $gt: now },
          isDeleted: false,
        }),

        Profile.countDocuments({
          'subscription.isActive': true,
          'subscription.expiryDate': { $gt: now },
          'subscription.startDate': { $gte: startOfToday },
          isDeleted: false,
        }),

        // Package payments only: spotlight revenue is shown on its own page.
        // To include spotlight payments here, remove the `type` line.
        Payment.aggregate<{ _id: null; total: number }>([
          {
            $match: {
              status: PaymentStatus.SUCCESS,
              type: PaymentType.PACKAGE,
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ],
    );

    return res.status(200).json({
      success: true,
      message: 'Subscription stats fetched successfully',
      data: {
        totalSubscribed,
        todaySubscribed,
        totalRevenue: revenueResult[0]?.total ?? 0,
      },
    });
  } catch (error) {
    console.error('Get Subscription Stats Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching subscription stats',
    });
  }
};

// ==================================================
// SUBSCRIBED MEMBERS LIST (table)
// ==================================================
interface SubscribedMemberLean {
  _id: unknown;
  matrimonyId?: string;
  basicDetails?: {
    firstName?: string;
    lastName?: string;
  };
  subscription?: {
    isActive?: boolean;
    packageId?: {
      _id: unknown;
      name?: string;
      duration?: number;
      durationType?: 'DAY' | 'MONTH' | 'YEAR';
    } | null;
    packageName?: string;
    price?: number;
    startDate?: Date;
    expiryDate?: Date;
  };
}

export const getSubscribedMembers = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === 'string' ? req.query.search.trim() : '';

    // Every member who has ever bought a package (active + expired).
    const filter: Record<string, unknown> = {
      isDeleted: false,
      'subscription.packageId': { $exists: true, $ne: null },
    };

    if (search) {
      const pattern = escapeRegex(search);

      filter.$or = [
        { matrimonyId: { $regex: pattern, $options: 'i' } },
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: [
                  { $ifNull: ['$basicDetails.firstName', ''] },
                  ' ',
                  { $ifNull: ['$basicDetails.lastName', ''] },
                ],
              },
              regex: pattern,
              options: 'i',
            },
          },
        },
      ];
    }

    const [profiles, total] = await Promise.all([
      Profile.find(filter)
        .select(
          'matrimonyId basicDetails.firstName basicDetails.lastName subscription',
        )
        .populate('subscription.packageId', 'name duration durationType')
        .sort({ 'subscription.startDate': -1 })
        .skip(skip)
        .limit(limit)
        .lean<SubscribedMemberLean[]>(),

      Profile.countDocuments(filter),
    ]);

    const now = new Date();

    const data = profiles.map((profile) => {
      const subscription = profile.subscription;
      const expiryDate = subscription?.expiryDate;

      const isActive =
        !!subscription?.isActive && !!expiryDate && expiryDate > now;

      return {
        _id: profile._id,
        matrimonyId: profile.matrimonyId ?? null,
        firstName: profile.basicDetails?.firstName ?? '',
        lastName: profile.basicDetails?.lastName ?? '',
        packageName:
          subscription?.packageName ?? subscription?.packageId?.name ?? null,
        price: subscription?.price ?? null,
        startDate: subscription?.startDate ?? null,
        expiryDate: expiryDate ?? null,
        duration: subscription?.packageId?.duration ?? null,
        durationType: subscription?.packageId?.durationType ?? null,
        status: isActive ? 'ACTIVE' : 'EXPIRED',
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Subscribed members fetched successfully',
      data,
      pagination: {
        currentPage: page,
        limit,
        totalMembers: total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Get Subscribed Members Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching subscribed members',
    });
  }
};

// ==================================================
// SPOTLIGHT STATS (top cards)
// ==================================================
// Built from Payment (permanent history). The Spotlight collection only holds
// currently active spotlights (TTL-deleted on expiry), so it can't be used.
export const getSpotlightStats = async (req: Request, res: Response) => {
  try {
    const startOfToday = getStartOfTodayIST();

    const baseMatch = {
      type: PaymentType.SPOTLIGHT,
      status: PaymentStatus.SUCCESS,
    };

    const [totalResult, todayResult] = await Promise.all([
      // Distinct members who ever bought spotlight + total revenue
      Payment.aggregate<{
        _id: null;
        totalRevenue: number;
        totalMembers: number;
      }>([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            members: { $addToSet: '$profileId' },
          },
        },
        {
          $project: {
            totalRevenue: 1,
            totalMembers: { $size: '$members' },
          },
        },
      ]),

      // Distinct members who bought spotlight today (IST)
      Payment.aggregate<{ count: number }>([
        { $match: { ...baseMatch, paidAt: { $gte: startOfToday } } },
        { $group: { _id: '$profileId' } },
        { $count: 'count' },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Spotlight stats fetched successfully',
      data: {
        totalMembers: totalResult[0]?.totalMembers ?? 0,
        todayMembers: todayResult[0]?.count ?? 0,
        totalRevenue: totalResult[0]?.totalRevenue ?? 0,
      },
    });
  } catch (error) {
    console.error('Get Spotlight Stats Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching spotlight stats',
    });
  }
};

// ==================================================
// SPOTLIGHT PAYMENTS LIST (table)
// ==================================================
interface SpotlightPaymentRow {
  _id: unknown;
  amount: number;
  paidAt?: Date;
  createdAt?: Date;
  matrimonyId?: string;
  firstName?: string;
  lastName?: string;
}

export const getSpotlightPayments = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const pipeline: Record<string, unknown>[] = [
      {
        $match: {
          type: PaymentType.SPOTLIGHT,
          status: PaymentStatus.SUCCESS,
        },
      },
      {
        $lookup: {
          from: Profile.collection.name,
          localField: 'profileId',
          foreignField: '_id',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    ];

    if (search) {
      const pattern = escapeRegex(search);

      pipeline.push({
        $match: {
          $or: [
            { 'profile.matrimonyId': { $regex: pattern, $options: 'i' } },
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $concat: [
                      { $ifNull: ['$profile.basicDetails.firstName', ''] },
                      ' ',
                      { $ifNull: ['$profile.basicDetails.lastName', ''] },
                    ],
                  },
                  regex: pattern,
                  options: 'i',
                },
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { paidAt: -1, createdAt: -1 } },
      {
        $facet: {
          rows: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                amount: 1,
                paidAt: 1,
                createdAt: 1,
                matrimonyId: '$profile.matrimonyId',
                firstName: '$profile.basicDetails.firstName',
                lastName: '$profile.basicDetails.lastName',
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    );

    const [result] = await Payment.aggregate<{
      rows: SpotlightPaymentRow[];
      total: { count: number }[];
    }>(pipeline as never[]);

    const rows = result?.rows ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    const nowMs = Date.now();

    const data = rows.map((row) => {
      const startDate = row.paidAt ?? row.createdAt ?? null;
      const expiryDate = startDate
        ? new Date(new Date(startDate).getTime() + SPOTLIGHT_DURATION_MS)
        : null;

      return {
        _id: row._id,
        matrimonyId: row.matrimonyId ?? null,
        firstName: row.firstName ?? '',
        lastName: row.lastName ?? '',
        price: row.amount ?? null,
        startDate,
        expiryDate,
        status:
          expiryDate && expiryDate.getTime() > nowMs ? 'ACTIVE' : 'EXPIRED',
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Spotlight payments fetched successfully',
      data,
      pagination: {
        currentPage: page,
        limit,
        totalPayments: total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Get Spotlight Payments Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching spotlight payments',
    });
  }
};

// ==================================================
// BIODATA STATS (top cards)
// ==================================================
// Built from Payment history: successful BIODATA payments only.
export const getBiodataStats = async (req: Request, res: Response) => {
  try {
    const startOfToday = getStartOfTodayIST();

    const baseMatch = {
      type: PaymentType.BIODATA,
      status: PaymentStatus.SUCCESS,
    };

    const [totalResult, todayResult] = await Promise.all([
      // Distinct members who ever bought a biodata template + total revenue
      Payment.aggregate<{
        _id: null;
        totalRevenue: number;
        totalMembers: number;
      }>([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            members: { $addToSet: '$profileId' },
          },
        },
        {
          $project: {
            totalRevenue: 1,
            totalMembers: { $size: '$members' },
          },
        },
      ]),

      // Distinct members who bought a biodata template today (IST)
      Payment.aggregate<{ count: number }>([
        { $match: { ...baseMatch, paidAt: { $gte: startOfToday } } },
        { $group: { _id: '$profileId' } },
        { $count: 'count' },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Biodata stats fetched successfully',
      data: {
        totalMembers: totalResult[0]?.totalMembers ?? 0,
        todayMembers: todayResult[0]?.count ?? 0,
        totalRevenue: totalResult[0]?.totalRevenue ?? 0,
      },
    });
  } catch (error) {
    console.error('Get Biodata Stats Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching biodata stats',
    });
  }
};

// ==================================================
// BIODATA PAYMENTS LIST (table)
// ==================================================
interface BiodataPaymentRow {
  _id: unknown;
  amount: number;
  paidAt?: Date;
  createdAt?: Date;
  matrimonyId?: string;
  firstName?: string;
  lastName?: string;
}

export const getBiodataPayments = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const pipeline: Record<string, unknown>[] = [
      {
        $match: {
          type: PaymentType.BIODATA,
          status: PaymentStatus.SUCCESS,
        },
      },
      {
        $lookup: {
          from: Profile.collection.name,
          localField: 'profileId',
          foreignField: '_id',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    ];

    if (search) {
      const pattern = escapeRegex(search);

      pipeline.push({
        $match: {
          $or: [
            { 'profile.matrimonyId': { $regex: pattern, $options: 'i' } },
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $concat: [
                      { $ifNull: ['$profile.basicDetails.firstName', ''] },
                      ' ',
                      { $ifNull: ['$profile.basicDetails.lastName', ''] },
                    ],
                  },
                  regex: pattern,
                  options: 'i',
                },
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { paidAt: -1, createdAt: -1 } },
      {
        $facet: {
          rows: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                amount: 1,
                paidAt: 1,
                createdAt: 1,
                matrimonyId: '$profile.matrimonyId',
                firstName: '$profile.basicDetails.firstName',
                lastName: '$profile.basicDetails.lastName',
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    );

    const [result] = await Payment.aggregate<{
      rows: BiodataPaymentRow[];
      total: { count: number }[];
    }>(pipeline as never[]);

    const rows = result?.rows ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    const data = rows.map((row) => ({
      _id: row._id,
      matrimonyId: row.matrimonyId ?? null,
      firstName: row.firstName ?? '',
      lastName: row.lastName ?? '',
      price: row.amount ?? null,
      createdAt: row.paidAt ?? row.createdAt ?? null,
    }));

    return res.status(200).json({
      success: true,
      message: 'Biodata payments fetched successfully',
      data,
      pagination: {
        currentPage: page,
        limit,
        totalPayments: total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Get Biodata Payments Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching biodata payments',
    });
  }
};
