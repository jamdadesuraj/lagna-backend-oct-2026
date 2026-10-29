import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AdminNotification } from './adminNotification.model';
import { AdminNotificationType } from './adminNotification.interface';

// ==================================================
// LIST (bell dropdown + "View All")
// ==================================================
export const getAdminNotifications = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (req.query.unread === 'true') {
      filter.isRead = false;
    }

    if (typeof req.query.type === 'string' && req.query.type) {
      if (
        !Object.values(AdminNotificationType).includes(
          req.query.type as AdminNotificationType,
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Type must be one of: ${Object.values(AdminNotificationType).join(', ')}`,
        });
      }

      filter.type = req.query.type;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      AdminNotification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      AdminNotification.countDocuments(filter),

      // Always the overall unread count, for the bell badge
      AdminNotification.countDocuments({ isRead: false }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications,
      unreadCount,
      pagination: {
        currentPage: page,
        limit,
        totalNotifications: total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Get Admin Notifications Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching notifications',
    });
  }
};

// ==================================================
// MARK ONE AS READ
// ==================================================
export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID',
      });
    }

    const notification = await AdminNotification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    ).lean();

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Mark Notification Read Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while updating the notification',
    });
  }
};

// ==================================================
// MARK ALL AS READ
// ==================================================
export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const result = await AdminNotification.updateMany(
      { isRead: false },
      { isRead: true },
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    console.error('Mark All Notifications Read Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while updating notifications',
    });
  }
};

// ==================================================
// CLEAR ALL
// ==================================================
export const clearAllNotifications = async (req: Request, res: Response) => {
  try {
    const result = await AdminNotification.deleteMany({});

    return res.status(200).json({
      success: true,
      message: 'All notifications cleared',
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error('Clear All Notifications Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while clearing notifications',
    });
  }
};
