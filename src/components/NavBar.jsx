// src/components/NavBar.jsx
import { NavLink } from "react-router-dom";
// Optional badge: uncomment the next two lines if you want a live count next to “Cart”
// import { useCart } from "../cart/CartContext";

export default function NavBar() {
  // const { state } = useCart();

  return (
    <header className="nav">
      <div className="nav-inner">
        {/* Brand */}
        <div className="brand">
          <span className="brand-text">
            <span className="brand-stream">Stream</span>
            <span className="brand-list">List</span>
          </span>
          <span className="brand-tagline">An EZTechMovie Experience</span>
        </div>

        {/* Links */}
        <div className="links-row-right">
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
            <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>Movies</NavLink>

            {/* Cart → /shop */}
            <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>
              Cart
              {/* Optional count badge:
              <span
                aria-label={`${state.itemCount} items in cart`}
                title={`${state.itemCount} items`}
                style={{
                  marginLeft: 6, background: 'var(--cart-primary, #5bc0be)', color: '#08213a',
                  borderRadius: 999, padding: '2px 6px', fontSize: 12, fontWeight: 700
                }}
              >
                {state.itemCount}
              </span> */}
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}