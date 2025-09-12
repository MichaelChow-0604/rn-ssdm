import { Modal, Text, View } from "react-native";
import { Button } from "../ui/button";
import {
  DISCLAIMER,
  PRIVACY_POLICY,
  TERMS_OF_USE,
} from "~/constants/terms-and-policies";
import { Card, CardContent } from "../ui/card";

interface TermsAndPoliciesProps {
  visible: boolean;
  setOpen: (open: boolean) => void;
}

export const TermsAndPolicies = ({
  visible,
  setOpen,
}: TermsAndPoliciesProps) => {
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
            <Text className="text-center text-lg font-bold">Terms of use</Text>
            <Text className="text-center text-subtitle">{TERMS_OF_USE}</Text>

            <Text className="text-center text-lg font-bold">Disclaimer</Text>
            <Text className="text-center text-subtitle">{DISCLAIMER}</Text>

            <Text className="text-center text-lg font-bold">
              Privacy Policy
            </Text>
            <Text className="text-center text-subtitle">{PRIVACY_POLICY}</Text>

            <Button className="bg-button text-white" onPress={handleClose}>
              <Text className="text-white font-bold">Close</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
};
