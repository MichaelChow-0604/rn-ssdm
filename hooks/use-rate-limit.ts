import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "./use-local-storage";

interface UseRateLimitOptions {
  /**
   * Duration of the rate limit in milliseconds
   * @default 900000 (15 minutes)
   */
  duration?: number;
}

export function useRateLimit(key: string, options?: UseRateLimitOptions) {
  const duration = options?.duration ?? 15 * 60 * 1000; // Default 15 minutes

  const { value: lockUntil, set: setLockUntil } = useLocalStorage<
    number | null
  >(`rate_limit_${key}`, null);

  const [remainingTime, setRemainingTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Calculate if still locked and remaining time
  useEffect(() => {
    const checkLockStatus = () => {
      if (!lockUntil) {
        setIsLocked(false);
        setRemainingTime(0);
        return;
      }

      const now = Date.now();
      const timeLeft = lockUntil - now;

      if (timeLeft <= 0) {
        // Lock expired
        setIsLocked(false);
        setRemainingTime(0);
        setLockUntil(null);
      } else {
        // Still locked
        setIsLocked(true);
        setRemainingTime(Math.ceil(timeLeft / 1000));
      }
    };

    checkLockStatus();

    // Update every second while locked
    if (lockUntil && lockUntil > Date.now()) {
      const interval = setInterval(checkLockStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [lockUntil, setLockUntil]);

  // Trigger lockout
  const triggerLockout = useCallback(() => {
    const lockUntilTime = Date.now() + duration;
    setLockUntil(lockUntilTime);
  }, [duration, setLockUntil]);

  // Clear lockout manually (if needed)
  const clearLockout = useCallback(() => {
    setLockUntil(null);
  }, [setLockUntil]);

  return {
    isLocked,
    remainingTime,
    triggerLockout,
    clearLockout,
  };
}
