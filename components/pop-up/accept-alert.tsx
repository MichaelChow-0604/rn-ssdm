import { Button } from "../ui/button";
import { Animated, Text } from "react-native";
import { Card, CardContent } from "../ui/card";
import { Portal } from "@rn-primitives/portal";
import { StyleSheet } from "react-native";
import { useAnimatedModal } from "~/hooks/use-animated-modal";

interface AcceptAlertProps {
  visible: boolean;
  setOpen: (open: boolean) => void;
}

export default function AcceptAlert({ visible, setOpen }: AcceptAlertProps) {
  const { mounted, backdropOpacity, cardOpacity } = useAnimatedModal(visible);

  const handleClose = () => {
    setOpen(false);
  };

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
