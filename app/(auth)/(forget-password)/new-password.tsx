import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function NewPasswordPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-start px-8">
        {/* Header */}
        <View className="flex flex-col gap-4 mt-16 mb-12">
          <Text className="text-2xl font-semibold">Set a new password</Text>
        </View>

        {/* New credentials requirements */}
        <View className="flex flex-col gap-4">
          <Text className="text-xl font-semibold">New Credentials</Text>

          {/* Password requirements checkboxes */}
          <View className="flex flex-col gap-2">
            {/* At least 8 characters */}
            <View className="flex flex-row gap-2">
              <Checkbox
                className="native:rounded-full bg-button border-button"
                id="at-least-8-characters"
                checked={true}
                onCheckedChange={() => {}}
              />
              <Text className="text-passwordRequirements">
                Password must be at least 8 characters long
              </Text>
            </View>

            {/* Contain >1 uppercase */}
            <View className="flex flex-row gap-2">
              <Checkbox
                className="native:rounded-full bg-button border-button"
                id="at-least-8-characters"
                checked={true}
                onCheckedChange={() => {}}
              />
              <Text className="text-passwordRequirements">
                Password must contain at least 1 uppercase letter
              </Text>
            </View>

            {/* Contain >1 number or special character */}
            <View className="flex flex-row gap-2">
              <Checkbox
                className="native:rounded-full bg-button border-button"
                id="at-least-8-characters"
                checked={true}
                onCheckedChange={() => {}}
              />
              <Text className="text-passwordRequirements">
                Password must contain at least one number or special character
              </Text>
            </View>
          </View>

          <Text className="text-subtitle text-xl">
            Create a new password. Ensure it differs from previous ones for
            security
          </Text>
        </View>

        {/* Input */}
        <View className="flex flex-col gap-4 pt-12 w-full">
          {/* Password */}
          <View className="flex flex-col gap-1">
            <Label className="text-black font-semibold">Password</Label>
            <Input
              placeholder="Enter your new password"
              className="border-[#E1E1E1] border-2 bg-white placeholder:text-placeholder"
            />
          </View>

          {/* Confirm Password */}
          <View className="flex flex-col gap-1">
            <Label className="text-black font-semibold">Confirm Password</Label>
            <Input
              placeholder="Enter your new password"
              className="border-[#E1E1E1] border-2 bg-white placeholder:text-placeholder"
            />
          </View>
        </View>

        {/* Verify Button */}
        <View className="flex flex-col gap-4 w-full">
          <Button
            className="bg-button text-buttontext"
            onPress={() => router.push("/new-password")}
          >
            <Text className="text-white text-lg font-bold">Verify Code</Text>
          </Button>

          {/* Resend Code Button */}
          <Button
            className="border-button"
            variant="outline"
            onPress={() => console.log("TODO: Resend Code")}
          >
            <Text className="text-button text-lg font-bold">Resend Code</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
