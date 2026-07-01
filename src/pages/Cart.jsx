import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container">
        <p className="empty-state">Your cart is empty. <Link to="/">Browse gear.</Link></p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1>Your Cart</h1>
      <hr className="seam-divider" />
      <div style={{ marginTop: 20 }}>
        {items.map((item) => (
          <div key={item.productId} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #e4ddcc' }}>
            <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, background: 'var(--off-white)' }} />
            <div style={{ flex: 1 }}>
              <div>{item.name}</div>
              <span className="price">Rs {item.price.toLocaleString()}</span>
            </div>
            <input
              type="number"
              min={1}
              value={item.qty}
              onChange={(e) => updateQty(item.productId, Number(e.target.value))}
              style={{ width: 56, padding: 6, border: '1px solid #d8d2c4', borderRadius: 6 }}
            />
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => removeItem(item.productId)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 20, alignItems: 'baseline' }}>
        <span>Subtotal</span>
        <span className="price" style={{ fontSize: 20 }}>Rs {subtotal.toLocaleString()}</span>
      </div>
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <button className="btn btn-primary" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  );
}
