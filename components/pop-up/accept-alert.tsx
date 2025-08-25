import { Button } from "../ui/button";
import { Animated, Text } from "react-native";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Portal } from "@rn-primitives/portal";
import { StyleSheet } from "react-native";

interface AcceptAlertProps {
  visible: boolean;
  setOpen: (open: boolean) => void;
}

export default function AcceptAlert({ visible, setOpen }: AcceptAlertProps) {
  const [mounted, setMounted] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let cancelled = false;
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!cancelled && finished) setMounted(false);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [visible]);

  if (!mounted) return null;

  return (
    <Portal name="accept-alert-dialog">
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
        className="bg-black/60 items-center justify-center z-50"
        pointerEvents="auto"
      >
        <Animated.View style={{ opacity: cardOpacity, width: "80%" }}>
          <Card className="bg-white w-full rounded-2xl">
            <CardContent className="py-6 gap-4">
              <Text className="text-center text-lg font-semibold">
                Please read and accept the terms and policies to continue
              </Text>

              <Button className="bg-button text-white" onPress={handleClose}>
                <Text className="text-white font-bold">Close</Text>
              </Button>
            </CardContent>
          </Card>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}
