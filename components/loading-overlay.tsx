import { ActivityIndicator, Text, View } from "react-native";
import Modal from "react-native-modal";

interface LoadingOverlayProps {
  visible: boolean;
  label: string;
  onDismiss: () => void;
}

export function LoadingOverlay({
  visible,
  label,
  onDismiss,
}: LoadingOverlayProps) {
  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onModalHide={onDismiss}
    >
      <View className="items-center justify-center rounded-2xl bg-white px-6 py-5 flex self-center">
        <ActivityIndicator size="large" color="#438BF7" />
        <Text className="mt-3 text-base text-gray-700 font-bold">{label}</Text>
      </View>
    </Modal>
  );
}
