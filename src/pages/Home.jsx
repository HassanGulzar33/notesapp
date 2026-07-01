import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../lib/client';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key: 'TAPE_BALL', label: 'Tape Ball', tag: 'Street & club' },
  { key: 'HARD_BALL', label: 'Hard Ball', tag: 'Leather & willow' },
  { key: 'ACCESSORIES', label: 'Accessories', tag: 'Bags, kits & more' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    client.models.Product.list({ filter: { featured: { eq: true } } }).then(({ data }) => {
      setFeatured(data || []);
    });
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="tag" style={{ color: 'var(--willow-tan)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontSize: 13 }}>
            Est. for the pitch and the street
          </span>
          <h1>Gear for every over, every format.</h1>
          <p className="lede">
            Tape-ball kits for the street game, full hard-ball gear for the club and academy.
            One store, honest prices, cash on delivery.
          </p>
          <div className="actions">
            <Link to="/category/TAPE_BALL" className="btn btn-primary">Shop Tape Ball</Link>
            <Link to="/category/HARD_BALL" className="btn btn-ghost">Shop Hard Ball</Link>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.key} to={`/category/${c.key}`} className="category-tile">
              <span className="tag">{c.tag}</span>
              <h3>{c.label}</h3>
            </Link>
          ))}
        </div>

        <hr className="seam-divider" />

        <section>
          <div className="section-title">
            <h2 style={{ fontSize: 24 }}>Featured</h2>
          </div>
          {featured.length === 0 ? (
            <p className="empty-state">No featured products yet — add some in the database with `featured: true`.</p>
          ) : (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
