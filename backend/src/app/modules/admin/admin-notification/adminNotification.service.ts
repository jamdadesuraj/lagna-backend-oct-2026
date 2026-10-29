import { AdminNotification } from './adminNotification.model';
import { CreateAdminNotificationInput } from './adminNotification.interface';

/**
 * Creates an admin notification.
 *
 * This NEVER throws: it is called from payment, verification and report
 * flows, and a notification failure must not break those flows.
 */
export const createAdminNotification = async (
  input: CreateAdminNotificationInput,
): Promise<void> => {
  try {
    await AdminNotification.create({
      type: input.type,
      title: input.title,
      message: input.message,
      profileId: input.profileId,
      referenceId: input.referenceId,
      meta: input.meta,
    });
  } catch (error) {
    console.error('Create Admin Notification Error:', error);
  }
};
