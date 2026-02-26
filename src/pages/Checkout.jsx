// src/pages/Checkout.jsx
import React from "react";
import "../cart/cart.css";

const STORAGE_KEY = "eztech_saved_cards";

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(" ");
}

function isValidCardNumber(value) {
  return /^\d{4} \d{4} \d{4} \d{4}$/.test(value);
}

function formatCvc(value) {
  return value.replace(/\D/g, "").slice(0, 3);
}

function isValidCvc(value) {
  return /^\d{3}$/.test(value);
}

export default function Checkout() {
  const [nameOnCard, setNameOnCard] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cvc, setCvc] = React.useState("");
  const [exp, setExp] = React.useState("");
  const [zip, setZip] = React.useState("");

  const [savedCards, setSavedCards] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const saveCard = (e) => {
    e.preventDefault();

    if (!isValidCardNumber(cardNumber)) {
      alert("Card number must match 1234 5678 9012 3456.");
      return;
    }

    if (!isValidCvc(cvc)) {
      alert("CVC must be exactly 3 digits.");
      return;
    }

    const last4 = cardNumber.replace(/\s/g, "").slice(-4);

    const newCard = {
      id: crypto.randomUUID(),
      nameOnCard: nameOnCard.trim(),
      cardNumberFormatted: cardNumber,
      last4,
      cvc,
      exp: exp.trim(),
      zip: zip.trim(),
      createdAt: new Date().toISOString(),
    };

    const next = [newCard, ...savedCards];
    setSavedCards(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    setNameOnCard("");
    setCardNumber("");
    setCvc("");
    setExp("");
    setZip("");

    alert("Card saved to localStorage.");
  };

  const removeCard = (id) => {
    const next = savedCards.filter((c) => c.id !== id);
    setSavedCards(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const completePurchase = () => {
    alert("Complete Purchase (demo).");
  };

  return (
    <section className="cart-page checkout-page" style={{ padding: 16 }}>
      <h1>Checkout</h1>
      <p className="cart-muted">
        Enter your card information and save it to localStorage.
      </p>

      <form onSubmit={saveCard} className="checkout-form">
        <label className="checkout-field">
          <span className="checkout-label">Name on card</span>
          <input
            className="navlike-qty-input checkout-input"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            required
            autoComplete="cc-name"
          />
        </label>

        <label className="checkout-field">
          <span className="checkout-label">Card number</span>
          <input
            className="navlike-qty-input checkout-input"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            required
            autoComplete="cc-number"
          />
        </label>

        <div className="checkout-row-half">
          <label className="checkout-field">
            <span className="checkout-label">CVC</span>
            <input
              className="navlike-qty-input checkout-input"
              value={cvc}
              onChange={(e) => setCvc(formatCvc(e.target.value))}
              placeholder="123"
              inputMode="numeric"
              required
              autoComplete="cc-csc"
            />
          </label>

          <label className="checkout-field">
            <span className="checkout-label">Expiration</span>
            <input
              className="navlike-qty-input checkout-input"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              placeholder="MM/YY"
              required
              autoComplete="cc-exp"
            />
          </label>
        </div>

        <label className="checkout-field">
          <span className="checkout-label">Billing ZIP</span>
          <input
            className="navlike-qty-input checkout-input"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="12345"
            inputMode="numeric"
            required
            autoComplete="postal-code"
          />
        </label>

        <div className="checkout-actions">
          <button type="submit" className="navlike-btn navlike-primary">
            <span className="material-icons btn-icon icon-yellow">
              credit_card
            </span>
            <span>Save Card</span>
          </button>

          <button
            type="button"
            className="navlike-btn"
            onClick={completePurchase}
          >
            <span className="material-icons btn-icon icon-green">
              shopping_cart_checkout
            </span>
            <span>Complete Purchase</span>
          </button>
        </div>
      </form>

      <hr style={{ margin: "24px 0", opacity: 0.25 }} />

      <h2>Saved cards</h2>
      {savedCards.length === 0 ? (
        <p className="cart-muted">No cards saved yet.</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {savedCards.map((c) => (
            <li key={c.id} style={{ marginBottom: 10 }}>
              <div>
                <strong>{c.nameOnCard}</strong> ending in {c.last4} exp {c.exp}
              </div>
              <button
                className="navlike-btn danger"
                onClick={() => removeCard(c.id)}
                type="button"
                style={{ marginTop: 8 }}
              >
                <span className="material-icons btn-icon danger">delete</span>
                <span>Remove</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="cart-muted" style={{ marginTop: 18, fontSize: 12 }}>
        Note: This stores data in localStorage because the assignment requires it.
      </p>
    </section>
  );
}