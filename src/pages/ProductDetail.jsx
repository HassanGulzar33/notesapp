import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../lib/client';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    client.models.Product.get({ id }).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <div className="container"><p className="empty-state">Loading...</p></div>;

  return (
    <div className="container" style={{ padding: '32px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      <div className="img-wrap" style={{ borderRadius: 6, overflow: 'hidden', background: 'var(--off-white)' }}>
        {product.images?.[0] && <img src={product.images[0]} alt={product.name} style={{ width: '100%' }} />}
      </div>
      <div>
        <h1 style={{ fontSize: 28 }}>{product.name}</h1>
        <p className="price" style={{ fontSize: 22, margin: '12px 0' }}>Rs {product.price.toLocaleString()}</p>
        <p style={{ color: '#555' }}>{product.description}</p>
        <p style={{ fontSize: 13, color: product.stock > 0 ? 'var(--pitch-green)' : 'var(--leather-red)', marginTop: 8 }}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, alignItems: 'center' }}>
          <input
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            style={{ width: 60, padding: 8, border: '1px solid #d8d2c4', borderRadius: 6 }}
          />
          <button
            className="btn btn-primary"
            disabled={product.stock <= 0}
            onClick={() => addItem(product, qty)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
