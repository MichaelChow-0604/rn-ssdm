import { Modal, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "../ui/button";

interface AlertDialogProps {
  visible: boolean;
  title: string;
  label: string;
  onDismiss: () => void;
}

export function AlertDialog({
  visible,
  title,
  label,
  onDismiss,
}: AlertDialogProps) {
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
        <View className="items-center justify-center rounded-2xl bg-white px-6 py-5 w-[90%]">
          <AntDesign name="exclamation-circle" size={24} color="#E42D2D" />
          <Text className="mt-2 text-lg text-gray-700 font-bold">{title}</Text>

          <Text className="my-4 text-medium text-gray-700 font-medium text-center">
            {label}
          </Text>

          <Button className="bg-button w-full" onPress={onDismiss}>
            <Text className="text-white font-bold">OK</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
