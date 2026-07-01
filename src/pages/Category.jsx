import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../lib/client';
import ProductCard from '../components/ProductCard';

const LABELS = {
  TAPE_BALL: 'Tape Ball Cricket',
  HARD_BALL: 'Hard Ball Cricket',
  ACCESSORIES: 'Accessories',
};

export default function Category() {
  const { key } = useParams();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    setProducts(null);
    client.models.Product.list({ filter: { category: { eq: key } } }).then(({ data }) => {
      setProducts(data || []);
    });
  }, [key]);

  return (
    <div className="container">
      <h1 style={{ margin: '32px 0 8px' }}>{LABELS[key] || key}</h1>
      <hr className="seam-divider" />
      {products === null ? (
        <p className="empty-state">Loading...</p>
      ) : products.length === 0 ? (
        <p className="empty-state">Nothing listed in this category yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
