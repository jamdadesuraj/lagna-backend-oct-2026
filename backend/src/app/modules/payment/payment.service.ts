import { Payment } from './payment.model';
import { PaymentStatus, PaymentType } from './payment.interface';
import Package from '../package/package.model';
import { SpotlightSettings } from '../admin/spotlight-settings/spotlightSettings.model';
import { Spotlight } from '../profile-details/spotlight/spotlight.model';
import { BiodataTemplate } from '../admin/biodata-template/biodataTemplate.model';
import { BiodataTemplateStatus } from '../admin/biodata-template/biodataTemplate.interface';
import { razorpay } from '../../config/razorpay';
import { Types } from 'mongoose';
import { verifyRazorpaySignature } from '../../utils/payment.util';
import { Profile } from '../profile-details/profile.model';
import crypto from 'crypto';
import mongoose from 'mongoose';

export const createSpotlightOrder = async (
  userId: Types.ObjectId,
  profileId: Types.ObjectId,
) => {
  const settings = await SpotlightSettings.findOne();

  if (!settings || settings.amount <= 0) {
    throw new Error('Spotlight amount is not configured.');
  }

  const amount = settings.amount;
  const idempotencyKey = crypto.randomUUID();

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        type: PaymentType.SPOTLIGHT,
        userId: userId.toString(),
      },
    });
  } catch (err: any) {
    const razorpayMessage =
      err?.error?.description ||
      err?.message ||
      'Razorpay order creation failed.';
    throw new Error(razorpayMessage);
  }

  const payment = await Payment.create({
    userId,
    profileId,
    type: PaymentType.SPOTLIGHT,
    amount,
    idempotencyKey,
    razorpayOrderId: razorpayOrder.id,
    status: PaymentStatus.PENDING,
  });

  return {
    paymentId: payment._id,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    idempotencyKey,
  };
};

// ==================================================
// BIODATA TEMPLATE ORDER
// ==================================================

export const createBiodataOrder = async (
  userId: Types.ObjectId,
  profileId: Types.ObjectId,
  templateId: Types.ObjectId | string,
) => {
  // ==========================================
  // 1. Validate Template ID
  // ==========================================

  if (!Types.ObjectId.isValid(templateId)) {
    throw new Error('Invalid biodata template ID');
  }

  // ==========================================
  // 2. Find Active Template (price always comes from DB)
  // ==========================================

  const template = await BiodataTemplate.findOne({
    _id: templateId,
    isDeleted: false,
    status: BiodataTemplateStatus.ACTIVE,
  });

  if (!template) {
    throw new Error('Biodata template not found');
  }

  // Razorpay does not accept orders below ₹1 (100 paise)
  if (template.price < 1) {
    throw new Error('This biodata template is free and does not need payment.');
  }

  const amount = template.price;
  const idempotencyKey = crypto.randomUUID();

  // ==========================================
  // 3. Create Razorpay Order
  // ==========================================

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        type: PaymentType.BIODATA,
        biodataTemplateId: template.id,
        userId: userId.toString(),
      },
    });
  } catch (err: any) {
    const razorpayMessage =
      err?.error?.description ||
      err?.message ||
      'Razorpay order creation failed.';
    throw new Error(razorpayMessage);
  }

  // ==========================================
  // 4. Save Payment Record
  // ==========================================

  const payment = await Payment.create({
    userId,
    profileId,
    type: PaymentType.BIODATA,
    biodataTemplateId: template._id,
    amount,
    idempotencyKey,
    razorpayOrderId: razorpayOrder.id,
    status: PaymentStatus.PENDING,
  });

  // ==========================================
  // 5. Return Razorpay Details
  // ==========================================

  return {
    paymentId: payment._id,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    idempotencyKey,
    biodataTemplateId: template._id,
  };
};

export const createPaymentOrder = async (
  userId: Types.ObjectId,
  profileId: Types.ObjectId,
  packageId: Types.ObjectId,
) => {
  // ==========================================
  // 1. Find New Package
  // ==========================================

  const packageData = await Package.findById(packageId);

  if (!packageData) {
    throw new Error('Package not found');
  }

  // ==========================================
  // 2. Find User Profile
  // ==========================================

  const profile = await Profile.findById(profileId);

  if (!profile) {
    throw new Error('Profile not found');
  }

  // ==========================================
  // 3. Calculate Payable Amount (with proration if applicable)
  // ==========================================

  let payableAmount = packageData.price;

  const currentSubscription = profile.subscription;

  if (currentSubscription?.isActive && currentSubscription.expiryDate) {
    const expiryDate = currentSubscription.expiryDate;

    if (expiryDate > new Date()) {
      const currentPackage = await Package.findById(
        currentSubscription.packageId,
      );

      if (currentPackage) {
        const now = new Date();

        const remainingMilliseconds = expiryDate.getTime() - now.getTime();

        const remainingDays = Math.max(
          0,
          Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24)),
        );

        // Calculate current package's daily value
        let totalDays = 0;

        switch (currentPackage.durationType) {
          case 'DAY':
            totalDays = currentPackage.duration;
            break;

          case 'MONTH':
            totalDays = currentPackage.duration * 30;
            break;

          case 'YEAR':
            totalDays = currentPackage.duration * 365;
            break;
        }

        if (totalDays > 0 && remainingDays > 0) {
          const dailyPrice = currentPackage.price / totalDays;
          const unusedAmount = dailyPrice * remainingDays;

          // Deduct unused amount from new package price
          payableAmount = Math.max(0, packageData.price - unusedAmount);
        }
      }
    }
  }

  // ==========================================
  // 4. Generate Idempotency Key
  // ==========================================

  const idempotencyKey = crypto.randomUUID();

  // ==========================================
  // 5. Create Razorpay Order
  // ==========================================

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(payableAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        packageId: packageData.id,
        userId: userId.toString(),
      },
    });
  } catch (err: any) {
    const razorpayMessage =
      err?.error?.description ||
      err?.message ||
      'Razorpay order creation failed.';
    throw new Error(razorpayMessage);
  }

  // ==========================================
  // 6. Save Payment Record
  // ==========================================

  const payment = await Payment.create({
    userId,
    profileId,
    packageId: packageData._id,
    amount: payableAmount,
    idempotencyKey,
    razorpayOrderId: razorpayOrder.id,
    status: PaymentStatus.PENDING,
  });

  // ==========================================
  // 7. Return Razorpay Details
  // ==========================================

  return {
    paymentId: payment._id,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    idempotencyKey,
  };
};

