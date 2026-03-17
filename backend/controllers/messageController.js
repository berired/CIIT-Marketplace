import { adminDb } from '../config/firebase.js';

/**
 * Send a message
 */
export const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { recipientId, listingId, message } = req.body;

    // Verify user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to send messages'
      });
    }

    if (!recipientId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipientId and message'
      });
    }

    // Get sender info
    const senderDoc = await adminDb.collection('users').doc(userId).get();
    const senderData = senderDoc.data();

    // Get recipient info
    const recipientDoc = await adminDb.collection('users').doc(recipientId).get();
    const recipientData = recipientDoc.data();

    if (!recipientDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Create conversation ID (sorted user IDs)
    const conversationId = [userId, recipientId].sort().join('_');

    // Create or update conversation
    const conversationRef = adminDb.collection('conversations').doc(conversationId);
    const conversationDoc = await conversationRef.get();

    if (!conversationDoc.exists) {
      await conversationRef.set({
        id: conversationId,
        participants: [userId, recipientId],
        participantNames: [senderData?.fullName, recipientData?.fullName],
        participantAvatars: [senderData?.avatar, recipientData?.avatar],
        listingId: listingId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: message,
        lastMessageTime: new Date().toISOString(),
        lastMessageSenderId: userId
      });
    } else {
      await conversationRef.update({
        updatedAt: new Date().toISOString(),
        lastMessage: message,
        lastMessageTime: new Date().toISOString(),
        lastMessageSenderId: userId
      });
    }

    // Add message to messages subcollection
    const messagesRef = conversationRef.collection('messages');
    const messageRef = await messagesRef.add({
      senderId: userId,
      senderName: senderData?.fullName,
      recipientId,
      message,
      timestamp: new Date().toISOString(),
      read: false
    });

    // Log message send
    console.log(`✅ Message sent from ${senderData?.fullName} to ${recipientData?.fullName}`);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: messageRef.id,
        conversationId,
        senderId: userId,
        message,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

/**
 * Get conversations for a user
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const snapshot = await adminDb
      .collection('conversations')
      .where('participants', 'array-contains', userId)
      .get();

    const conversations = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const otherUserId = data.participants.find(id => id !== userId);
      conversations.push({
        id: doc.id,
        ...data,
        otherUserId
      });
    });

    // Sort by updatedAt in descending order (most recent first)
    conversations.sort((a, b) => {
      const timeA = new Date(a.updatedAt).getTime();
      const timeB = new Date(b.updatedAt).getTime();
      return timeB - timeA;
    });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

/**
 * Get messages in a conversation
 */
export const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;

    const conversationDoc = await adminDb
      .collection('conversations')
      .doc(conversationId)
      .get();

    if (!conversationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const conversation = conversationDoc.data();

    // Verify user is part of conversation
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this conversation'
      });
    }

    // Get messages
    const messagesSnapshot = await conversationDoc.ref
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();

    const messages = [];

    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Mark messages as read
    messagesSnapshot.forEach(async doc => {
      const data = doc.data();
      if (data.recipientId === userId && !data.read) {
        await doc.ref.update({ read: true });
      }
    });

    res.status(200).json({
      success: true,
      conversationId,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

/**
 * Get unread message count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const conversationsSnapshot = await adminDb
      .collection('conversations')
      .where('participants', 'array-contains', userId)
      .get();

    let totalUnread = 0;

    for (const conversationDoc of conversationsSnapshot.docs) {
      const messagesSnapshot = await conversationDoc.ref
        .collection('messages')
        .where('recipientId', '==', userId)
        .where('read', '==', false)
        .get();

      totalUnread += messagesSnapshot.size;
    }

    res.status(200).json({
      success: true,
      unreadCount: totalUnread
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message
    });
  }
};
