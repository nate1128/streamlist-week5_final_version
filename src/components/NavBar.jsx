// src/components/NavBar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/StreamList1.png";
import stageLights from "../assets/stage-lights.png";
import { useAuth } from "../auth/AuthContext";

export default function NavBar() {
  const location = useLocation();
  const { isAuthed, logout } = useAuth();

  const LOGO_WIDTH_PX = 356;
  const GAP_BELOW_TAGLINE_PX = 12;

  const getThemeClass = (pathname) => {
    if (pathname.startsWith("/movies")) return "theme-red";
    if (pathname.startsWith("/shop")) return "theme-yellow";
    if (pathname.startsWith("/about")) return "theme-blue";
    return "theme-white";
  };

  useEffect(() => {
    const theme = getThemeClass(location.pathname);
    const allThemes = ["theme-white", "theme-red", "theme-yellow", "theme-blue"];

    document.body.classList.remove(...allThemes);
    document.body.classList.add(theme);

    return () => {
      document.body.classList.remove(theme);
    };
  }, [location.pathname]);

  const rightColStyle = {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 24,
  };

  const logoutBtnStyle = {
    padding: "8px 14px",
    borderRadius: 12,
    cursor: "pointer",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "inherit",
  };

  return (
    <header
      className="nav"
      role="banner"
      aria-label="Site header"
      style={{ display: "flex", alignItems: "flex-start" }}
    >
      <div className="nav-inner nav-col" style={{ paddingLeft: 12 }}>
        <div className="brand-col">
          <NavLink to="/" className="brand-logo-link" aria-label="StreamList Home">
            <img
              src={logo}
              alt="StreamList"
              className="brand-logo"
              draggable="false"
              style={{
                width: LOGO_WIDTH_PX,
                height: "auto",
                display: "block",
                marginTop: 15,
                marginBottom: 1,
                marginLeft: 40,
              }}
              decoding="async"
            />
          </NavLink>

          <div
            className="brand-tagline"
            style={{
              position: "relative",
              top: 20,
              marginBottom: GAP_BELOW_TAGLINE_PX,
              lineHeight: 1.25,
              maxWidth: LOGO_WIDTH_PX,
              marginLeft: 60,
              whiteSpace: "normal",
              fontSize: "1.5rem",
            }}
          >
            An EZTechMovie Experience
          </div>

          <div className="nav-stage-wrapper">
            <img
              src={stageLights}
              alt="Stage lights"
              className="stage-lights"
              draggable="false"
              decoding="async"
            />

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

      {/* RIGHT SIDE: Logout only */}
      <div style={rightColStyle}>
        {isAuthed ? (
          <button
            onClick={logout}
            className="btn btn-logout"
            style={logoutBtnStyle}
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="btn btn-login"
            style={{ padding: "8px 14px", borderRadius: 12 }}
          >
            Sign in
          </NavLink>
        )}
      </div>
    </header>
  );
}