export const verifyPayment = async (
  userId: Types.ObjectId,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  idempotencyKey: string,
) => {
  // ==================================================
  // 1. Verify Razorpay Signature
  // ==================================================

  const isValid = verifyRazorpaySignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  );

  if (!isValid) {
    throw new Error('Invalid payment signature');
  }

  // ==================================================
  // 2. Start MongoDB Transaction
  // ==================================================

  const session = await mongoose.startSession();

  try {
    let result: any;

    await session.withTransaction(async () => {
      // ==========================================
      // 3. Find Payment using Idempotency Key
      // ==========================================

      const payment = await Payment.findOne({
        userId,
        razorpayOrderId,
      }).session(session);

      if (!payment) {
        throw new Error('Payment record not found');
      }

      // ==========================================
      // 4. Verify Razorpay Order ID
      // ==========================================

      if (payment.razorpayOrderId !== razorpayOrderId) {
        throw new Error('Invalid payment order');
      }

      // ==========================================
      // 5. Atomic PENDING → SUCCESS
      // ==========================================

      const updatedPayment = await Payment.findOneAndUpdate(
        {
          _id: payment._id,
          status: PaymentStatus.PENDING,
        },
        {
          $set: {
            status: PaymentStatus.SUCCESS,
            razorpayPaymentId,
            razorpaySignature,
            paidAt: new Date(),
          },
        },

        {
          new: true,
          session,
        },
      );

      // ==========================================
      // 6. Already Processed
      // ==========================================

      if (!updatedPayment) {
        const existingPayment = await Payment.findById(payment._id).session(
          session,
        );

        result = {
          payment: existingPayment,
          subscription: undefined,
        };

        return;
      }
      // ==========================================
      // 7. Branch by payment type
      // ==========================================

      if (updatedPayment.type === PaymentType.SPOTLIGHT) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        await Spotlight.findOneAndUpdate(
          { profileId: updatedPayment.profileId },
          {
            profileId: updatedPayment.profileId,
            activatedAt: now,
            expiresAt,
          },
          { upsert: true, session },
        );

        await Profile.findByIdAndUpdate(
          updatedPayment.profileId,
          { isSpotlighted: true, spotlightExpiresAt: expiresAt },
          { session },
        );

        result = {
          payment: updatedPayment,
          spotlight: { activatedAt: now, expiresAt },
        };

        return;
      }

      // ==========================================
      // 7b. BIODATA payments: payment record is the proof of purchase
      // ==========================================

      if (updatedPayment.type === PaymentType.BIODATA) {
        result = {
          payment: updatedPayment,
          biodataTemplateId: updatedPayment.biodataTemplateId,
        };

        return;
      }

      // ==========================================
      // 8. Fetch Package (PACKAGE payments only)
      // ==========================================

      const packageData = await Package.findById(
        updatedPayment.packageId,
      ).session(session);

      if (!packageData) {
        throw new Error('Package not found');
      }
      // ==========================================
      // 9. Fetch Profile
      // ==========================================

      const profile = await Profile.findById(updatedPayment.profileId).session(
        session,
      );

      if (!profile) {
        throw new Error('Profile not found');
      }

      // ==========================================
      // 10. Calculate Subscription Dates
      // ==========================================

      const startDate = new Date();
      const expiryDate = new Date(startDate);

      switch (packageData.durationType) {
        case 'DAY':
          expiryDate.setDate(expiryDate.getDate() + packageData.duration);
          break;

        case 'MONTH':
          expiryDate.setMonth(expiryDate.getMonth() + packageData.duration);
          break;

        case 'YEAR':
          expiryDate.setFullYear(
            expiryDate.getFullYear() + packageData.duration,
          );
          break;
      }

      // ==========================================
      // 11. Replace Current Subscription
      // ==========================================

      profile.subscription = {
        isActive: true,
        packageId: updatedPayment.packageId,
        packageName: packageData.title,
        price: packageData.price,
        startDate,
        expiryDate,
      };

      await profile.save({
        session,
      });

      // ==========================================
      // 12. Return Result
      // ==========================================

      result = {
        payment: updatedPayment,
        subscription: profile.subscription,
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};
