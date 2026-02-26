// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import StreamList from "./pages/StreamList";
import Movies from "./pages/Movies";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Shop from "./cart/Shop";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/*"
            element={
              <div className="app-shell">
                <NavBar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<StreamList />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/store" element={<Shop />} />
                    <Route path="*" element={<Navigate to="/movies" replace />} />
                  </Routes>
                </main>
                <footer className="footer">
                  <p>© {new Date().getFullYear()} StreamList</p>
                </footer>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;