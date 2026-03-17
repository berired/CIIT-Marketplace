import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatCondition, getImageUrl } from '../utils/formatters'
import listingService from '../services/listingService'

function Listings() {
  const [showFilters, setShowFilters] = useState(false)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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

  useEffect(() => {
    fetchListings()
  }, [selectedCategory, sortBy])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const category = categoryMap[selectedCategory]
      const sortValue = sortBy === 'newest' ? 'newest' : 
                        sortBy === 'lowest' ? 'lowest-price' :
                        sortBy === 'highest' ? 'highest-price' : 'a-z'
      
      const response = await listingService.getAllListings(
        category,
        minPrice || null,
        maxPrice || null,
        sortValue
      )
      setListings(response.listings || [])
      setError('')
    } catch (err) {
      console.error('Error fetching listings:', err)
      setError('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    fetchListings()
  }

  return (
    <section className="listings-page">
      <div className="listings-header">
        <h1>Browse Listings</h1>
        <p>Explore items being sold by fellow CIIT students.</p>
      </div>

      <div className="listings-toolbar">
        <div className="listings-search">
          <input type="text" placeholder="Search listings..." />
          <button type="button">🔍</button>
        </div>

        <div className="listings-toolbar-right">
          <button
            type="button"
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="listings-sort">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="lowest">Lowest Price</option>
              <option value="highest">Highest Price</option>
              <option value="a-z">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="filter-chips listings-chips">
        {filters.map((filter, index) => (
          <button
            key={filter}
            className={selectedCategory === filter ? 'chip active-chip' : 'chip'}
            type="button"
            onClick={() => setSelectedCategory(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="filters-dropdown">
          <div className="filters-panel">
            <div className="filter-card">
              <h3>Price Range</h3>
              <div className="price-inputs">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-card">
              <h3>Condition</h3>
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Brand New</span>
              </label>
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Like New</span>
              </label>
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Good Condition</span>
              </label>
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Pre-loved</span>
              </label>
            </div>

            <button className="apply-filter-btn" type="button" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="listings-summary">
        <p>Showing {listings.length} listings</p>
      </div>

      <div className="listings-grid">
        {loading ? (
          <p>Loading listings...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : listings.length > 0 ? (
          listings.map((product) => (
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
  )
}

export default Listings