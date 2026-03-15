import React, { useState } from 'react';
import './Messages.css';
import chatData from '../data/chatData';
import contacts from '../data/contacts';

function Messages() {
  const [activeChatId, setActiveChatId] = useState(1);

  const currentMessages = chatData[activeChatId] || [];
  const currentContact = contacts.find(c => c.id === activeChatId);

  return (
    <section className="messages-container">
      <aside className="inbox-sidebar">
        <div className="inbox-header">
          <h2>Messages</h2>
        </div>
        <div className="chat-list">
          {contacts.map(c => (
            <div 
              key={c.id} 
              className={`chat-item ${activeChatId === c.id ? 'is-selected' : ''}`}
              onClick={() => setActiveChatId(c.id)}
            >
              <img src={c.avatar} alt={c.name} className="chat-avatar" />
              <div className="chat-info">
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{c.name}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{c.status}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="chat-window">
        <header className="chat-window-header">
          <div className="chat-header-info">
            <h3>{currentContact?.name}</h3>
            <span className="status">{currentContact?.status}</span>
          </div>
        </header>

        <div className="message-thread">
          {currentMessages.map(msg => (
            <div key={msg.id} className={`message-wrapper ${msg.type}`}>
              <div className={`message-bubble ${msg.type}`}>
                {msg.text}
              </div>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input type="text" placeholder={`Message ${currentContact?.name}...`} />
          <button className="send-btn">Send</button>
        </div>
      </main>
    </section>
  );
}

export default Messages;