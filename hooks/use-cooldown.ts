import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCooldown {
  secondsLeft: number;
  isCoolingDown: boolean;
  start: (duration?: number) => void;
  cancel: () => void;
}

export function useCooldown(defaultDuration = 10): UseCooldown {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clear();
        return 0;
      }
      return prev - 1;
    });
  }, [clear]);

  const start = useCallback(
    (duration?: number) => {
      clear();
      setSecondsLeft(duration ?? defaultDuration);
      intervalRef.current = setInterval(tick, 1000);
    },
    [defaultDuration, tick, clear]
  );

  const cancel = useCallback(() => {
    clear();
    setSecondsLeft(0);
  }, [clear]);

  useEffect(() => {
    return clear;
  }, [clear]);

  return {
    secondsLeft,
    isCoolingDown: secondsLeft > 0,
    start,
    cancel,
  };
}
