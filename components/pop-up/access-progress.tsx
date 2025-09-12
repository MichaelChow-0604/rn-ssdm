import { ActivityIndicator, Modal, Text, View } from "react-native";
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onDismiss={onDismiss}
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
