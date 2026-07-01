import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { client } from '../lib/client';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [params] = useSearchParams();
  const placedId = params.get('placed');

  useEffect(() => {
    if (!user) return;
    client.models.Order.list().then(({ data }) => {
      const sorted = [...(data || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    });
  }, [user]);

  if (!user) return <div className="container"><p className="empty-state">Please sign in to view your orders.</p></div>;

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1>My Orders</h1>
      <hr className="seam-divider" />
      {placedId && (
        <p style={{ background: 'var(--off-white)', padding: 14, borderRadius: 6, marginTop: 16 }}>
          Order placed! Thanks — we'll be in touch to confirm delivery{params.get('pending_payment') ? ' and payment' : ''}.
        </p>
      )}
      {orders === null ? (
        <p className="empty-state">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="empty-state">No orders yet.</p>
      ) : (
        <div style={{ marginTop: 20 }}>
          {orders.map((o) => {
            const items = JSON.parse(o.items);
            return (
              <div key={o.id} style={{ border: '1px solid #e4ddcc', borderRadius: 6, padding: 16, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 13, color: '#6b6558' }}>
                  <span>#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span>{o.orderStatus}</span>
                </div>
                <ul style={{ margin: '10px 0', paddingLeft: 18 }}>
                  {items.map((it, idx) => (
                    <li key={idx}>{it.name} × {it.qty}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{o.paymentMethod} · {o.paymentStatus}</span>
                  <span className="price">Rs {o.total.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
