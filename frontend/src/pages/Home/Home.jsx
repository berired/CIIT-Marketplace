import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatCondition, getImageUrl } from '../../utils/formatters'
import listingService from '../../services/listingService'
import FilterChips from '../../components/Filter-chips/FilterChips'
import './Home.css'
const categoryMap = {
  'All': null,
  'Electronics': 'electronics',
  'Clothing': 'clothing',
  'Books': 'books',
  'Furniture': 'furniture',
  'Sports': 'sports',
  'Toys': 'toys',
  'Household': 'household',
  'Other': 'other'
}

const filters = Object.keys(categoryMap)

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  useEffect(() => {
    fetchFeaturedListings()
  }, [])

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true)
      const response = await listingService.getFeaturedListings()
      setFeaturedProducts(response.listings || [])
    } catch (err) {
      console.error('Error fetching listings:', err)
      setError('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const displayProducts = selectedFilter === 'All'
    ? featuredProducts
    : featuredProducts.filter(p => p.category === categoryMap[selectedFilter])

  return (
    <>
      <div className="search-container">
        <div className="search-bar">
          <input type="text" placeholder="Search items..." />
          <button type="button">🔍</button>
        </div>

        <FilterChips
          SelectedFilter={selectedFilter}
          filters={filters}
          onClick={setSelectedFilter}
        ></FilterChips>
        {/* <div className="filter-chips">
          {filters.map((filter, index) => (
            <button
              key={filter}
              className={selectedFilter === filter ? 'chip active-chip' : 'chip'}
              type="button"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div> */}
      </div>

      <section className="hero">
        <div className="hero-text">
          <h1>Buy and sell items within the CIIT community.</h1>
          <p>
            A simple student marketplace for clothes, gadgets, school supplies,
            and more.
          </p>

          <div className="hero-actions">
            <Link to="/listings" className="primary-btn-link">
              Browse Items
            </Link>

            <Link to="/create-listing" className="secondary-btn-link">
              Post an Item
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>Featured Listing</h3>
          <p className="featured-name">Y2K Shoulder Bag</p>
          <p className="featured-price">₱350</p>
          <span className="featured-tag">Trending</span>
        </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <h2>Latest Listings</h2>
          <p>Discover affordable finds from fellow students.</p>
        </div>

        <div className="product-grid">
          {loading ? (
            <p>Loading listings...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={getImageUrl(product.image, product.title)}
                  className="product-image"
                  alt={product.title}
                />

                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="price">₱{product.price}</p>
                  <p className="condition">{formatCondition(product.condition)}</p>
                  <p className="seller">Seller: {product.seller}</p>

                  <Link to={`/product/${product.id}`} className="view-btn-link">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No listings found</p>
          )}
        </div>
      </section>
    </>
  )
}

export default Home