import express from 'express';
import {
  sendMessage,
  getConversations,
  getMessages,
  getUnreadCount
} from '../controllers/messageController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/messages
 * @desc    Send a message
 * @access  Private
 */
router.post('/', verifyToken, sendMessage);

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all conversations for a user
 * @access  Private
 */
router.get('/conversations', verifyToken, getConversations);

/**
 * @route   GET /api/messages/unread
 * @desc    Get unread message count
 * @access  Private
 */
router.get('/unread', verifyToken, getUnreadCount);

/**
 * @route   GET /api/messages/:conversationId
 * @desc    Get messages in a conversation
 * @access  Private
 */
router.get('/:conversationId', verifyToken, getMessages);

export default router;
