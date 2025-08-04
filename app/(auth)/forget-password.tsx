import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function ForgetPassword() {
  const [isFilled, setIsFilled] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-start px-8">
        <BackButton className="my-12" />

        {/* Header */}
        <View className="flex flex-col gap-4">
          <Text className="text-2xl font-semibold">Forgot Password</Text>
          <Text className="font-semibold text-subtitle">
            Please enter your email to reset the password
          </Text>
        </View>

        {/* Input */}
        <View className="flex flex-col gap-4 pt-12 w-full">
          <Label className="text-black font-semibold">Email</Label>
          <Input
            placeholder="Enter your email"
            className="border-[#E1E1E1] border-2 placeholder:text-placeholder bg-white text-black"
            onChangeText={(text) => setIsFilled(text.length > 0)}
          />
        </View>

        {/* Button */}
        <View className="flex flex-col gap-4 pt-8 w-full">
          <Button className="bg-button text-buttontext" disabled={!isFilled}>
            <Text className="text-white text-lg font-bold">Reset Password</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
