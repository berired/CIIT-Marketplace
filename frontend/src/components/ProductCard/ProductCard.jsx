import { Link } from 'react-router-dom'
import { formatCondition, getImageUrl } from '../../utils/formatters'
import './ProductCard.css'

function ProductCard({ product }) {
  return (
    <div className="product-card">
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
  )
}

export default ProductCard
