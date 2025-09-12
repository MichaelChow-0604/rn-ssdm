import { Modal, Text, View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface EditAlertProps {
  visible: boolean;
  setOpen: (open: boolean) => void;
}

export function EditAlert({ visible, setOpen }: EditAlertProps) {
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
            <Text className="text-center text-lg font-bold">
              Recipients cannot be empty
            </Text>

            <Button className="bg-button" onPress={handleClose}>
              <Text className="text-white font-bold">OK</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
}
