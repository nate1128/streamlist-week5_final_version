import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        {/* Row 1: Brand (title + tagline stacked) */}
        <div className="brand">
          <span className="brand-text">
            <span className="brand-stream">Stream</span>
            <span className="brand-list">List</span>
          </span>
          <span className="brand-tagline">An EZTechMovie Experience</span>
        </div>

        {/* Row 2: Links (left-aligned) */}
        <div className="links-row-right">
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
            <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
              Movies
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
              Cart
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

