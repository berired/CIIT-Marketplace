import { Link } from 'react-router-dom'
import { useState } from 'react'
import products from '../data/products'

function Listings() {
  const [showFilters, setShowFilters] = useState(false)

  const filters = [
    'All',
    'Fashion',
    'Gadgets',
    'School Supplies',
    'Accessories',
  ]

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
            <select id="sort">
              <option>Newest</option>
              <option>Lowest Price</option>
              <option>Highest Price</option>
              <option>A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="filter-chips listings-chips">
        {filters.map((filter, index) => (
          <button
            key={filter}
            className={index === 0 ? 'chip active-chip' : 'chip'}
            type="button"
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
                <input type="number" placeholder="Min" />
                <input type="number" placeholder="Max" />
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

            <button className="apply-filter-btn" type="button">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="listings-summary">
        <p>Showing {products.length} listings</p>
      </div>

      <div className="listings-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image}
              className="product-image"
              alt={product.name}
            />

            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">{product.price}</p>
              <p className="condition">{product.condition}</p>
              <p className="seller">Seller: {product.seller}</p>

              <Link to={`/product/${product.id}`} className="view-btn-link">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Listings