import { Router } from 'express';
import {
  createChat,
  sendMessageController,
  getChatsController,
  getAllMyMessages,
  markSeenController,
  blockChatController,
  unblockChatController,
  clearChatController,
} from './chat.controllers';
import { authenticate } from '../../../middlewares/authMiddleware';
import { upload } from '../../../config/cloudinary';

const router = Router();

/**
 * @swagger
 * /v1/api/chat/create-room:
 *   post:
 *     summary: Create Chat Room
 *     description: >
 *       Creates a chat room between two users only if the interest request exists and is not deleted.
 *       If a chat room already exists, the existing room is returned.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interestId
 *             properties:
 *               interestId:
 *                 type: string
 *                 example: "6a54b7afe5b2731244e0c40a"
 *     responses:
 *       201:
 *         description: Chat room created successfully (or existing room returned).
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
 *                   example: Chat room created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: "6a5487a89b2e535513fd7b12_6a54891f9b2e535513fd7b49"
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "6a54891f9b2e535513fd7b49"
 *                         - "6a5487a89b2e535513fd7b12"
 *                     interestId:
 *                       type: string
 *                       example: "6a54b7afe5b2731244e0c40a"
 *                     createdBy:
 *                       type: string
 *                       example: "6a54891f9b2e535513fd7b49"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     messageCounts:
 *                       type: object
 *                       description: Number of messages sent by each user (used for the pending-interest message limit).
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         "6a54891f9b2e535513fd7b49": 0
 *                         "6a5487a89b2e535513fd7b12": 0
 *                     unreadCounts:
 *                       type: object
 *                       description: Number of unseen messages for each user.
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         "6a54891f9b2e535513fd7b49": 0
 *                         "6a5487a89b2e535513fd7b12": 0
 *                     blockedBy:
 *                       type: array
 *                       description: Profile ids of users who blocked the other user in this chat (chat-only block).
 *                       items:
 *                         type: string
 *                       example: []
 *                     lastMessage:
 *                       type: string
 *                       example: ""
 *                     lastMessageSender:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     lastMessageType:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     lastMessageAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad Request
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
 *                   description: One of the messages listed below.
 *                   enum:
 *                     - Profile not found.
 *                     - Interest request not found.
 *                     - Interest request has been deleted.
 *                     - Unauthorized.
 *       401:
 *         description: Unauthorized
 */
router.post('/create-room', authenticate, createChat);

