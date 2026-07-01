import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { client } from '../lib/client';

const SHIPPING_FEE = 200; // flat rate, adjust as needed

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="container">
        <p className="empty-state">Please <a href="/login">sign in</a> to check out.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="container"><p className="empty-state">Your cart is empty.</p></div>;
  }

  const total = subtotal + SHIPPING_FEE;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.address || !form.city) {
      setError('Please fill in all shipping details.');
      return;
    }
    setSubmitting(true);
    try {
      const { data: order, errors } = await client.models.Order.create({
        items: JSON.stringify(items),
        subtotal,
        shippingFee: SHIPPING_FEE,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        orderStatus: 'PLACED',
        shippingName: form.name,
        shippingPhone: form.phone,
        shippingAddress: form.address,
        shippingCity: form.city,
      });
      if (errors) throw new Error(errors[0]?.message || 'Could not place order');

      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/orders?placed=${order.id}`);
      } else {
        // JazzCash / Easypaisa: real redirect happens once merchant
        // credentials are wired into a backend function. For now the
        // order is recorded as pending payment.
        clearCart();
        navigate(`/orders?placed=${order.id}&pending_payment=1`);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong placing your order.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 640 }}>
      <h1>Checkout</h1>
      <hr className="seam-divider" />
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <div className="form-field">
          <label>Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-field">
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03xx-xxxxxxx" />
        </div>
        <div className="form-field">
          <label>Address</label>
          <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="form-field">
          <label>City</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>

        <div className="form-field">
          <label>Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="JAZZCASH">JazzCash</option>
            <option value="EASYPAISA">Easypaisa</option>
          </select>
        </div>

        {paymentMethod !== 'COD' && (
          <p style={{ fontSize: 13, color: '#6b6558', marginTop: -6, marginBottom: 16 }}>
            You'll be contacted with payment instructions before dispatch until online {paymentMethod === 'JAZZCASH' ? 'JazzCash' : 'Easypaisa'} checkout is fully live.
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
          <span>Subtotal</span><span className="price">Rs {subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Shipping</span><span className="price">Rs {SHIPPING_FEE.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, borderTop: '1px solid #ddd', paddingTop: 10 }}>
          <strong>Total</strong><span className="price">Rs {total.toLocaleString()}</span>
        </div>

        {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}

        <button className="btn btn-primary" style={{ width: '100%', marginTop: 20 }} disabled={submitting}>
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
