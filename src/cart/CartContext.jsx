// src/cart/CartContext.jsx
import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { useLocalStorage } from './useLocalStorage';

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

// Actions
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QTY = 'UPDATE_QTY';
const CLEAR_CART = 'CLEAR_CART';
const CLEAR_WARNING = 'CLEAR_WARNING';

function cartReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM: {
      const item = action.payload;
      const hasSubscription = state.items.some(i => i.type === 'subscription');
      const isSubscription = item.type === 'subscription';

      if (isSubscription && hasSubscription) {
        return { ...state, lastWarning: 'Only one subscription can be in the cart at a time.' };
      }

      const idx = state.items.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        const existing = state.items[idx];
        // Accessories increment; subscription stays 1
        if (existing.type === 'accessory') {
          const items = state.items.map((i, k) => (k === idx ? { ...i, qty: i.qty + 1 } : i));
          return { items, lastWarning: null };
        }
        // If subscription already exists (same id), do nothing
        return { ...state, lastWarning: null };
      }

      const items = [...state.items, { ...item, qty: item.type === 'subscription' ? 1 : 1 }];
      return { items, lastWarning: null };
    }

    case REMOVE_ITEM: {
      const id = action.payload;
      return { items: state.items.filter(i => i.id !== id), lastWarning: null };
    }

    case UPDATE_QTY: {
      const { id, qty } = action.payload;
      const items = state.items.map(i => {
        if (i.id !== id) return i;
        if (i.type === 'subscription') return i; // subscription qty fixed at 1
        const next = Math.max(1, Number.isFinite(qty) ? qty : 1);
        return { ...i, qty: next };
      });
      return { items, lastWarning: null };
    }

    case CLEAR_CART:
      return { items: [], lastWarning: null };

    case CLEAR_WARNING:
      return { ...state, lastWarning: null };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [persisted, setPersisted] = useLocalStorage('cart-v1', { items: [], lastWarning: null });

  const [state, baseDispatch] = useReducer(cartReducer, persisted);

  // Wrap dispatch to also update localStorage
  const dispatch = (action) => {
    const next = cartReducer(state, action);
    setPersisted(next);
    baseDispatch(action);
  };

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.qty, 0),
    [state.items]
  );
  const totalPrice = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [state.items]
  );

  const value = useMemo(() => ({ ...state, itemCount, totalPrice }), [state, itemCount, totalPrice]);

  return (
    <CartStateContext.Provider value={value}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCart() {
  const state = useContext(CartStateContext);
  const dispatch = useContext(CartDispatchContext);
  if (!state || !dispatch) throw new Error('useCart must be used within CartProvider');
  return { state, dispatch };
}

export const actions = {
  addItem: (product) => ({ type: ADD_ITEM, payload: product }),
  removeItem: (id) => ({ type: REMOVE_ITEM, payload: id }),
  updateQty: (id, qty) => ({ type: UPDATE_QTY, payload: { id, qty } }),
  clearCart: () => ({ type: CLEAR_CART }),
  clearWarning: () => ({ type: CLEAR_WARNING }),
};