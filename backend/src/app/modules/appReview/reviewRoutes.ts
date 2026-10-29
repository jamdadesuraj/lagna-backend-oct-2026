import { Router } from 'express';
import { authenticate } from '../../middlewares/authMiddleware';
import {
  createAppReview,
  getAppReviews,
  deleteAppReview,
} from './reviewController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AppReviewProfileRef:
 *       type: object
 *       description: Populated profile summary returned with each review.
 *       properties:
 *         _id:
 *           type: string
 *           example: "68bb12345678901234567890"
 *         matrimonyId:
 *           type: string
 *           example: "SJ01012000"
 *         basicDetails:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: "Suraj"
 *             lastName:
 *               type: string
 *               example: "Jamdade"
 *     AppReview:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68cc12345678901234567890"
 *         profileId:
 *           oneOf:
 *             - type: string
 *               description: Profile ID (returned by the create endpoint).
 *               example: "68bb12345678901234567890"
 *             - $ref: '#/components/schemas/AppReviewProfileRef'
 *           description: Profile ID on create, populated profile summary on list.
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         review:
 *           type: string
 *           maxLength: 1000
 *           example: "Very easy to use and found good matches quickly."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateAppReviewRequest:
 *       type: object
 *       required:
 *         - rating
 *         - review
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *           description: Rating between 1 and 5.
 *         review:
 *           type: string
 *           minLength: 3
 *           maxLength: 1000
 *           example: "Very easy to use and found good matches quickly."
 *           description: Review text (trimmed, 3 to 1000 characters).
 *     AppReviewError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Something went wrong."
 */

/**
 * @swagger
 * /v1/api/app-review:
 *   post:
 *     summary: Submit an app review
 *     description: >
 *       Creates a review for the logged-in member. The member's profile is
 *       resolved from the JWT user id, so no profile ID is sent in the body.
 *     tags: [App Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppReviewRequest'
 *     responses:
 *       201:
 *         description: Review submitted successfully.
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
 *                   example: "Review submitted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/AppReview'
 *       400:
 *         description: Validation error (invalid rating or review text).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Review must be at least 3 characters"
 *                 errors:
 *                   type: object
 *                   properties:
 *                     formErrors:
 *                       type: array
 *                       items:
 *                         type: string
 *                     fieldErrors:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Missing, invalid or expired access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 *       404:
 *         description: Profile not found for the logged-in user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 */
router.post('/', authenticate, createAppReview);

/**
 * @swagger
 * /v1/api/app-review:
 *   get:
 *     summary: Get all app reviews
 *     description: >
 *       Returns every app review, newest first. Each review includes a
 *       populated profile summary (matrimony ID and name). The list is not
 *       paginated.
 *     tags: [App Review]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: App reviews fetched successfully.
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
 *                   example: "App reviews fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AppReview'
 *       401:
 *         description: Missing, invalid or expired access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 */
router.get('/', authenticate, getAppReviews);

/**
 * @swagger
 * /v1/api/app-review/{id}:
 *   delete:
 *     summary: Delete an app review
 *     description: Permanently deletes a review by its ID (hard delete).
 *     tags: [App Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: App review ID (MongoDB ObjectId).
 *         example: "68cc12345678901234567890"
 *     responses:
 *       200:
 *         description: Review deleted successfully.
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
 *                   example: "Review deleted successfully"
 *       400:
 *         description: Invalid review ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 *       401:
 *         description: Missing, invalid or expired access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 *       404:
 *         description: Review not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppReviewError'
 */
router.delete('/:id', authenticate, deleteAppReview);

export const appReviewRouter = router;
