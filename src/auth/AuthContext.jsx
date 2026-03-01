// src/auth/AuthContext.jsx
import React from "react";
import { googleLogout } from "@react-oauth/google"; // safe to call inside try/catch

const AuthContext = React.createContext(null);

const STORAGE_KEY = "eztech_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  });

  const login = React.useCallback((userObj) => {
    setUser(userObj);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
    } catch (e) {
      console.warn("Failed to persist auth user to localStorage", e);
    }
  }, []);

  const logout = React.useCallback(() => {
    // Attempt to clear Google session if the library is available.
    try {
      googleLogout();
    } catch (e) {
      // googleLogout may throw if library not loaded or not available in this context.
      // We still proceed to clear local state and storage.
      // eslint-disable-next-line no-console
      console.warn("googleLogout() failed or not available", e);
    }

    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to remove auth user from localStorage", e);
    }
  }, []);

  const value = React.useMemo(() => {
    return { user, isAuthed: Boolean(user), login, logout };
  }, [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}