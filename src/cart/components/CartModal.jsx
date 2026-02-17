// src/cart/components/CartModal.jsx
import React from "react";
import { useCart, actions } from "../CartContext";
import CartItemRow from "./CartItemRow";

export default function CartModal({ onClose }) {
  const { state, dispatch } = useCart();

  return (
    <div
      className="cart-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      onClick={(e) => {
        if (e.target.classList.contains("cart-overlay")) onClose?.();
      }}
    >
      <div className="cart-modal" role="document">
        {/* Header */}
        <header className="cart-header">
          <h3>Your Cart</h3>
          <button
            className="cart-btn-ghost"
            onClick={onClose}
            aria-label="Close cart"
            title="Close"
          >
            ✕
          </button>
        </header>

        {/* Table */}
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
            state.items.map((item) => <CartItemRow key={item.id} item={item} />)
          )}
        </div>

        {/* Footer / Summary */}
        <footer className="cart-footer">
          {/* Grid that mirrors the table columns: Item | Qty | Price | Line Total */}
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

          {/* Actions row aligned to the right; uses the same "nav-like" look */}
          <div className="cart-footer-actions">
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
              disabled={state.items.length === 0}
              title={state.items.length === 0 ? "Add items first" : "Proceed to checkout"}
            >
              <span className="material-icons btn-icon success">attach_money</span>
              <span>Checkout</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}