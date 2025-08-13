import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CountdownTimer,
  CountdownTimerRef,
} from "~/components/countdown-timer";
import { Button } from "~/components/ui/button";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  CANCEL,
  DIDNT_GET_CODE,
  RESEND,
  OTP_VERIFICATION_DESC,
  OTP_VERIFICATION_TITLE_2,
  VERIFY,
} from "~/constants/auth-placeholders";
import { useAuth } from "~/lib/auth-context";

export default function OTPVerificationPage() {
  const { email, mode } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const timerRef = useRef<CountdownTimerRef>(null);

  const { setIsAuthenticated } = useAuth();

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

  const handleVerify = () => {
    setIsAuthenticated(true);
    router.replace({
      pathname: "/return-message",
      params: { mode },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          className="flex-1 items-center px-8 justify-center"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <AntDesign name="Safety" size={100} color="#438BF7" />
          <Text className="text-4xl font-bold py-4">
            {OTP_VERIFICATION_TITLE_2}
          </Text>

          {/* Description */}
          <Text className="text-subtitle text-center text-lg">
            {OTP_VERIFICATION_DESC} {email}
          </Text>

          {/* OTP Input */}
          <OtpInput
            numberOfDigits={4}
            focusColor="#438BF7"
            theme={{
              containerStyle: {
                paddingTop: 20,
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
              onPress={handleVerify}
            >
              <Text className="text-white font-bold">{VERIFY}</Text>
            </Button>

            {/* Resend Code Button */}
            <Button
              className="border-button bg-white active:bg-slate-100"
              variant="outline"
              onPress={() => router.replace("/")}
            >
              <Text className="text-button font-bold">{CANCEL}</Text>
            </Button>
          </View>

          {/* Resend */}
          <View className="flex-row justify-center items-center gap-2 mt-4">
            <Text className="text-subtitle text-center text-lg">
              {DIDNT_GET_CODE}
            </Text>

            <Pressable onPress={handleResendCode}>
              <Text className="text-button text-center text-lg font-bold">
                {RESEND}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
