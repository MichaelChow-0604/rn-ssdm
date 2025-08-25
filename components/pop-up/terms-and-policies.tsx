import { Animated, StyleSheet, Text } from "react-native";
import { Button } from "../ui/button";
import {
  DISCLAIMER,
  PRIVACY_POLICY,
  TERMS_OF_USE,
} from "~/constants/terms-and-policies";
import { useEffect, useRef, useState } from "react";
import { Portal } from "@rn-primitives/portal";
import { Card, CardContent } from "../ui/card";

interface TermsAndPoliciesProps {
  visible: boolean;
  setOpen: (open: boolean) => void;
}

export const TermsAndPolicies = ({
  visible,
  setOpen,
}: TermsAndPoliciesProps) => {
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
    <Portal name="terms-and-policies-dialog">
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
        className="bg-black/60 items-center justify-center z-50"
        pointerEvents="auto"
      >
        <Animated.View style={{ opacity: cardOpacity, width: "80%" }}>
          <Card className="bg-white w-full rounded-2xl">
            <CardContent className="py-6 gap-4">
              <Text className="text-center text-lg font-bold">
                Terms of use
              </Text>
              <Text className="text-center text-subtitle">{TERMS_OF_USE}</Text>

              <Text className="text-center text-lg font-bold">Disclaimer</Text>
              <Text className="text-center text-subtitle">{DISCLAIMER}</Text>

              <Text className="text-center text-lg font-bold">
                Privacy Policy
              </Text>
              <Text className="text-center text-subtitle">
                {PRIVACY_POLICY}
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
};
