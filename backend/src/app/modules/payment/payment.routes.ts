import express from 'express';
import {
  createBiodataOrderController,
  createOrder,
  createSpotlightOrderController,
  verifyPaymentController,
} from './payment.controllers';
import { authenticate } from '../../middlewares/authMiddleware';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Packages Payment
 *     description: APIs for creating package payment orders and verifying Razorpay payments
 */
/**
 * @swagger
 * /v1/api/payment/create-order:
 *   post:
 *     summary: Create Razorpay payment order
 *     description:
 *       Creates a Razorpay order for purchasing a selected package.
 *       The user selects a package, and this API validates the package,
 *       creates a Razorpay order, and stores a pending payment record.
 *     tags:
 *       - Packages Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packageId
 *             properties:
 *               packageId:
 *                 type: string
 *                 example: "665f3a9c8d9b123456789abc"
 *                 description: ID of the package the user wants to purchase
 *     responses:
 *       200:
 *         description: Payment order created successfully
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
 *                   example: Payment order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                       example: "666abc123456789"
 *                     orderId:
 *                       type: string
 *                       example: "order_Nb12345xyz"
 *                     amount:
 *                       type: number
 *                       example: 99900
 *                     currency:
 *                       type: string
 *                       example: INR
 *
 *       400:
 *         description: Invalid package details
 *
 *       401:
 *         description: Unauthorized user
 *
 *       500:
 *         description: Internal server error
 */
router.post('/create-order', authenticate, createOrder);

/**
 * @swagger
 * /v1/api/payment/spotlight/create-order:
 *   post:
 *     summary: Create Razorpay order to spotlight the profile for 24 hours
 *     description: >
 *       Creates a Razorpay order for the current admin-configured spotlight amount.
 *       On successful verification (via the same /verify endpoint), the profile
 *       is boosted to the top of the feed for 24 hours.
 *     tags:
 *       - Packages Payment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spotlight payment order created successfully.
 *       401:
 *         description: Unauthorized user.
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/spotlight/create-order',
  authenticate,
  createSpotlightOrderController,
);

/**
 * @swagger
 * /v1/api/payment/biodata/create-order:
 *   post:
 *     summary: Create Razorpay order to purchase a biodata template
 *     description: >
 *       Creates a Razorpay order for the selected biodata template.
 *       The price is always read from the template stored in the database.
 *       On successful verification (via the same /verify endpoint), the payment
 *       is marked as SUCCESS and the user can use the purchased template.
 *     tags:
 *       - Packages Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateId
 *             properties:
 *               templateId:
 *                 type: string
 *                 example: "665f3a9c8d9b123456789abc"
 *                 description: ID of the biodata template the user wants to purchase
 *     responses:
 *       200:
 *         description: Biodata payment order created successfully
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
 *                   example: Biodata payment order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                       example: "666abc123456789"
 *                     orderId:
 *                       type: string
 *                       example: "order_Nb12345xyz"
 *                     amount:
 *                       type: number
 *                       example: 19900
 *                     currency:
 *                       type: string
 *                       example: INR
 *                     idempotencyKey:
 *                       type: string
 *                       example: "b3f1c2d4-1a2b-4c3d-8e9f-0a1b2c3d4e5f"
 *                     biodataTemplateId:
 *                       type: string
 *                       example: "665f3a9c8d9b123456789abc"
 *       400:
 *         description: Missing/invalid templateId, template not found, or template is free
 *       401:
 *         description: Unauthorized user
 *       404:
 *         description: Profile not found
 */
router.post(
  '/biodata/create-order',
  authenticate,
  createBiodataOrderController,
);

/**
 * @swagger
 * /v1/api/payment/verify:
 *   post:
 *     summary: Verify Razorpay payment
 *     description:
 *       Verifies the Razorpay payment signature and securely processes the payment.
 *       The API uses an idempotency key to prevent duplicate payment processing.
 *       On successful verification, the payment status is updated and the user's
 *       package subscription is activated or replaced with the newly purchased package.
 *       For spotlight payments the profile is spotlighted for 24 hours, and for
 *       biodata payments the payment is marked as SUCCESS.
 *     tags:
 *       - Packages Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpayOrderId
 *               - razorpayPaymentId
 *               - razorpaySignature
 *               - idempotencyKey
 *             properties:
 *               razorpayOrderId:
 *                 type: string
 *                 example: "order_Nb12345xyz"
 *                 description: Razorpay order ID generated during order creation
 *
 *               razorpayPaymentId:
 *                 type: string
 *                 example: "pay_Nb98765xyz"
 *                 description: Razorpay payment ID received after successful payment
 *
 *               razorpaySignature:
 *                 type: string
 *                 example: "a8f9d7e6c5b4..."
 *                 description: Razorpay generated payment signature used for verification
 *
 *               idempotencyKey:
 *                 type: string
 *                 example: "payment_8f3a7c9d2e1b"
 *                 description: Unique key for this payment attempt to prevent duplicate payment processing
 *
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Payment verified successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       description: Updated payment record
 *
 *                     subscription:
 *                       type: object
 *                       description: Activated or updated package subscription
 *
 *       400:
 *         description: Invalid payment signature, payment order, or payment verification failed
 *
 *       401:
 *         description: Unauthorized user
 *
 *       500:
 *         description: Internal server error
 */
router.post('/verify', authenticate, verifyPaymentController);

export const paymentRouter = router;
