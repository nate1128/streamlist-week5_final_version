// src/components/NavBar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/StreamList1.png"; // your logo in src/assets
import stageLights from "../assets/stage-lights.png"; // stage lights image in src/assets

export default function NavBar() {
  const location = useLocation();

  // Fine-tune here without touching CSS files:
  const RIGHT_NUDGE_PX = 24;        // (unused right now, keeping for future)
  const LOGO_WIDTH_PX = 356;        // a few points larger than ~120px
  const GAP_BELOW_TAGLINE_PX = 12;  // extra space between tagline and buttons

  // Route -> theme class for page-wide glow
  const getThemeClass = (pathname) => {
    if (pathname.startsWith("/movies")) return "theme-red";
    if (pathname.startsWith("/shop")) return "theme-yellow";
    if (pathname.startsWith("/about")) return "theme-blue";
    return "theme-white"; // Home + default
  };

  // Apply theme to body so ALL pages can inherit glow variables
  useEffect(() => {
    const theme = getThemeClass(location.pathname);
    const allThemes = ["theme-white", "theme-red", "theme-yellow", "theme-blue"];

    document.body.classList.remove(...allThemes);
    document.body.classList.add(theme);

    // cleanup not strictly necessary, but safe
    return () => {
      document.body.classList.remove(theme);
    };
  }, [location.pathname]);

  return (
    <header className="nav" role="banner" aria-label="Site header">
      {/* nav-inner acts as a left-aligned column container */}
      <div
        className="nav-inner nav-col"
        // Nudge the entire brand block (logo + tagline + links) to the right
        style={{ paddingLeft: 12 }}
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
              style={{
                width: LOGO_WIDTH_PX,
                height: "auto",
                display: "block",
                marginTop: 15,
                marginBottom: 1,
                marginLeft: 40, // keep your current tweak
              }}
              decoding="async"
            />
          </NavLink>

          {/* Tagline fits under the logo width */}
          <div
            className="brand-tagline"
            style={{
              position: "relative",
              top: 20, // keep your current tweak
              marginBottom: GAP_BELOW_TAGLINE_PX,
              lineHeight: 1.25,
              maxWidth: LOGO_WIDTH_PX,
              marginLeft: 60, // keep your current tweak
              whiteSpace: "normal",
              fontSize: "1.5rem",
            }}
          >
            An EZTechMovie Experience
          </div>

          {/* Stage lights + Links wrapper */}
          <div className="nav-stage-wrapper">
            <img
              src={stageLights}
              alt="Stage lights"
              className="stage-lights"
              draggable="false"
              decoding="async"
            />

            {/* Links: row BELOW the tagline, left-aligned */}
            <nav
              className="nav-links nav-links--under"
              aria-label="Primary navigation"
              role="navigation"
              style={{ marginTop: 3, marginLeft: 24, justifyContent: "flex-start" }}
            >
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? "active home" : "home")}
              >
                Home
              </NavLink>

              <NavLink
                to="/movies"
                className={({ isActive }) => (isActive ? "active movies" : "movies")}
              >
                Movies
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) => (isActive ? "active cart" : "cart")}
              >
                Cart
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active about" : "about")}
              >
                About
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}