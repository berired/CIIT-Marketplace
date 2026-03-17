import { Link, useParams } from 'react-router-dom'
import products from '../data/products'

function ProductDetails() {
  const { id } = useParams()
  const product = products.find((item) => item.id === Number(id))

  if (!product) {
    return (
      <section className="product-details-page">
        <div className="product-breadcrumb">
          <Link to="/listings">← Back to Listings</Link>
        </div>

        <div className="product-details-card">
          <div className="product-details-info">
            <h1>Product not found</h1>
            <p className="auth-subtext">
              The item you are trying to view does not exist.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3)

  return (
    <section className="product-details-page">
      <div className="product-breadcrumb">
        <Link to="/listings">← Back to Listings</Link>
      </div>

      <div className="product-details-card">
        <div className="product-details-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-details-image"
          />
        </div>

        <div className="product-details-info">
          <span className="product-details-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-details-price">{product.price}</p>

          <div className="product-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Condition</span>
              <span className="meta-value">{product.condition}</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Seller</span>
              <span className="meta-value">{product.seller}</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Posted</span>
              <span className="meta-value">{product.datePosted}</span>
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
            <button className="primary-btn" type="button">
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
                src={item.image}
                className="product-image"
                alt={item.name}
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