import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { OtpInput } from "react-native-otp-entry";
import {
  OTP_VERIFICATION_FORGET_DESC_1,
  OTP_VERIFICATION_FORGET_DESC_2,
  OTP_VERIFICATION_FORGET_TITLE,
  RESEND,
  VERIFY,
} from "~/constants/auth-placeholders";
import {
  CountdownTimer,
  CountdownTimerRef,
} from "~/components/countdown-timer";

export default function OTPVerificationForgetPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const timerRef = useRef<CountdownTimerRef>(null);

  const handleTimerExpire = () => {
    console.log("Timer expired");
  };

  const handleTimerReset = () => {
    console.log("Timer reset");
    // Add your resend code logic here
  };

  const handleResendCode = () => {
    // Call the resetTimer function from the timer component
    timerRef.current?.resetTimer();
    handleTimerReset();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-start px-8">
        <BackButton className="my-12" />

        {/* Header */}
        <View className="flex flex-col gap-4">
          <Text className="text-2xl font-bold">
            {OTP_VERIFICATION_FORGET_TITLE}
          </Text>
          <Text className="font-semibold text-subtitle">
            {OTP_VERIFICATION_FORGET_DESC_1} {email}
            {"\n\n"}
            {OTP_VERIFICATION_FORGET_DESC_2}
          </Text>
        </View>

        {/* OTP Input */}
        <OtpInput
          numberOfDigits={4}
          focusColor="#438BF7"
          theme={{
            containerStyle: {
              paddingTop: 40,
            },
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

        {/* Timer */}
        <CountdownTimer
          ref={timerRef}
          initialTime={300} // 5 minutes
          onExpire={handleTimerExpire}
          onReset={handleTimerReset}
          className="mt-1 mb-4"
        />

        {/* Verify Button */}
        <View className="flex flex-col gap-4 w-full">
          <Button
            className="bg-button text-buttontext"
            disabled={otp.length !== 4}
            onPress={() => router.replace("/new-password")}
          >
            <Text className="text-white font-bold">{VERIFY}</Text>
          </Button>

          {/* Resend Code Button */}
          <Button
            className="border-button bg-white active:bg-slate-100"
            variant="outline"
            onPress={handleResendCode}
          >
            <Text className="text-button font-bold">{RESEND}</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
