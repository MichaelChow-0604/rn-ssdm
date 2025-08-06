import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { OtpInput } from "react-native-otp-entry";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { email } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-start px-8">
        <BackButton className="my-12" />

        {/* Header */}
        <View className="flex flex-col gap-4">
          <Text className="text-2xl font-semibold">Check your email</Text>
          <Text className="font-semibold text-subtitle">
            We sent a verification code to {email}
            {"\n"}
            Please enter the 4-digit code that mentioned in the email
          </Text>
        </View>

        {/* OTP Input */}
        <OtpInput
          numberOfDigits={4}
          focusColor="#438BF7"
          theme={{
            containerStyle: { paddingBlock: 40 },
            filledPinCodeContainerStyle: {
              borderWidth: 2,
              borderColor: "#438BF7",
            },
            focusedPinCodeContainerStyle: {
              borderWidth: 2,
            },
          }}
          onTextChange={(text) => setOtp(text)}
        />

        {/* Verify Button */}
        <View className="flex flex-col gap-4 w-full">
          <Button
            className="bg-button text-buttontext"
            disabled={otp.length !== 4}
            onPress={() => router.replace("/new-password")}
          >
            <Text className="text-white font-bold">Verify Code</Text>
          </Button>

          {/* Resend Code Button */}
          <Button
            className="border-button bg-white active:bg-slate-100"
            variant="outline"
            onPress={() => console.log("TODO: Resend Code")}
          >
            <Text className="text-button font-bold">Resend Code</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