/**
 * @swagger
 * /v1/api/chat/send-message:
 *   post:
 *     summary: Send Message
 *     description: >
 *       Sends a text message or file attachment (image, video, audio, document) to an existing chat room.
 *       Files are uploaded to Cloudinary and the attachment metadata is stored in Firestore.
 *       The message is rejected if either user has blocked the other in this chat (see the chat block / unblock APIs). While the interest request is Pending,
 *       each user can send a maximum of 4 messages. On success the receiver's unread count is incremented by 1.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - type
 *             properties:
 *               roomId:
 *                 type: string
 *                 example: "6892d4d51c6d6d7c2ab4f501_6892d55f1c6d6d7c2ab4f57a"
 *                 description: Chat room ID.
 *               text:
 *                 type: string
 *                 example: "Hello! How are you?"
 *                 description: Message text. Required only when type is TEXT.
 *               type:
 *                 type: string
 *                 enum:
 *                   - TEXT
 *                   - IMAGE
 *                   - VIDEO
 *                   - AUDIO
 *                   - DOCUMENT
 *                 example: TEXT
 *                 description: Type of message being sent.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File attachment. Required for IMAGE, VIDEO, AUDIO and DOCUMENT message types.
 *     responses:
 *       201:
 *         description: Message sent successfully.
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
 *                   example: Message sent successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: "6892d4d51c6d6d7c2ab4f501_6892d55f1c6d6d7c2ab4f57a"
 *                     messageId:
 *                       type: string
 *                       example: "L1kA3vH5s9w2PqXnB8Rt"
 *                     senderId:
 *                       type: string
 *                       example: "6892d4d51c6d6d7c2ab4f501"
 *                     receiverId:
 *                       type: string
 *                       example: "6892d55f1c6d6d7c2ab4f57a"
 *                     text:
 *                       type: string
 *                       example: "Hello! How are you?"
 *                     type:
 *                       type: string
 *                       enum: [TEXT, IMAGE, VIDEO, AUDIO, DOCUMENT]
 *                       example: TEXT
 *                     attachment:
 *                       type: object
 *                       nullable: true
 *                       description: Present only for IMAGE, VIDEO, AUDIO and DOCUMENT messages.
 *                       properties:
 *                         url:
 *                           type: string
 *                           example: "https://res.cloudinary.com/demo/image/upload/v1234567890/matrimony/chat/photo.jpg"
 *                         publicId:
 *                           type: string
 *                           example: "matrimony/chat/abc123xyz"
 *                         fileName:
 *                           type: string
 *                           example: "photo.jpg"
 *                         mimeType:
 *                           type: string
 *                           example: "image/jpeg"
 *                         size:
 *                           type: integer
 *                           example: 248512
 *                     status:
 *                       type: string
 *                       enum: [SENT, DELIVERED, SEEN]
 *                       example: SENT
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request
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
 *                   description: One of the messages listed below.
 *                   enum:
 *                     - Profile not found.
 *                     - Chat room not found.
 *                     - Unauthorized.
 *                     - Receiver not found.
 *                     - You have blocked this user. Unblock to send messages.
 *                     - You cannot send messages to this user.
 *                     - Interest request not found.
 *                     - Interest request has been deleted.
 *                     - Message text is required.
 *                     - Attachment is required for this message type.
 *                     - You have reached the maximum of 4 messages. Wait until the interest request is accepted.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
  '/send-message',
  authenticate,
  upload.single('file'),
  sendMessageController,
);

/**
 * @swagger
 * /v1/api/chat/get-chats:
 *   get:
 *     summary: Get all logged-in User's Chats with other users
 *     description: >
 *       Returns all chat rooms of the logged-in user sorted by the latest message.
 *       Each chat includes the other participant's details, the interest request status,
 *       the unseen message count for the logged-in user and the block flags.
 *       If the logged-in user cleared a chat and no newer message exists, lastMessage is empty and unreadCount is 0.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chats fetched successfully.
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
 *                   example: Chats fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roomId:
 *                         type: string
 *                         example: "6892d4d51c6d6d7c2ab4f501_6892d55f1c6d6d7c2ab4f57a"
 *                       participant:
 *                         type: object
 *                         description: The other user in the chat.
 *                         properties:
 *                           profileId:
 *                             type: string
 *                             example: "6892d55f1c6d6d7c2ab4f57a"
 *                           firebaseUid:
 *                             type: string
 *                             nullable: true
 *                             example: "kP2xQ9zLmN3aB7vT1sYwRdE5uH42"
 *                           firstName:
 *                             type: string
 *                             example: Riya
 *                           lastName:
 *                             type: string
 *                             example: Patil
 *                           fullName:
 *                             type: string
 *                             example: Riya Patil
 *                           profilePhoto:
 *                             type: string
 *                             nullable: true
 *                             example: "https://res.cloudinary.com/demo/image/upload/v1234567890/matrimony/profile/photo.jpg"
 *                           mobile:
 *                             type: string
 *                             nullable: true
 *                             example: "9876543210"
 *                           countryCode:
 *                             type: string
 *                             nullable: true
 *                             example: "+91"
 *                           subscription:
 *                             type: object
 *                             properties:
 *                               isActive:
 *                                 type: boolean
 *                                 example: true
 *                               packageId:
 *                                 type: string
 *                                 example: "6890c1d2e4b0a1b2c3d4e5f6"
 *                               expiryDate:
 *                                 type: string
 *                                 format: date-time
 *                       lastMessage:
 *                         type: string
 *                         example: "📷 Photo"
 *                       lastMessageType:
 *                         type: string
 *                         enum: [TEXT, IMAGE, VIDEO, AUDIO, DOCUMENT]
 *                         nullable: true
 *                         example: IMAGE
 *                       lastMessageSender:
 *                         type: string
 *                         nullable: true
 *                         example: "6892d4d51c6d6d7c2ab4f501"
 *                       lastMessageAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       interestId:
 *                         type: string
 *                         example: "6892d4d51c6d6d7c2ab4f400"
 *                       interestStatus:
 *                         type: string
 *                         nullable: true
 *                         enum: [Pending, Accepted, Rejected, Withdrawn]
 *                         description: Status of the interest request linked to this chat. Null if the interest was deleted or not found.
 *                         example: Accepted
 *                       unreadCount:
 *                         type: integer
 *                         description: Number of unseen messages for the logged-in user in this chat.
 *                         example: 3
 *                       isBlockedByMe:
 *                         type: boolean
 *                         description: True if the logged-in user has blocked the other participant.
 *                         example: false
 *                       hasBlockedMe:
 *                         type: boolean
 *                         description: True if the other participant has blocked the logged-in user.
 *                         example: false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/get-chats', authenticate, getChatsController);

/**
 * @swagger
 * /v1/api/chat/messages/{roomId}:
 *   get:
 *     summary: Get all chat messages
 *     description: >
 *       Returns every message exchanged in a chat room, along with the other participant's details,
 *       the interest request status, the logged-in user's unread count and the block flags.
 *       This API does not mark messages as seen. Call the mark-seen API for that.
 *       If the logged-in user cleared this chat, only messages sent after that time are returned.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *     responses:
 *       200:
 *         description: Messages fetched successfully.
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
 *                   example: Messages fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     participant:
 *                       type: object
 *                       description: The other user in the chat.
 *                       properties:
 *                         profileId:
 *                           type: string
 *                           example: "6a5b25cff664b0200235d439"
 *                         firebaseUid:
 *                           type: string
 *                           nullable: true
 *                           example: "kP2xQ9zLmN3aB7vT1sYwRdE5uH42"
 *                         fullName:
 *                           type: string
 *                           example: Riya Patil
 *                         profilePhoto:
 *                           type: string
 *                           nullable: true
 *                         mobile:
 *                           type: string
 *                           nullable: true
 *                           example: "9876543210"
 *                         countryCode:
 *                           type: string
 *                           nullable: true
 *                           example: "+91"
 *                         subscription:
 *                           type: object
 *                           properties:
 *                             isActive:
 *                               type: boolean
 *                               example: true
 *                             packageName:
 *                               type: string
 *                               nullable: true
 *                               example: Gold
 *                             packageId:
 *                               type: string
 *                               example: "6890c1d2e4b0a1b2c3d4e5f6"
 *                             expiryDate:
 *                               type: string
 *                               format: date-time
 *                     interestStatus:
 *                       type: string
 *                       nullable: true
 *                       enum: [Pending, Accepted, Rejected, Withdrawn]
 *                       description: Status of the interest request linked to this chat. Null if the interest was deleted or not found.
 *                       example: Pending
 *                     isBlockedByMe:
 *                       type: boolean
 *                       description: True if the logged-in user has blocked the other participant.
 *                       example: false
 *                     hasBlockedMe:
 *                       type: boolean
 *                       description: True if the other participant has blocked the logged-in user.
 *                       example: false
 *                     unreadCount:
 *                       type: integer
 *                       description: Number of unseen messages for the logged-in user in this chat.
 *                       example: 2
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           messageId:
 *                             type: string
 *                             example: "L1kA3vH5s9w2PqXnB8Rt"
 *                           senderId:
 *                             type: string
 *                             example: "6892d4d51c6d6d7c2ab4f501"
 *                           receiverId:
 *                             type: string
 *                             example: "6892d55f1c6d6d7c2ab4f57a"
 *                           text:
 *                             type: string
 *                             example: "Hello! How are you?"
 *                           type:
 *                             type: string
 *                             enum: [TEXT, IMAGE, VIDEO, AUDIO, DOCUMENT]
 *                             example: TEXT
 *                           attachment:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               url:
 *                                 type: string
 *                               publicId:
 *                                 type: string
 *                               fileName:
 *                                 type: string
 *                               mimeType:
 *                                 type: string
 *                               size:
 *                                 type: integer
 *                           status:
 *                             type: string
 *                             enum: [SENT, DELIVERED, SEEN]
 *                             example: SEEN
 *                           seenAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             description: Set when the receiver opens the chat (mark-seen API).
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error (for example, Chat room not found, Unauthorized or Other profile not found).
 */
