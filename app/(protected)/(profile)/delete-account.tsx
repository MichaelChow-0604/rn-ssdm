import { SafeAreaView, View, Text } from "react-native";
import { BackButton } from "~/components/back-button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { router } from "expo-router";

export default function DeleteAccount() {
  const [isChecked, setIsChecked] = useState(false);

  const handleDeleteAccount = () => {
    router.push("/delete-confirm");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 pt-4 pb-8">
        <BackButton />
        <Text className="text-2xl font-bold">Delete Account</Text>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center pb-12">
        <View className="flex-col items-center gap-6 w-[80%] mx-auto">
          <View className="h-20 w-20 bg-red-200 rounded-full flex items-center justify-center">
            <MaterialCommunityIcons
              name="delete-forever"
              size={40}
              color="red"
            />
          </View>

          <Text className="text-center text-lg font-bold">
            Are you sure you want to delete the account linked with
            123@yahoo.com?
          </Text>

          <View className="flex-row items-center gap-3 w-[70%]">
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => setIsChecked(!isChecked)}
              className="border-gray-300"
            />
            <Text className="text-sm font-semibold">
              I understand that I won’t able to recover my account.
            </Text>
          </View>
        </View>

        <Button
          className="bg-red-500 w-[80%] mx-auto mt-8"
          disabled={!isChecked}
          onPress={handleDeleteAccount}
        >
          <Text className="text-white font-bold">DELETE</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
