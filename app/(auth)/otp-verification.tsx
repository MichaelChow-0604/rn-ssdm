import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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
import { useAuth } from "~/context/auth-context";
import { api } from "~/lib/axios";
import { beautifyResponse } from "~/lib/utils";
import { useCooldown } from "~/hooks/use-cooldown";
import { ResendLink } from "~/components/auth/resend-link";

export default function OTPVerificationPage() {
  const { email, mode } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const timerRef = useRef<CountdownTimerRef>(null);
  const { secondsLeft: resendCooldown, start: startCooldown } = useCooldown(60);

  const { setIsAuthenticated } = useAuth();

  const handleTimerExpire = () => {
    console.log("Timer expired");
  };

  const handleTimerReset = () => {
    console.log("Timer reset");
    // Add your resend code logic here
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    // Sync start: reset OTP timer and start 10s cooldown together
    timerRef.current?.resetTimer();
    startCooldown();

    try {
      const { data, status } = await api.post(
        "/api/v1/users/resend-confirmation",
        { email }
      );

      if (status === 200) {
        console.log("OTP RESEND SUCCESSFULLY", beautifyResponse(data));
        // No extra reset here; already synced at start
      }
      // Do NOT cancel cooldown on non-200; keep rate-limit consistent
    } catch (error) {
      console.log("ERRORRRRRRRRRRRRRRRRRR", error);
      // Do NOT cancel cooldown; still enforce 10s
    }
  };

  const handleVerify = async () => {
    try {
      const { data, status } = await api.post("/api/v1/users/confirmation", {
        email,
        confirmationCode: otp,
      });

      if (status === 200) {
        console.log("OTP VERIFIED SUCCESSFULLY", beautifyResponse(data));
        setIsAuthenticated(true);
        router.replace({
          pathname: "/return-message",
          params: { mode },
        });
      }
    } catch (error) {
      console.log("ERRORRRRRRRRRRRRRRRRRR", error);
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
          <AntDesign name="Safety" size={100} color="#438BF7" />
          <Text className="text-4xl font-bold py-4">
            {OTP_VERIFICATION_TITLE_2}
          </Text>

          {/* Description */}
          <Text className="text-subtitle text-center text-lg">
            {OTP_VERIFICATION_DESC}
          </Text>

          {/* Email */}
          <Text className="text-subtitle text-center text-lg font-semibold">
            {email}
          </Text>

          {/* OTP Input */}
          <OtpInput
            numberOfDigits={6}
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
              disabled={otp.length !== 6}
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

            <ResendLink
              label={RESEND}
              cooldownSeconds={resendCooldown}
              onPress={handleResendCode}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
