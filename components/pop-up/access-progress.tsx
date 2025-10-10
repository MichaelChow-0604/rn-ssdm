import { ActivityIndicator, Modal, Text, View, Platform } from "react-native";
import { useEffect, useRef } from "react";
import { Card, CardContent } from "~/components/ui/card";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface AccessProgressDialogProps {
  visible: boolean;
  text: string;
  status?: "pending" | "success";
  onDismiss?: () => void;
}

export function AccessProgressDialog({
  visible,
  text,
  status = "pending",
  onDismiss,
}: AccessProgressDialogProps) {
  const wasVisible = useRef(false);

  // Android: Modal.onDismiss may not fire when programmatically hidden.
  useEffect(() => {
    if (Platform.OS === "android" && wasVisible.current && !visible) {
      onDismiss?.();
    }
    wasVisible.current = visible;
  }, [visible, onDismiss]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onDismiss={onDismiss} // iOS will use this
    >
      <View
        className="flex-1 items-center justify-center bg-black/50"
        pointerEvents="auto"
      >
        <Card className="bg-white w-[80%]">
          <CardContent className="py-8 items-center gap-3">
            <View className="w-16 h-16 flex items-center justify-center">
              {status === "pending" ? (
                <ActivityIndicator size="large" color="#438BF7" />
              ) : (
                <FontAwesome5 name="check-circle" size={32} color="#438BF7" />
              )}
            </View>
            <Text className="text-black font-semibold text-lg text-center">
              {text}
            </Text>
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
}
