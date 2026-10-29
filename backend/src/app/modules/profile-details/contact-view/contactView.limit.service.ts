import { ClientSession } from 'mongoose';
import { Profile } from '../profile.model';
import PackageModel from '../../package/package.model';
import { ContactView } from './contactView.model';

export interface ContactViewLimitResult {
  allowed: boolean;
  message?: string;
}

const countUnlockedContacts = async (
  profileId: string,
  since?: Date,
  session?: ClientSession,
): Promise<number> => {
  const filter: Record<string, unknown> = { viewerId: profileId };
  if (since) {
    filter.viewedAt = { $gte: since };
  }
  return ContactView.countDocuments(filter).session(session ?? null);
};

export const checkContactViewLimit = async (
  profileId: string,
  session?: ClientSession,
): Promise<ContactViewLimitResult> => {
  const profile = await Profile.findById(profileId)
    .select('subscription')
    .session(session ?? null);

  if (!profile) {
    return { allowed: false, message: 'Profile not found.' };
  }

  const subscription = profile.subscription;
  const isExpired =
    !subscription?.packageId ||
    !subscription?.expiryDate ||
    new Date(subscription.expiryDate) < new Date();

  if (isExpired) {
    return {
      allowed: false,
      message: 'Please purchase a package to view contact details.',
    };
  }

  const packageData = await PackageModel.findById(
    subscription.packageId,
  ).session(session ?? null);

  if (!packageData) {
    return {
      allowed: false,
      message: 'Package associated with your subscription was not found.',
    };
  }

  const contactViewLimit = packageData.contactViewLimit ?? 9999;
  const packageStartDate = subscription.startDate
    ? new Date(subscription.startDate)
    : new Date(0);

  const unlockedCount = await countUnlockedContacts(
    profileId,
    packageStartDate,
    session,
  );

  if (unlockedCount >= contactViewLimit) {
    return {
      allowed: false,
      message: `You have reached your limit of ${contactViewLimit} contact views for this package.`,
    };
  }

  return { allowed: true };
};
