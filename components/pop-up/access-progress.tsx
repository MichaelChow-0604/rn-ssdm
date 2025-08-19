import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Portal } from "@rn-primitives/portal";

interface AccessProgressDialogProps {
  visible: boolean;
  text: string;
  status?: "pending" | "success";
}

export function AccessProgressDialog({
  visible,
  text,
  status = "pending",
}: AccessProgressDialogProps) {
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
          duration: 500, // longer fade-in
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500, // longer fade-in
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 500, // longer fade-out
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 500, // longer fade-out
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
    <Portal name="access-progress">
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
        className="bg-black/60 items-center justify-center z-50"
        pointerEvents="auto"
      >
        <Animated.View style={{ opacity: cardOpacity, width: "80%" }}>
          <Card className="bg-white w-full">
            <CardContent className="py-8 items-center gap-3">
              <View className="w-16 h-16 flex items-center justify-center">
                {status === "pending" ? (
                  <ActivityIndicator size="large" color="#438BF7" />
                ) : (
                  <AntDesign name="checkcircleo" size={32} color="#438BF7" />
                )}
              </View>
              <Text className="text-black font-semibold text-lg text-center">
                {text}
              </Text>
            </CardContent>
          </Card>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}
