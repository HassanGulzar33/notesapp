import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { count } = useCart();
  const { user, doSignOut } = useAuth();

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand">Tape &amp; Willow</Link>
        <nav>
          <Link to="/category/TAPE_BALL">Tape Ball</Link>
          <Link to="/category/HARD_BALL">Hard Ball</Link>
          <Link to="/category/ACCESSORIES">Accessories</Link>
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              <button className="btn btn-ghost" onClick={doSignOut}>Sign Out</button>
            </>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
          <Link to="/cart">
            Cart{count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </nav>
      </div>
      <hr className="seam-divider" style={{ marginTop: 16 }} />
    </header>
  );
}
