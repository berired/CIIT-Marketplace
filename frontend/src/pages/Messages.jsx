import React, { useState } from 'react';
import './Messages.css';

function Messages() {
  const [activeChatId, setActiveChatId] = useState(1);

  const contacts = [
    { id: 1, name: 'Alex Rivera', status: 'Active now', avatar: 'https://placehold.co/100/0A3F4F/white?text=AR' },
    { id: 2, name: 'Jordan Lee', status: 'Away', avatar: 'https://placehold.co/100/27B6D6/white?text=JL' },
    { id: 3, name: 'Casey Blair', status: 'Offline', avatar: 'https://placehold.co/100/D8E1E6/1F2933?text=CB' }
  ];

  const chatData = {
    1: [
      { id: 1, text: "Is the denim jacket still for sale?", type: "received", time: "2:45 PM" },
      { id: 2, text: "Yes! Still available for meetups.", type: "sent", time: "2:50 PM" }
    ],
    2: [
      { id: 1, text: "Meet at the lobby?", type: "received", time: "10:00 AM" }
    ],
    3: [
      { id: 1, text: "Hey! Just saw your listing for the camera.", type: "received", time: "3:00 PM" },
      { id: 2, text: "Great! It's in perfect condition.", type: "sent", time: "3:05 PM" }
    ]
  };

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