import React, {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { Text, View } from "react-native";

interface CountdownTimerProps {
  initialTime?: number; // in seconds, default 300 (5 minutes)
  onExpire?: () => void;
  onReset?: () => void;
  className?: string;
}

export interface CountdownTimerRef {
  resetTimer: () => void;
}

export const CountdownTimer = forwardRef<
  CountdownTimerRef,
  CountdownTimerProps
>(({ initialTime = 300, onExpire, onReset, className = "" }, ref) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Reset timer function
  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsTimerActive(true);
    onReset?.();
  }, [initialTime, onReset]);

  // Expose only resetTimer (stable handle)
  useImperativeHandle(
    ref,
    () => ({
      resetTimer,
    }),
    [resetTimer]
  );

  useEffect(() => {
    if (!isTimerActive) return;
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isTimerActive]);

  // Stop when it hits zero (no side effects here)
  useEffect(() => {
    if (timeLeft !== 0 || !isTimerActive) return;
    setIsTimerActive(false);
  }, [timeLeft, isTimerActive]);

  // Notify parent after render commit
  useEffect(() => {
    if (!isTimerActive && timeLeft === 0) {
      onExpireRef.current?.();
    }
  }, [isTimerActive, timeLeft]);

  return (
    <View
      className={`items-center gap-1 flex flex-row justify-end w-full ${className}`}
    >
      <Text className="text-subtitle">
        {isTimerActive ? "Expire in:" : "Expired"}
      </Text>
      <Text className="text-red-500 font-bold">{formatTime(timeLeft)}</Text>
    </View>
  );
});

CountdownTimer.displayName = "CountdownTimer";
