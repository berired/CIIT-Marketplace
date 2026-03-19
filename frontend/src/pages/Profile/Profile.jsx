import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import listingService from '../../services/listingService';
import { formatCondition, formatCategory } from '../../utils/formatters';
import './Profile.css';
import SectionHeader from '../../components/SectionHeader/SectionHeader';

/**
 * Convert File to Data URL (Blob)
 */
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  // Profile Edit Modal
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileEdit, setProfileEdit] = useState({
    fullName: '',
    username: '',
    bio: '',
    avatar: null
  });
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Listing Edit Modal
  const [showListingEdit, setShowListingEdit] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [listingEdit, setListingEdit] = useState({
    title: '',
    price: '',
    category: 'electronics',
    condition: 'good',
    description: '',
    image: null
  });
  const [listingImagePreview, setListingImagePreview] = useState('');
  const [listingLoading, setListingLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData?.uid) {
      navigate('/login');
      return;
    }
    setUserId(userData.uid);
    fetchUserProfile(userData.uid);
    fetchUserListings(userData.uid);
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await userService.getUserProfile(userId);
      setUser(response.user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile');
    }
  };

  const fetchUserListings = async (userId) => {
    try {
      setLoading(true);
      const response = await userService.getUserListings(userId);
      setMyListings(response.listings || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  // Profile Edit Handlers
  const handleProfileEditOpen = () => {
    setProfileEdit({
      fullName: user.fullName || '',
      username: user.username || '',
      bio: user.bio || '',
      avatar: null
    });
    setProfileImagePreview(user.avatar || '');
    setShowProfileEdit(true);
  };

  const handleProfileEditChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files?.[0];
      if (file) {
        setProfileEdit(prev => ({
          ...prev,
          avatar: file
        }));
        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setProfileEdit(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfileEditSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      let avatarUrl = user.avatar || '';
      
      // Convert avatar to blob if a new file was selected
      if (profileEdit.avatar instanceof File) {
        avatarUrl = await fileToDataUrl(profileEdit.avatar);
      }

      // Update profile with new avatar blob
      await userService.updateUserProfile({
        fullName: profileEdit.fullName,
        username: profileEdit.username,
        bio: profileEdit.bio,
        avatar: avatarUrl
      });

      setUser(prev => ({
        ...prev,
        fullName: profileEdit.fullName,
        username: profileEdit.username,
        bio: profileEdit.bio,
        avatar: avatarUrl
      }));
      setShowProfileEdit(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile: ' + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Listing Edit Handlers
  const handleListingEditOpen = (listing) => {
    setEditingListingId(listing.id);
    setListingEdit({
      title: listing.title,
      price: listing.price,
      category: listing.category,
      condition: listing.condition,
      description: listing.description,
      image: null
    });
    setListingImagePreview(listing.image || '');
    setShowListingEdit(true);
  };

  const handleListingEditChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files?.[0];
      if (file) {
        setListingEdit(prev => ({
          ...prev,
          image: file
        }));
        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setListingImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setListingEdit(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleListingEditSubmit = async (e) => {
    e.preventDefault();
    setListingLoading(true);
    try {
      // Find the current listing to get its existing image
      const currentListing = myListings.find(l => l.id === editingListingId);
      let imageUrl = currentListing.image || '';
      
      // Convert image to blob if a new file was selected
      if (listingEdit.image instanceof File) {
        imageUrl = await fileToDataUrl(listingEdit.image);
      }

      // Update listing with new image blob
      await listingService.updateListing(editingListingId, {
        title: listingEdit.title,
        price: listingEdit.price,
        category: listingEdit.category,
        condition: listingEdit.condition,
        description: listingEdit.description,
        image: imageUrl
      });

      setMyListings(prev =>
        prev.map(listing =>
          listing.id === editingListingId ? {
            ...listing,
            title: listingEdit.title,
            price: listingEdit.price,
            category: listingEdit.category,
            condition: listingEdit.condition,
            description: listingEdit.description,
            image: imageUrl
          } : listing
        )
      );
      setShowListingEdit(false);
      setEditingListingId(null);
    } catch (err) {
      console.error('Error updating listing:', err);
      alert('Failed to update listing: ' + err.message);
    } finally {
      setListingLoading(false);
    }
  };

  const handleListingDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await listingService.deleteListing(listingId);
      setMyListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing');
    }
  };

  if (!user) {
    return (
      <section className="profile-page">
        <p>{loading ? 'Loading...' : error || 'User not found'}</p>
      </section>
    );
  }

  return (
    <section className="profile-page">
      {/* Profile Header */}
      <header className="profile-header">
        <img src={user.avatar} alt="Profile" className="profile-avatar" />
        <div className="profile-info">
          <h1>{user.fullName}</h1>
          <p className="username-handle">@{user.username}</p>
          <p className="user-bio">{user.bio || 'No bio yet'}</p>
          <div className="user-stats">
            <span>📈 {user.location}</span>
            <span>📅 Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            <span>⭐ {user.rating} ({user.reviews} reviews)</span>
          </div>
        </div>
        <button className="edit-btn" onClick={handleProfileEditOpen}>Edit Profile</button>
      </header>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="modal-overlay" onClick={() => setShowProfileEdit(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileEditSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={profileEdit.fullName}
                  onChange={handleProfileEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={profileEdit.username}
                  onChange={handleProfileEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={profileEdit.bio}
                  onChange={handleProfileEditChange}
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Profile Picture</label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileEditChange}
                />
                {profileImagePreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img src={profileImagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowProfileEdit(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={profileLoading}>
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listings Section */}
      <SectionHeader>
        <h2>My Postings ({myListings.length})</h2>
      </SectionHeader>

      <div className="listings-grid">
        {loading ? (
          <p>Loading listings...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : myListings.length > 0 ? (
          myListings.map((item) => (
            <article key={item.id} className="listing-card">
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.title} className="card-image" />
                <span className="condition-badge">{formatCondition(item.condition)}</span>
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <h3>{item.title}</h3>
                  <span className="card-price">₱{item.price}</span>
                </div>
                
                <p className="card-description">
                  {item.description.substring(0, 60)}...
                </p>
                
                <div className="card-footer">
                  <span>{item.location || 'CIIT'}</span>
                  <span>{new Date(item.datePosted).toLocaleDateString()}</span>
                </div>

                <div className="card-actions">
                  <button 
                    className="action-btn edit-btn-small" 
                    onClick={() => handleListingEditOpen(item)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn delete-btn-small" 
                    onClick={() => handleListingDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p>No listings yet</p>
        )}
      </div>

      {/* Listing Edit Modal */}
      {showListingEdit && (
        <div className="modal-overlay" onClick={() => setShowListingEdit(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Listing</h2>
            <form onSubmit={handleListingEditSubmit}>
              <div className="form-group">
                <label htmlFor="title">Item Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={listingEdit.title}
                  onChange={handleListingEditChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={listingEdit.price}
                    onChange={handleListingEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" name="category" value={listingEdit.category} onChange={handleListingEditChange}>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="furniture">Furniture</option>
                    <option value="sports">Sports</option>
                    <option value="toys">Toys</option>
                    <option value="household">Household</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="condition">Condition</label>
                  <select id="condition" name="condition" value={listingEdit.condition} onChange={handleListingEditChange}>
                    <option value="new">Brand New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good Condition</option>
                    <option value="fair">Fair Condition</option>
                    <option value="poor">Poor Condition</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  value={listingEdit.description}
                  onChange={handleListingEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Item Image</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleListingEditChange}
                />
                {listingImagePreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img src={listingImagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowListingEdit(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={listingLoading}>
                  {listingLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Profile;