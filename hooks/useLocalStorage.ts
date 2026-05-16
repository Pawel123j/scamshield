"use client";

import { useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);
  const [value, setValue] = useState<T>(initialValue);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      setValue(initialRef.current);
    } finally {
      setHasLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [hasLoaded, key, value]);

  return [value, setValue, hasLoaded] as const;
}
