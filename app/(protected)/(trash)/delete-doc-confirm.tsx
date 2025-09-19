import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { CANCEL, VERIFY } from "~/constants/auth-placeholders";
import { removeDocument } from "~/lib/storage/trash";
import { Input } from "~/components/ui/input";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { TrashDeleteSuccess } from "~/components/pop-up/trash-delete-success";
import { IncorrectPassword } from "~/components/pop-up/incorrect-password";

export default function DeleteDocConfirm() {
  const { documentId } = useLocalSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openIncorrectPasswordDialog, setOpenIncorrectPasswordDialog] =
    useState(false);

  const tempCheck = () => {
    if (password === "12345678") {
      return true;
    }

    return false;
  };

  const handleVerify = async () => {
    if (tempCheck()) {
      Keyboard.dismiss();
      await removeDocument(documentId as string);
      setOpenSuccessDialog(true);
    } else {
      setOpenIncorrectPasswordDialog(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          className="flex-1 items-center px-8 justify-center"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <FontAwesome5 name="user-shield" size={100} color="#438BF7" />
          <Text className="text-4xl font-bold py-4">Verification</Text>

          {/* Description */}
          <Text className="text-subtitle text-center text-lg">
            Enter your password to continue
          </Text>

          {/* OTP Input */}
          <Input
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            className="w-full my-8 bg-white border-gray-200 text-black"
          />

          {/* Verify Button */}
          <View className="flex flex-col gap-4 w-full">
            <Button
              className="bg-button text-buttontext"
              onPress={handleVerify}
            >
              <Text className="text-white font-bold">{VERIFY}</Text>
            </Button>

            {/* Cancel Button */}
            <Button
              className="border-button bg-white active:bg-slate-100"
              variant="outline"
              onPress={() => router.replace("/trash")}
            >
              <Text className="text-button font-bold">{CANCEL}</Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <TrashDeleteSuccess visible={openSuccessDialog} />
      <IncorrectPassword
        visible={openIncorrectPasswordDialog}
        setOpen={setOpenIncorrectPasswordDialog}
      />
    </SafeAreaView>
  );
}
