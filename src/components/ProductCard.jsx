import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="img-wrap">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#e4ddcc' }} />
        )}
      </Link>
      <div className="info">
        <h4>{product.name}</h4>
        <div className="row">
          <span className="price">Rs {product.price.toLocaleString()}</span>
          <button
            className="btn btn-primary"
            style={{ padding: '8px 14px', fontSize: 12 }}
            disabled={product.stock <= 0}
            onClick={() => addItem(product)}
          >
            {product.stock > 0 ? 'Add' : 'Out of stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