router.get('/messages/:roomId', authenticate, getAllMyMessages);

/**
 * @swagger
 * /v1/api/chat/mark-seen/{roomId}:
 *   patch:
 *     summary: Mark messages as seen
 *     description: >
 *       Marks all unseen messages received by the logged-in user in the chat room as SEEN
 *       (also stores seenAt) and resets the logged-in user's unread count to 0.
 *       Call this API whenever the user opens a chat.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *     responses:
 *       200:
 *         description: Messages marked as seen.
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
 *                   example: Messages marked as seen.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *                     seenCount:
 *                       type: integer
 *                       description: Number of messages that were changed to SEEN in this call.
 *                       example: 3
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error (for example, Profile not found, Chat room not found or Unauthorized).
 */
router.patch('/mark-seen/:roomId', authenticate, markSeenController);

/**
 * @swagger
 * /v1/api/chat/block/{roomId}:
 *   patch:
 *     summary: Block user in chat
 *     description: >
 *       Chat-only block (WhatsApp style). This is separate from the profile block module.
 *       After blocking, no message can be sent in this room by either user until the blocker unblocks.
 *       The chat and old messages stay visible. Profile, interest and search are not affected.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *     responses:
 *       200:
 *         description: User blocked in chat successfully.
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
 *                   example: User blocked in chat successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *                     isBlockedByMe:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad Request
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
 *                   description: One of the messages listed below.
 *                   enum:
 *                     - Profile not found.
 *                     - Chat room not found.
 *                     - Unauthorized.
 *                     - Other participant not found.
 *                     - You have already blocked this user.
 *       401:
 *         description: Unauthorized
 */
