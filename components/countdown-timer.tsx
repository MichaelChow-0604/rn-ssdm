import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
} from "react";
import { AppState, Text, View } from "react-native";
import { useLocalStorage } from "~/hooks/use-local-storage";

interface CountdownTimerProps {
  initialTime?: number; // in seconds, default 300 (5 minutes)
  onExpire?: () => void;
  onReset?: () => void;
  className?: string;
  /**
   * Optional storage key to persist the expiry across backgrounding/app restarts.
   * Use something stable and unique, e.g. `otp_${email}`.
   */
  persistKey?: string;
}

export interface CountdownTimerRef {
  resetTimer: () => void;
}

export const CountdownTimer = forwardRef<
  CountdownTimerRef,
  CountdownTimerProps
>(
  (
    { initialTime = 300, onExpire, onReset, className = "", persistKey },
    ref
  ) => {
    // Persisted expiry timestamp (ms) when persistKey is provided
    const { value: storedExpiresAt, set: setStoredExpiresAt } = useLocalStorage<
      number | null
    >(persistKey ? `countdown_${persistKey}` : "countdown__noop", null);

    // Local expiry (ms). Always the source of truth for remaining time.
    const [expiresAt, setExpiresAt] = useState<number>(
      () => Date.now() + initialTime * 1000
    );
    const [timeLeft, setTimeLeft] = useState<number>(() =>
      Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
    );

    const onExpireRef = useRef(onExpire);
    useEffect(() => {
      onExpireRef.current = onExpire;
    }, [onExpire]);

    // Initialize/rehydrate expiry from storage (or write a fresh one)
    useEffect(() => {
      const now = Date.now();

      if (!persistKey) {
        const next = now + initialTime * 1000;
        setExpiresAt(next);
        setTimeLeft(Math.max(0, Math.ceil((next - now) / 1000)));
        return;
      }

      if (storedExpiresAt && storedExpiresAt > now) {
        setExpiresAt(storedExpiresAt);
        setTimeLeft(Math.max(0, Math.ceil((storedExpiresAt - now) / 1000)));
        return;
      }

      const fresh = now + initialTime * 1000;
      setExpiresAt(fresh);
      setStoredExpiresAt(fresh);
      setTimeLeft(Math.max(0, Math.ceil((fresh - now) / 1000)));
    }, [persistKey, storedExpiresAt, initialTime, setStoredExpiresAt]);

    // Tick every second while mounted (foreground). Uses absolute expiry for correctness.
    useEffect(() => {
      const id = setInterval(() => {
        const now = Date.now();
        const left = Math.max(0, Math.ceil((expiresAt - now) / 1000));
        setTimeLeft(left);
      }, 1000);
      return () => clearInterval(id);
    }, [expiresAt]);

    // Update immediately on app foreground
    useEffect(() => {
      const sub = AppState.addEventListener("change", (state) => {
        if (state !== "active") return;
        const now = Date.now();
        const left = Math.max(0, Math.ceil((expiresAt - now) / 1000));
        setTimeLeft(left);
      });
      return () => sub.remove();
    }, [expiresAt]);

    // Fire onExpire once when time hits zero; reset when time goes back > 0
    const notifiedRef = useRef(false);
    useEffect(() => {
      if (timeLeft === 0 && !notifiedRef.current) {
        notifiedRef.current = true;
        onExpireRef.current?.();
      }
      if (timeLeft > 0) notifiedRef.current = false;
    }, [timeLeft]);

    // Reset = write a new expiry (and persist if enabled)
    const resetTimer = useCallback(() => {
      const next = Date.now() + initialTime * 1000;
      setExpiresAt(next);
      setTimeLeft(Math.max(0, Math.ceil((next - Date.now()) / 1000)));
      if (persistKey) setStoredExpiresAt(next);
      onReset?.();
    }, [initialTime, onReset, persistKey, setStoredExpiresAt]);

    useImperativeHandle(ref, () => ({ resetTimer }), [resetTimer]);

    const isExpired = timeLeft === 0;

    const formatted = `${String(Math.floor(timeLeft / 60)).padStart(
      2,
      "0"
    )}:${String(timeLeft % 60).padStart(2, "0")}`;

    return (
      <View
        className={`items-center gap-1 flex flex-row justify-end w-full ${className}`}
      >
        <Text className="text-subtitle">
          {isExpired ? "Expired" : "Expire in:"}
        </Text>
        <Text className="text-red-500 font-bold">{formatted}</Text>
      </View>
    );
  }
);

CountdownTimer.displayName = "CountdownTimer";
