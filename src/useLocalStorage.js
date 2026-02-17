// src/cart/useLocalStorage.js
import { useEffect, useRef, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const first = useRef(true);
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / serialization issues
    }
  }, [key, value]);

  return [value, setValue];
}