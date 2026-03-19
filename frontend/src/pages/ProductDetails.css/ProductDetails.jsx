import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatCondition, getImageUrl } from '../../utils/formatters'
import listingService from '../../services/listingService'
import messageService from '../../services/messageService'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await listingService.getListingById(id)
      setProduct(response.listing)
      
      // Fetch related products
      if (response.listing?.category) {
        const allListings = await listingService.getAllListings(response.listing.category)
        const related = allListings.listings
          .filter((item) => item.id !== id)
          .slice(0, 3)
        setRelatedProducts(related)
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleMessageSeller = async () => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (!userData?.uid) {
      navigate('/login')
      return
    }
    
    try {
      await messageService.sendMessage(product.sellerId, `Hi, I'm interested in your ${product.title}`, product.id)
      navigate('/messages')
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  if (loading) {
    return (
      <section className="product-details-page">
        <p>Loading...</p>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="product-details-page">
        <div className="product-breadcrumb">
          <Link to="/listings">← Back to Listings</Link>
        </div>

        <div className="product-details-card">
          <div className="product-details-info">
            <h1>Product not found</h1>
            <p className="auth-subtext">
              {error || 'The item you are trying to view does not exist.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="product-details-page">
      <div className="product-breadcrumb">
        <Link to="/listings">← Back to Listings</Link>
      </div>

      <div className="product-details-card">
        <div className="product-details-image-wrap">
          <img
            src={getImageUrl(product.image, product.title)}
            alt={product.title}
            className="product-details-image"
          />
        </div>

        <div className="product-details-info">
          <span className="product-details-category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="product-details-price">₱{product.price}</p>

          <div className="product-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Condition</span>
              <span className="meta-value">{formatCondition(product.condition)}</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Seller</span>
              <span className="meta-value">{product.seller}</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Posted</span>
              <span className="meta-value">{new Date(product.datePosted).toLocaleDateString()}</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Meetup</span>
              <span className="meta-value">{product.location}</span>
            </div>
          </div>

          <div className="product-description-box">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-details-actions">
            <button className="primary-btn" type="button" onClick={handleMessageSeller}>
              Message Seller
            </button>
            <button className="secondary-btn" type="button">
              Save Item
            </button>
          </div>
        </div>
      </div>

      <div className="related-section">
        <div className="section-header">
          <h2>More Like This</h2>
          <p>Discover similar items from other CIIT students.</p>
        </div>

        <div className="listings-grid">
          {relatedProducts.map((item) => (
            <div className="product-card" key={item.id}>
              <img
                src={getImageUrl(item.image, item.title)}
                className="product-image"
                alt={item.title}
              />
              <div className="product-info">
                <h3>{item.name}</h3>
                <p className="price">{item.price}</p>
                <p className="condition">{item.condition}</p>
                <p className="seller">Seller: {item.seller}</p>

                <Link to={`/product/${item.id}`} className="view-btn-link">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductDetails