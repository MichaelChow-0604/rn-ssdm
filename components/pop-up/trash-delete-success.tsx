import { Modal, Text, View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

interface TrashDeleteSuccessProps {
  visible: boolean;
}

export function TrashDeleteSuccess({ visible }: TrashDeleteSuccessProps) {
  const handleBack = () => {
    router.replace("/trash");
  };

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
      </View>
    </Modal>
  );
}
