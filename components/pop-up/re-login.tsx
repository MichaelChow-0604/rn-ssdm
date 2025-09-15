import { Button } from "../ui/button";
import { Text, Modal, View } from "react-native";
import { Card, CardContent } from "../ui/card";
import { router } from "expo-router";

interface ReLoginProps {
  visible: boolean;
}

export default function ReLogin({ visible }: ReLoginProps) {
  const handleGoBackToSignIn = () => {
    router.replace("/auth");
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
            <Text className="text-center text-lg font-semibold">
              Your session has expired. Please login again.
            </Text>

            <Button
              className="bg-button text-white"
              onPress={handleGoBackToSignIn}
            >
              <Text className="text-white font-bold">BACK TO SIGN IN</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
}
