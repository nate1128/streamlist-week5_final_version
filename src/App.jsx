// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import StreamList from "./pages/StreamList";
import Movies from "./pages/Movies";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Shop from "./cart/Shop";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<StreamList />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />

            {/* Shop mounted on both paths */}
            <Route path="/shop" element={<Shop />} />
            <Route path="/store" element={<Shop />} />

            {/* Catch-all: redirect unknown routes to /shop */}
            <Route path="*" element={<Navigate to="/shop" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} StreamList</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;