import { Modal, Text, View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface LogoutConfirmProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function LogoutConfirm({
  visible,
  onConfirm,
  onCancel,
}: LogoutConfirmProps) {
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
        <Card className="bg-white w-[80%] rounded-2xl">
          <CardContent className="py-6 gap-4">
            <View className="gap-2 flex-col items-center">
              <MaterialIcons name="logout" size={24} color="black" />
              <Text className="text-[#555] text-center">
                Are you sure you want to logout?
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-white border-gray-200 active:bg-gray-100"
                onPress={onCancel}
              >
                <Text className="font-bold">CANCEL</Text>
              </Button>
              <Button className="flex-1 bg-button" onPress={onConfirm}>
                <Text className="text-white font-bold">CONFIRM</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
}
