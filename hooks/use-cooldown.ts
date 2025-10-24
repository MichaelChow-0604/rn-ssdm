import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useLocalStorage } from "./use-local-storage";

export interface UseCooldown {
  secondsLeft: number;
  isCoolingDown: boolean;
  start: (duration?: number) => void;
  cancel: () => void;
}

export function useCooldown(
  defaultDuration = 10,
  persistKey?: string
): UseCooldown {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    value: storedExpiry,
    set: setStoredExpiry,
    remove: removeStoredExpiry,
  } = useLocalStorage<number | null>(
    persistKey ? `cooldown_${persistKey}` : "cooldown__noop",
    null
  );

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Hydrate from storage or clear stale
  useEffect(() => {
    if (!persistKey) return;
    const now = Date.now();
    if (storedExpiry && storedExpiry > now) {
      setExpiresAt(storedExpiry);
      setSecondsLeft(Math.max(0, Math.ceil((storedExpiry - now) / 1000)));
      return;
    }
    if (storedExpiry && storedExpiry <= now) {
      removeStoredExpiry();
      setExpiresAt(null);
      setSecondsLeft(0);
    }
  }, [persistKey, storedExpiry, removeStoredExpiry]);

  // Drive ticking by absolute expiry
  useEffect(() => {
    clearIntervalRef();
    if (!expiresAt) {
      setSecondsLeft(0);
      return;
    }
    const update = () => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        setExpiresAt(null);
        clearIntervalRef();
        if (persistKey) removeStoredExpiry();
      }
    };
    update();
    intervalRef.current = setInterval(update, 1000);
    return clearIntervalRef;
  }, [expiresAt, clearIntervalRef, persistKey, removeStoredExpiry]);

  // Update immediately on foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s !== "active" || !expiresAt) return;
      const now = Date.now();
      setSecondsLeft(Math.max(0, Math.ceil((expiresAt - now) / 1000)));
    });
    return () => sub.remove();
  }, [expiresAt]);

  const start = useCallback(
    (duration?: number) => {
      const secs = duration ?? defaultDuration;
      const next = Date.now() + secs * 1000;
      setExpiresAt(next);
      setSecondsLeft(secs);
      if (persistKey) setStoredExpiry(next);
    },
    [defaultDuration, persistKey, setStoredExpiry]
  );

  const cancel = useCallback(() => {
    setExpiresAt(null);
    setSecondsLeft(0);
    clearIntervalRef();
    if (persistKey) removeStoredExpiry();
  }, [clearIntervalRef, persistKey, removeStoredExpiry]);

  useEffect(() => {
    return clearIntervalRef;
  }, [clearIntervalRef]);

  return {
    secondsLeft,
    isCoolingDown: secondsLeft > 0,
    start,
    cancel,
  };
}
