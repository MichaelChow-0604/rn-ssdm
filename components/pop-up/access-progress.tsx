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
import { useAnimatedModal } from "~/hooks/use-animated-modal";

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
  const { mounted, backdropOpacity, cardOpacity } = useAnimatedModal(visible, {
    inDuration: 500,
    outDuration: 500,
  });

  if (!mounted) return null;

  return (
    <Portal name="access-progress-dialog">
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
