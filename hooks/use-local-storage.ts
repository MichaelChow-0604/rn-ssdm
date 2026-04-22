import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UseLocalStorageResult<T> {
  value: T | undefined;
  isLoading: boolean;
  set: (next: T | ((prev: T | undefined) => T)) => Promise<void>;
  update: (updater: Partial<T> | ((prev: T | undefined) => T)) => Promise<void>;
  delete: () => Promise<void>;
  remove: () => Promise<void>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): UseLocalStorageResult<T> {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!mounted) return;

        if (raw != null) {
          try {
            setValue(JSON.parse(raw) as T);
          } catch {
            // Corrupt/non-JSON value: repair it
            if (initialValue !== undefined) {
              await AsyncStorage.setItem(key, JSON.stringify(initialValue));
              if (mounted) setValue(initialValue);
            } else {
              await AsyncStorage.removeItem(key);
              if (mounted) setValue(undefined);
            }
          }
        } else if (initialValue !== undefined) {
          await AsyncStorage.setItem(key, JSON.stringify(initialValue));
          if (mounted) setValue(initialValue);
        } else {
          setValue(undefined);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [key, initialValue]);

  const set = useCallback<UseLocalStorageResult<T>["set"]>(
    async (next) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T | undefined) => T)(value)
          : (next as T);
      await AsyncStorage.setItem(key, JSON.stringify(resolved));
      setValue(resolved);
    },
    [key, value]
  );

  const update = useCallback<UseLocalStorageResult<T>["update"]>(
    async (updater) => {
      let nextValue: T;
      if (typeof updater === "function") {
        nextValue = (updater as (prev: T | undefined) => T)(value);
      } else if (isPlainObject(updater) && isPlainObject(value)) {
        nextValue = {
          ...(value as Record<string, unknown>),
          ...(updater as Record<string, unknown>),
        } as T;
      } else {
        nextValue = updater as T;
      }
      await AsyncStorage.setItem(key, JSON.stringify(nextValue));
      setValue(nextValue);
    },
    [key, value]
  );

  const remove = useCallback(async () => {
    await AsyncStorage.removeItem(key);
    setValue(undefined);
  }, [key]);

  return {
    value,
    isLoading,
    set,
    update,
    delete: remove,
    remove,
  };
}
