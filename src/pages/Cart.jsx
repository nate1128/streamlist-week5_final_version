// src/pages/Cart.jsx
import React from "react";
import { useCart, actions } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";
import CartItemRow from "../cart/components/CartItemRow";
import "../cart/cart.css";

export default function Cart() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <section className="cart-page" style={{ padding: 16 }}>
      <h1>Your Cart</h1>

      <div className="cart-table">
        <div className="cart-row cart-head">
          <div className="cell name">Item</div>
          <div className="cell qty">Qty</div>
          <div className="cell price">Price</div>
          <div className="cell total">Line Total</div>
        </div>

        {state.items.length === 0 ? (
          <div className="cart-empty">Your cart is empty.</div>
        ) : (
          state.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))
        )}
      </div>

      <footer className="cart-footer">
        {/* Totals row aligned under table columns */}
        <div className="cart-footer-grid">
          <div className="cell cell-item"></div>

          <div className="cell cell-qty">
            <div className="cart-footer-kv">
              <span className="kv-label">Items:</span>
              <span className="kv-value">{state.itemCount}</span>
            </div>
          </div>

          <div className="cell cell-price"></div>

          <div className="cell cell-total">
            <div className="cart-footer-kv total">
              <span className="kv-label">Total:</span>
              <span className="kv-value">${state.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons: Continue Shopping | Clear Cart | Checkout */}
        <div className="cart-footer-actions">
          <button
            className="navlike-btn"
            onClick={() => navigate("/shop")}
            title="Return to the shop"
          >
            <span className="material-icons btn-icon">arrow_back</span>
            <span>Continue Shopping</span>
          </button>

          <button
            className="navlike-btn danger"
            onClick={() => dispatch(actions.clearCart())}
            disabled={state.items.length === 0}
            title="Remove all items from the cart"
          >
            <span className="material-icons btn-icon danger">delete</span>
            <span>Clear Cart</span>
          </button>

          <button
            className="navlike-btn navlike-primary"
            onClick={handleCheckout}
            disabled={state.items.length === 0}
            title={
              state.items.length === 0 ? "Add items first" : "Proceed to checkout"
            }
          >
            <span className="material-icons btn-icon success">attach_money</span>
            <span>Checkout</span>
          </button>
        </div>
      </footer>
    </section>
  );
}