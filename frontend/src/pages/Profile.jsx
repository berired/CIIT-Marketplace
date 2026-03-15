import React from 'react';
import products from '../data/products';

function Profile() {
  const user = {
    username: 'Fran',
    fullName: 'Francesca Rivera',
    bio: 'CIIT Student | Sustainable Fashion Enthusiast | 3rd Year Multimedia Arts',
    location: 'Quezon City, PH',
    joined: 'January 2024',
    rating: '4.9 (24 reviews)',
    avatar: 'https://placehold.co/150'
  };

  // Filter listings to show only those belonging to 'Fran'
  const myListings = products.filter(item => item.seller === user.username);

  return (
    <section className="profile-page" style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      
      {/* Expanded User Info Section */}
      <header style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '50px', backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '15px' }}>
        <img src={user.avatar} alt="Profile" style={{ borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '1.8rem' }}>{user.fullName}</h1>
          <p style={{ color: '#007bff', fontWeight: '600', margin: '0 0 10px 0' }}>@{user.username}</p>
          <p style={{ margin: '0 0 15px 0', lineHeight: '1.4', color: '#444' }}>{user.bio}</p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#666' }}>
            <span>📍 {user.location}</span>
            <span>📅 Joined {user.joined}</span>
            <span>⭐ {user.rating}</span>
          </div>
        </div>
        <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', fontWeight: 'bold' }}>Edit Profile</button>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem' }}>My Postings ({myListings.length})</h2>
        <button style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
      </div>

      {/* Postings Grid (Card Format) */}
      <div className="listings-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px' 
      }}>
        {myListings.map((item) => (
          <article key={item.id} style={{ 
            border: '1px solid #eee', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            transition: 'transform 0.2s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            {/* Card Image Area */}
            <div style={{ position: 'relative' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <span style={{ 
                position: 'absolute', top: '10px', right: '10px', 
                background: 'rgba(255,255,255,0.9)', padding: '4px 10px', 
                borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' 
              }}>
                {item.condition}
              </span>
            </div>
            
            {/* Card Content */}
            <div style={{ padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>{item.name}</h3>
                <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' }}>{item.price}</span>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>
                {item.description.substring(0, 60)}...
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f5f5f5', fontSize: '0.75rem', color: '#999' }}>
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