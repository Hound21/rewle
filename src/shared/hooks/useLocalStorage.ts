import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (nextValue: T) => {
      setValue(nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    },
    [key]
  );

  return [value, setStoredValue];
}
