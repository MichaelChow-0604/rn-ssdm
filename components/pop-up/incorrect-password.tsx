import { Animated, StyleSheet, Text } from "react-native";
import { Portal } from "@rn-primitives/portal";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useAnimatedModal } from "~/hooks/use-animated-modal";

interface IncorrectPasswordProps {
  visible: boolean;
  setOpen: (open: boolean) => void;
}

export function IncorrectPassword({
  visible,
  setOpen,
}: IncorrectPasswordProps) {
  const { mounted, backdropOpacity, cardOpacity } = useAnimatedModal(visible);

  const handleClose = () => {
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <Portal name="confirm-dialog">
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
        className="bg-black/60 items-center justify-center z-50"
        pointerEvents="auto"
      >
        <Animated.View style={{ opacity: cardOpacity, width: "80%" }}>
          <Card className="bg-white w-full rounded-2xl">
            <CardContent className="py-6 gap-4">
              <Text className="text-center text-lg font-bold">
                Incorrect Password
              </Text>

              <Button className="bg-button" onPress={handleClose}>
                <Text className="text-white font-bold">CLOSE</Text>
              </Button>
            </CardContent>
          </Card>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}
