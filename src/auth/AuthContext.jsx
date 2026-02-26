import React from "react";

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

  const login = (userObj) => {
    setUser(userObj);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = React.useMemo(() => {
    return { user, isAuthed: Boolean(user), login, logout };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}