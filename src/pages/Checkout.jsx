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

  // Inline error state for fields
  const [cardError, setCardError] = React.useState("");
  const [cvcError, setCvcError] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState("");

  const [savedCards, setSavedCards] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    if (saveSuccess) {
      const t = setTimeout(() => setSaveSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [saveSuccess]);

  const saveCard = (e) => {
    e.preventDefault();

    // Validate card number
    if (!isValidCardNumber(cardNumber)) {
      setCardError("Invalid card number. Format must be XXXX XXXX XXXX XXXX.");
      return;
    } else {
      setCardError("");
    }

    // Validate CVC
    if (!isValidCvc(cvc)) {
      setCvcError("CVC must be exactly 3 digits.");
      return;
    } else {
      setCvcError("");
    }

    const last4 = cardNumber.replace(/\s/g, "").slice(-4);

    const newCard = {
      id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}`,
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaveSuccess("Card saved to localStorage.");
    } catch (e) {
      setSaveSuccess("Saved locally (UI only).");
      // console.warn("LocalStorage write failed", e);
    }

    // Clear inputs
    setNameOnCard("");
    setCardNumber("");
    setCvc("");
    setExp("");
    setZip("");
  };

  const removeCard = (id) => {
    const next = savedCards.filter((c) => c.id !== id);
    setSavedCards(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // console.warn("LocalStorage remove failed", e);
    }
  };

  const completePurchase = () => {
    // Minimal demo behavior for presentation
    setSaveSuccess("Purchase completed (demo).");
    setTimeout(() => setSaveSuccess(""), 2500);
  };

  return (
    <section className="cart-page checkout-page" style={{ padding: 16 }}>
      <h1>Checkout</h1>
      <p className="cart-muted">Enter your card information and save it to localStorage.</p>

      <form onSubmit={saveCard} className="checkout-form" noValidate>
        <label className="checkout-field">
          <span className="checkout-label">Name on card</span>
          <input
            className="navlike-qty-input checkout-input"
            value={nameOnCard}
            onChange={(e) => {
              setNameOnCard(e.target.value);
            }}
            required
            autoComplete="cc-name"
          />
        </label>

        <label className="checkout-field">
          <span className="checkout-label">Card number</span>
          <input
            className={`navlike-qty-input checkout-input ${cardError ? "input-error" : ""}`}
            value={cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setCardNumber(formatted);
              if (cardError) setCardError("");
            }}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            required
            autoComplete="cc-number"
            aria-invalid={!!cardError}
            aria-describedby={cardError ? "card-error" : undefined}
          />
          {cardError && (
            <div id="card-error" className="error-message" role="alert">
              {cardError}
            </div>
          )}
        </label>

        <div className="checkout-row-half">
          <label className="checkout-field">
            <span className="checkout-label">CVC</span>
            <input
              className={`navlike-qty-input checkout-input ${cvcError ? "input-error" : ""}`}
              value={cvc}
              onChange={(e) => {
                const v = formatCvc(e.target.value);
                setCvc(v);
                if (cvcError) setCvcError("");
              }}
              placeholder="123"
              inputMode="numeric"
              required
              autoComplete="cc-csc"
              aria-invalid={!!cvcError}
              aria-describedby={cvcError ? "cvc-error" : undefined}
            />
            {cvcError && (
              <div id="cvc-error" className="error-message" role="alert">
                {cvcError}
              </div>
            )}
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

        <div className="checkout-actions" style={{ marginTop: 12 }}>
          <button type="submit" className="navlike-btn navlike-primary">
            <span className="material-icons btn-icon icon-yellow">credit_card</span>
            <span>Save Card</span>
          </button>

          <button type="button" className="navlike-btn" onClick={completePurchase} style={{ marginLeft: 8 }}>
            <span className="material-icons btn-icon icon-green">shopping_cart_checkout</span>
            <span>Complete Purchase</span>
          </button>

          {saveSuccess && (
            <span style={{ marginLeft: 12, color: "#9fe5a8", fontWeight: 600 }}>{saveSuccess}</span>
          )}
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