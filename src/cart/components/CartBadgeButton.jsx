// src/cart/components/CartBadgeButton.jsx
import React from 'react';
import { useCart } from '../CartContext';

export default function CartBadgeButton({ onClick }) {
  const { state } = useCart();
  return (
    <button className="cart-badge-btn" onClick={onClick} aria-label={`Cart with ${state.itemCount} items`}>
      🛒 <span className="cart-badge">{state.itemCount}</span>
    </button>
  );
}
