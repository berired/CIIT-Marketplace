import React from 'react';
import products from '../data/products';
import './Profile.css'; // Don't forget to import the CSS!

function Profile() {
  //temp just to show data
  const user = {
    username: 'Fran',
    fullName: 'Francesca Rivera',
    bio: 'CIIT Student | Sustainable Fashion Enthusiast | 3rd Year Multimedia Arts',
    location: 'Quezon City, PH',
    joined: 'January 2024',
    rating: '4.9 (24 reviews)',
    avatar: 'https://placehold.co/150'
  };

  const myListings = products.filter(item => item.seller === user.username);

  return (
    <section className="profile-page">
      <header className="profile-header">
        <img src={user.avatar} alt="Profile" className="profile-avatar" />
        <div className="profile-info">
          <h1>{user.fullName}</h1>
          <p className="username-handle">@{user.username}</p>
          <p className="user-bio">{user.bio}</p>
          <div className="user-stats">
            <span>📍 {user.location}</span>
            <span>📅 Joined {user.joined}</span>
            <span>⭐ {user.rating}</span>
          </div>
        </div>
        <button className="edit-btn">Edit Profile</button>
      </header>

      <div className="section-header">
        <h2>My Postings ({myListings.length})</h2>
        <button style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
      </div>

      <div className="listings-grid">
        {myListings.map((item) => (
          <article key={item.id} className="listing-card">
            <div className="card-image-wrapper">
              <img src={item.image} alt={item.name} className="card-image" />
              <span className="condition-badge">{item.condition}</span>
            </div>
            
            <div className="card-content">
              <div className="card-header">
                <h3>{item.name}</h3>
                <span className="card-price">{item.price}</span>
              </div>
              
              <p className="card-description">
                {item.description.substring(0, 60)}...
              </p>
              
              <div className="card-footer">
                <span>{item.location}</span>
                <span>{item.datePosted}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Profile;