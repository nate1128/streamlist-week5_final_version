// src/cart/SubscriptionsList.jsx
import React from 'react';
import { subscriptions } from './data';
import { useCart, actions } from './CartContext';
import WarningBanner from './components/WarningBanner';

export default function SubscriptionsList() {
  const { state, dispatch } = useCart();
  const hasSubscription = state.items.some(i => i.type === 'subscription');

  return (
    <section className="cart-section">
      <h2>Subscriptions</h2>

      <WarningBanner
        message={state.lastWarning}
        onClose={() => dispatch(actions.clearWarning())}
      />

      <div className="cart-stack">
        {subscriptions.map((sub) => {
          const iconName = (sub.icon ?? '').trim() || 'handyman';
          const alreadyInCart = state.items.find(i => i.id === sub.id);
          const disabled = hasSubscription && !alreadyInCart;

          return (
            <button
              key={sub.id}
              type="button"
              className="stack-row-btn"
              onClick={() => dispatch(actions.addItem(sub))}
              disabled={disabled}
              aria-label={disabled ? 'Only one subscription allowed' : `Add ${sub.name} subscription`}
              title={disabled ? 'Only one subscription allowed at a time' : `Add ${sub.name}`}
            >
              {/* Col 1: icon in YELLOW pill */}
              <span className="stack-col icon">
                <span className="icon-pill icon-pill--subscription" aria-hidden="true">
                  <span className="material-icons">{iconName}</span>
                </span>
              </span>

              {/* Col 2: name + description */}
              <span className="stack-col text">
                <span className="stack-title">
                  {sub.name}
                  <span className="stack-chip">Subscription</span>
                </span>
                <span className="stack-desc">{sub.description}</span>
              </span>

              {/* Col 3: price (per month) */}
              <span className="stack-col price">
                ${sub.price.toFixed(2)}/mo
              </span>

              {/* Col 4: CTA chip */}
              <span className="stack-col cta">
                {disabled ? '1 at a time' : 'Add'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}