// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './cart/CartContext';
import './cart/cart.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './auth/AuthContext';

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";


const root = ReactDOM.createRoot(document.getElementById('root'));

console.log("CLIENT ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

reportWebVitals();