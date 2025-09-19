import { Animated, StyleSheet, Text, View } from "react-native";
import { Portal } from "@rn-primitives/portal";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useAnimatedModal } from "~/hooks/use-animated-modal";

interface TrashDeleteSuccessProps {
  visible: boolean;
}

export function TrashDeleteSuccess({ visible }: TrashDeleteSuccessProps) {
  const { mounted, backdropOpacity, cardOpacity } = useAnimatedModal(visible);

  const handleBack = () => {
    router.replace("/trash");
  };

  if (!mounted) return null;

  return (
    <Portal name="trash-delete-success-dialog">
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
        className="bg-black/60 items-center justify-center z-50"
        pointerEvents="auto"
      >
        <Animated.View style={{ opacity: cardOpacity, width: "80%" }}>
          <Card className="bg-white w-full rounded-2xl">
            <CardContent className="py-6 gap-4">
              <View className="gap-2 flex-col items-center">
                <MaterialIcons name="check-circle" size={32} color="#438BF7" />
                <Text className="text-[#555] text-center">
                  Document deleted successfully
                </Text>
              </View>

              <Button className="bg-button" onPress={handleBack}>
                <Text className="text-white font-bold">BACK TO TRASH</Text>
              </Button>
            </CardContent>
          </Card>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}
