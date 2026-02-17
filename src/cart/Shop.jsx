// src/cart/Shop.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import SubscriptionsList from './SubscriptionsList';
import AccessoriesList from './AccessoriesList';

export default function Shop() {
  const { state } = useCart();

  return (
    <div className="cart-page" style={{ padding: 16 }}>
      {/* Shop header bar */}
      <div className="shop-topbar">
        <h1 className="shop-title">EZTech Shop</h1>

        {/* View Cart button – matches nav link styling */}
        <Link
          to="/cart"
          className="navlike-btn shop-view-cart"
          aria-label={`View cart, ${state.itemCount} item${state.itemCount === 1 ? '' : 's'}`}
          title="View Cart"
        >
          {/* Red shopping cart icon (Material Icons, same set as elsewhere) */}
          <span className="material-icons shop-cart-icon" aria-hidden="true">shopping_cart</span>

          <span className="shop-view-cart-label">View Cart</span>

          {/* White incrementor to the right of the icon/label */}
          <span className="shop-cart-count" aria-hidden="true">{state.itemCount}</span>
        </Link>
      </div>

      <SubscriptionsList />
      <AccessoriesList />
    </div>
  );
}
