import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import listingService from '../services/listingService';

// Convert file to base64 DataURL blob
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function CreateListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'electronics',
    condition: 'good',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    if (type === 'file') {
      const file = files?.[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          image: file
        }));
        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.title || !formData.price || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user?.uid) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // If image is provided, convert to blob
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await fileToDataUrl(formData.image);
      }

      // Create listing with image blob
      await listingService.createListing({
        title: formData.title,
        price: formData.price,
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        image: imageUrl
      });
      navigate('/listings');
    } catch (err) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-listing-page">
      <div className="create-listing-header">
        <h1>Create Listing</h1>
        <p>Post an item for other CIIT students to browse and buy.</p>
      </div>

      <div className="create-listing-card">
        <form className="create-listing-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Item Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter item title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" value={formData.category} onChange={handleChange}>
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
              <select id="condition" value={formData.condition} onChange={handleChange}>
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
              rows="6"
              placeholder="Describe your item, condition, and other important details"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Item Image (Optional)</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
            {imagePreview && (
              <div style={{ marginTop: '1rem' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
              </div>
            )}
          </div>

          <div className="create-listing-actions">
            <button className="secondary-btn" type="button" onClick={() => navigate('/listings')}>
              Cancel
            </button>
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Listing'}
            </button>
          </div>
        </form>

        <div className="create-listing-side">
          <div className="listing-tip-card">
            <h2>Listing Tips</h2>
            <p>
              Make your item easier to sell by giving complete and clear details.
            </p>

            <ul className="listing-tip-list">
              <li>Use a short but specific title</li>
              <li>Add the correct condition of the item</li>
              <li>Write an honest description</li>
              <li>Upload a clear image</li>
              <li>Set a reasonable student-friendly price</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateListing