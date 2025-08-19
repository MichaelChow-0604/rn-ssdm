import { SafeAreaView, View, Text } from "react-native";
import { BackButton } from "~/components/back-button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { IncorrectPassword } from "~/components/pop-up/incorrect-password";
import { router } from "expo-router";

export default function DeleteConfirm() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  const tempCheck = () => {
    if (password === "12345678") {
      router.replace("/account-deleted");
    } else {
      setOpen(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 pt-4 pb-8">
        <BackButton />
        <Text className="text-2xl font-bold">Delete Confirmation</Text>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center gap-8 pb-12">
        <View className="flex-col items-center gap-6 w-[85%] mx-auto">
          {/* Icon */}
          <View className="h-20 w-20 bg-red-200 rounded-full flex items-center justify-center">
            <MaterialCommunityIcons
              name="delete-forever"
              size={40}
              color="red"
            />
          </View>

          {/* WARNING */}
          <View className="flex-col items-center gap-4">
            <View className="flex-col items-center">
              <Text className="text-red-500 font-bold text-2xl">WARNING</Text>
              <Text className="text-center text-lg font-semibold">
                This is permanent and cannot be undone!
              </Text>
            </View>

            <Text className="text-center">
              All of your information will be immediately deleted. All document
              you uploaded or received will also be deleted.
            </Text>
          </View>
        </View>

        {/* Password Input */}
        <View className="flex-col items-center gap-2 mt-4">
          <Text className="font-bold text-lg">
            Enter Password to verify your identity
          </Text>
          <Input
            value={password}
            onChangeText={setPassword}
            className="w-[70%] bg-gray-100"
            secureTextEntry
          />
        </View>

        {/* Delete Button */}
        <Button className="bg-red-500 w-[80%] mx-auto" onPress={tempCheck}>
          <Text className="text-white font-bold">CONFIRM</Text>
        </Button>
      </View>

      <IncorrectPassword visible={open} setOpen={setOpen} />
    </SafeAreaView>
  );
}
