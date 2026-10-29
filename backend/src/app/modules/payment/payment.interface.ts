import { Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum PaymentType {
  PACKAGE = 'PACKAGE',
  SPOTLIGHT = 'SPOTLIGHT',
  BIODATA = 'BIODATA',
}

export interface IPayment {
  userId: Types.ObjectId;

  profileId: Types.ObjectId;

  type: PaymentType;

  packageId?: Types.ObjectId;

  biodataTemplateId?: Types.ObjectId;

  amount: number;
  idempotencyKey: string;

  razorpayOrderId?: string;

  razorpayPaymentId?: string;

  razorpaySignature?: string;

  status: PaymentStatus;

  paidAt?: Date;
}
