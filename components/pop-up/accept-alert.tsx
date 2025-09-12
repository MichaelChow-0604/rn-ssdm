import { Button } from "../ui/button";
import { Text, Modal, View } from "react-native";
import { Card, CardContent } from "../ui/card";

interface AcceptAlertProps {
  visible: boolean;
  setOpen: (open: boolean) => void;
}

export default function AcceptAlert({ visible, setOpen }: AcceptAlertProps) {
  const handleClose = () => {
    setOpen(false);
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
              Please read and accept the terms and policies to continue
            </Text>

            <Button className="bg-button text-white" onPress={handleClose}>
              <Text className="text-white font-bold">Close</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
}
