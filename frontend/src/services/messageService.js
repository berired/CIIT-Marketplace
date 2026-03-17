import apiClient from './api';

/**
 * Messages API endpoints
 */
export const messageService = {
  // Send message
  sendMessage: (recipientId, message, listingId = null) =>
    apiClient.post('/messages', {
      recipientId,
      message,
      listingId
    }),

  // Get conversations
  getConversations: () =>
    apiClient.get('/messages/conversations'),

  // Get messages in conversation
  getMessages: (conversationId) =>
    apiClient.get(`/messages/${conversationId}`),

  // Get unread message count
  getUnreadCount: () =>
    apiClient.get('/messages/unread')
};

export default messageService;
