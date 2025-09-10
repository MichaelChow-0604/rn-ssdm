import { ActivityIndicator, Modal, Text, View } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  label: string;
}

export function LoadingOverlay({ visible, label }: LoadingOverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        className="flex-1 items-center justify-center bg-black/50"
        pointerEvents="auto"
      >
        <View className="items-center justify-center rounded-2xl bg-white px-6 py-5">
          <ActivityIndicator size="large" color="#438BF7" />
          <Text className="mt-3 text-base text-gray-700 font-bold">
            {label}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