router.patch('/block/:roomId', authenticate, blockChatController);

/**
 * @swagger
 * /v1/api/chat/unblock/{roomId}:
 *   patch:
 *     summary: Unblock user in chat
 *     description: >
 *       Removes the chat-only block. Only the user who blocked can unblock.
 *       After unblocking, both users can send messages again.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *     responses:
 *       200:
 *         description: User unblocked in chat successfully.
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
 *                   example: User unblocked in chat successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *                     isBlockedByMe:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad Request
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
 *                   description: One of the messages listed below.
 *                   enum:
 *                     - Profile not found.
 *                     - Chat room not found.
 *                     - Unauthorized.
 *                     - Other participant not found.
 *                     - You have not blocked this user.
 *       401:
 *         description: Unauthorized
 */
router.patch('/unblock/:roomId', authenticate, unblockChatController);

/**
 * @swagger
 * /v1/api/chat/clear/{roomId}:
 *   patch:
 *     summary: Clear chat
 *     description: >
 *       Clears the chat only for the logged-in user (WhatsApp style). Messages are not deleted,
 *       so the other user still sees the full conversation. After clearing, the get messages API
 *       returns only messages sent after this call, and the chat stays in the chat list with an empty
 *       last message and unread count 0. The user's unread count is reset to 0.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *     responses:
 *       200:
 *         description: Chat cleared successfully.
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
 *                   example: Chat cleared successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *                     cleared:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad Request
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
 *                   description: One of the messages listed below.
 *                   enum:
 *                     - Profile not found.
 *                     - Chat room not found.
 *                     - Unauthorized.
 *                     - Other participant not found.
 *       401:
 *         description: Unauthorized
 */
router.patch('/clear/:roomId', authenticate, clearChatController);

export const chatRouter = router;
