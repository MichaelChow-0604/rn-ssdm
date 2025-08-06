import React, {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Text, View } from "react-native";

interface CountdownTimerProps {
  initialTime?: number; // in seconds, default 300 (5 minutes)
  onExpire?: () => void;
  onReset?: () => void;
  showResendButton?: boolean;
  resendButtonText?: string;
  className?: string;
}

export interface CountdownTimerRef {
  resetTimer: () => void;
  isTimerActive: boolean;
  timeLeft: number;
}

export const CountdownTimer = forwardRef<
  CountdownTimerRef,
  CountdownTimerProps
>(({ initialTime = 300, onExpire, onReset, className = "" }, ref) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerActive, setIsTimerActive] = useState(true);

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

  // Expose resetTimer function and state to parent component
  useImperativeHandle(
    ref,
    () => ({
      resetTimer,
      isTimerActive,
      timeLeft,
    }),
    [resetTimer, isTimerActive, timeLeft]
  );

  // Timer countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerActive(false);
            onExpire?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timeLeft, onExpire]);

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
