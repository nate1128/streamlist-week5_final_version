// src/components/NavBar.jsx
import { NavLink } from "react-router-dom";
import logo from "../assets/StreamList1.png"; // <-- your logo in src/assets

export default function NavBar() {
  // Fine-tune here without touching CSS files:
  const RIGHT_NUDGE_PX = 24;        // ~1/4 inch on standard DPI
  const LOGO_WIDTH_PX = 356;        // a few points larger than ~120px
  const GAP_BELOW_TAGLINE_PX = 12;  // extra space between tagline and buttons

  return (
    <header className="nav" role="banner" aria-label="Site header">
      {/* nav-inner acts as a left-aligned column container */}
      <div
        className="nav-inner nav-col"
        // Nudge the entire brand block (logo + tagline + links) to the right
        style={{ paddingLeft: RIGHT_NUDGE_PX + 12 }}
      >
        {/* Brand: logo (top) + tagline (below) */}
        <div className="brand-col">
          <NavLink to="/" className="brand-logo-link" aria-label="StreamList Home">
            <img
              src={logo}
              alt="StreamList"
              className="brand-logo"
              draggable="false"
              // Slightly larger logo
              style={{ width: LOGO_WIDTH_PX, height: "auto", display: "block", marginTop: 15, marginBottom: 1 }}
              decoding="async"
            />
          </NavLink>

          {/* Tagline fits under the logo width */}
          <div
            className="brand-tagline"
            style={{
              marginTop: .125,
              marginBottom: GAP_BELOW_TAGLINE_PX, // more room before the buttons
              lineHeight: 1.25,
              maxWidth: LOGO_WIDTH_PX,            // aligns visually under the logo
              marginLeft: 24, 
              whiteSpace: "normal",
              fontSize: "1.5rem"
            }}
          >
            An EZTechMovie Experience
          </div>

          {/* Links: row BELOW the tagline, left-aligned */}
          <nav
            className="nav-links nav-links--under"
            aria-label="Primary navigation"
            role="navigation"
            // Keep the row left-aligned and add a touch more separation if needed
            style={{ marginTop: 3, marginLeft: 24, justifyContent: "flex-start" }}
          >
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
            <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
              Movies
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>
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