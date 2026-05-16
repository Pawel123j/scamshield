"use client";

import { useEffect, useRef, useState } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/localStorage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);
  const [value, setValue] = useState<T>(initialValue);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setValue(getLocalStorageItem<T>(key, initialRef.current));
    setHasLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    setLocalStorageItem(key, value);
  }, [hasLoaded, key, value]);

  return [value, setValue, hasLoaded] as const;
}
