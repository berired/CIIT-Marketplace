import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import messageService from '../services/messageService';
import './Messages.css';

function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData?.uid) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [navigate]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversations();
      setConversations(response.conversations || []);
      if (response.conversations && response.conversations.length > 0) {
        setActiveChatId(response.conversations[0].id);
        fetchMessages(response.conversations[0].id);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messageService.getMessages(conversationId);
      setCurrentMessages(response.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChatId) return;

    try {
      const activeConv = conversations.find(c => c.id === activeChatId);
      const otherUserId = activeConv.otherUserId;
      
      await messageService.sendMessage(otherUserId, messageText);
      setMessageText('');
      fetchMessages(activeChatId);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const currentContact = conversations.find(c => c.id === activeChatId);

  return (
    <section className="messages-container">
      <aside className="inbox-sidebar">
        <div className="inbox-header">
          <h2>Messages</h2>
        </div>
        <div className="chat-list">
          {loading ? (
            <p>Loading conversations...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : conversations.length > 0 ? (
            conversations.map(conv => {
              const otherUser = conv.participants.find(id => id !== JSON.parse(localStorage.getItem('user')).uid);
              return (
                <div 
                  key={conv.id} 
                  className={`chat-item ${activeChatId === conv.id ? 'is-selected' : ''}`}
                  onClick={() => {
                    setActiveChatId(conv.id);
                    fetchMessages(conv.id);
                  }}
                >
                  <img src={conv.participantAvatars?.[1] || 'https://placehold.co/50'} alt="" className="chat-avatar" />
                  <div className="chat-info">
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{conv.participantNames?.[1]}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{conv.lastMessage?.substring(0, 30)}...</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No conversations yet</p>
          )}
        </div>
      </aside>

      <main className="chat-window">
        <header className="chat-window-header">
          <div className="chat-header-info">
            <h3>{currentContact?.participantNames?.[1] || 'Select a conversation'}</h3>
            <span className="status">online</span>
          </div>
        </header>

        <div className="message-thread">
          {currentMessages.map((msg, idx) => {
            const userData = JSON.parse(localStorage.getItem('user'));
            const isSent = msg.senderId === userData.uid;
            return (
              <div key={idx} className={`message-wrapper ${isSent ? 'outgoing' : 'incoming'}`}>
                <div className={`message-bubble ${isSent ? 'outgoing' : 'incoming'}`}>
                  {msg.message}
                </div>
                <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            );
          })}
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder={`Message ${currentContact?.participantNames?.[1] || 'user'}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="send-btn" onClick={handleSendMessage}>Send</button>
        </div>
      </main>
    </section>
  );
}

export default Messages;