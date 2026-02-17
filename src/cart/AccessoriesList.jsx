// src/cart/AccessoriesList.jsx
import React from 'react';
import { accessories } from './data';
import { useCart, actions } from './CartContext';

export default function AccessoriesList() {
  const { dispatch } = useCart();

  return (
    <section className="cart-section">
      <h2>Accessories</h2>

      <div className="cart-stack">
        {accessories.map((acc) => {
          const iconName = (acc.icon ?? '').trim() || 'sell';
          return (
            <button
              key={acc.id}
              type="button"
              className="stack-row-btn"
              onClick={() => dispatch(actions.addItem(acc))}
              aria-label={`Add ${acc.name} to cart`}
              title={`Add ${acc.name} to cart`}
            >
              {/* Col 1: icon in TEAL pill */}
              <span className="stack-col icon">
                <span className="icon-pill icon-pill--accessory" aria-hidden="true">
                  <span className="material-icons">{iconName}</span>
                </span>
              </span>

              {/* Col 2: name + description */}
              <span className="stack-col text">
                <span className="stack-title">{acc.name}</span>
                <span className="stack-desc">{acc.description}</span>
              </span>

              {/* Col 3: price */}
              <span className="stack-col price">
                ${acc.price.toFixed(2)}
              </span>

              {/* Col 4: CTA chip (explicit affordance even though whole row is clickable) */}
              <span className="stack-col cta">
                Add to Cart
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}