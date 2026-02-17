// src/cart/components/WarningBanner.jsx
import React from 'react';

export default function WarningBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="cart-warning" role="status" aria-live="polite">
      <span>⚠️ {message}</span>
      <button className="cart-btn-ghost" onClick={onClose} aria-label="Dismiss warning">✕</button>
    </div>
  );
}