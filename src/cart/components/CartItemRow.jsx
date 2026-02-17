// src/cart/components/CartItemRow.jsx
import React from 'react';
import { useCart, actions } from '../CartContext';
import { subscriptions, accessories } from '../data';

// Build a lookup for icons by product id (covers legacy items in localStorage)
const ICON_BY_ID = [...subscriptions, ...accessories].reduce((map, p) => {
  map[p.id] = (p.icon ?? '').trim();
  return map;
}, {});

export default function CartItemRow({ item }) {
  const { dispatch } = useCart();
  const isSubscription = item.type === 'subscription';

  // Normalize and select an icon:
  // 1) prefer icon on the cart item (new adds),
  // 2) else lookup from catalog by id (legacy),
  // 3) else final fallback by type.
  const iconName =
    (item.icon ?? '').trim() ||
    ICON_BY_ID[item.id] ||
    (isSubscription ? 'handyman' : 'sell');

  // Qty handlers
  const handleDecrement = () =>
    dispatch(actions.updateQty(item.id, item.qty - 1));
  const handleIncrement = () =>
    dispatch(actions.updateQty(item.id, item.qty + 1));
  const handleInput = (e) => {
    const next = parseInt(e.target.value || '1', 10);
    dispatch(actions.updateQty(item.id, Number.isFinite(next) ? next : 1));
  };

  return (
    <div className="cart-row">
      {/* 1) ITEM */}
      <div className="cell name">
        <div className="title">
          {/* Icon pill (type-colored) */}
          <span
            className={
              'product-icon-pill ' +
              (isSubscription
                ? 'product-icon-pill--subscription'
                : 'product-icon-pill--accessory')
            }
            aria-hidden="true"
          >
            <span className="material-icons">{iconName}</span>
          </span>

        {/* Name + (Subscription chip) */}
          {item.name}{' '}
          {isSubscription ? <span className="chip">Subscription</span> : null}
        </div>

        {/* Remove → styled like nav buttons via .navlike-btn */}
        <button
          type="button"
          className="navlike-btn cart-remove-btn"
          onClick={() => dispatch(actions.removeItem(item.id))}
          aria-label={`Remove ${item.name} from cart`}
          title="Remove"
        >
          Remove
        </button>
      </div>

      {/* 2) QTY (subscriptions fixed at 1) */}
      <div className="cell qty">
        {isSubscription ? (
          <span>1</span>
        ) : (
          <div className="qty-controls navlike-qty">
            {/* ORDER: + , [Qty], - */}
            <button
              type="button"
              className="navlike-btn navlike-qty-btn"
              onClick={handleIncrement}
              aria-label={`Increase ${item.name} quantity`}
              title="Increase"
            >
              +
            </button>

            <input
              aria-label={`${item.name} quantity`}
              className="navlike-qty-input"
              type="number"
              min="1"
              value={item.qty}
              onChange={handleInput}
              inputMode="numeric"
              pattern="[0-9]*"
            />

            <button
              type="button"
              className="navlike-btn navlike-qty-btn"
              onClick={handleDecrement}
              aria-label={`Decrease ${item.name} quantity`}
              title="Decrease"
            >
              –
            </button>
          </div>
        )}
      </div>

      {/* 3) PRICE */}
      <div className="cell price">${item.price.toFixed(2)}</div>

      {/* 4) LINE TOTAL */}
      <div className="cell total">
        ${(item.price * item.qty).toFixed(2)}
      </div>
    </div>
  );
}