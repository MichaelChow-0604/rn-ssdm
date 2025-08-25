import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

interface UseAnimatedModalOptions {
  inDuration?: number;
  outDuration?: number;
}

export function useAnimatedModal(
  visible: boolean,
  options?: UseAnimatedModalOptions
) {
  const { inDuration = 300, outDuration = 300 } = options ?? {};
  const [mounted, setMounted] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: inDuration,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: inDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: outDuration,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: outDuration,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!cancelled && finished) setMounted(false);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [visible, inDuration, outDuration, mounted, backdropOpacity, cardOpacity]);

  return { mounted, backdropOpacity, cardOpacity };
}
