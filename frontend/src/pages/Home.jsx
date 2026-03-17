import { Link } from 'react-router-dom'
import products from '../data/products'

const filters = ['All', 'Fashion', 'Gadgets', 'School Supplies', 'Accessories']

function Home() {
  const featuredProducts = products.slice(0, 8)

  return (
    <>
      <div className="search-container">
        <div className="search-bar">
          <input type="text" placeholder="Search items..." />
          <button type="button">🔍</button>
        </div>

        <div className="filter-chips">
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
          {featuredProducts.map((product) => (
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
    </>
  )
}

export default Home