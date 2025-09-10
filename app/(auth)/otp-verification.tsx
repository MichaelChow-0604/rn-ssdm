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
import { useCooldown } from "~/hooks/use-cooldown";
import { ResendLink } from "~/components/auth/resend-link";
import { useTokenStore } from "~/store/use-token-store";
import {
  confirmSignIn,
  confirmSignUp,
  resendConfirmation,
} from "~/lib/http/endpoints/auth";
import { useMutation } from "@tanstack/react-query";
import { LoadingOverlay } from "~/components/loading-overlay";
import { toast } from "sonner-native";

export default function OTPVerificationPage() {
  const { email, session, mode } = useLocalSearchParams();
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

  const resendMutation = useMutation({
    mutationKey: ["auth", "resend-confirmation"],
    mutationFn: (email: string) => resendConfirmation(email),
    onSuccess: () => toast.success("New OTP sent to your email."),
    onError: () => toast.error("Failed to resend OTP. Please try again."),
  });

  const confirmSignInMutation = useMutation({
    mutationKey: ["auth", "confirm-sign-in"],
    mutationFn: confirmSignIn,
    onSuccess: (data) => {
      // Store tokens in zustand for subsequent requests
      useTokenStore.getState().setTokens({
        email: String(email),
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        idToken: data.idToken,
      });
      setIsAuthenticated(true);
      router.replace({ pathname: "/return-message", params: { mode } });
    },
    onError: () => toast.error("Invalid OTP. Please try again."),
  });

  const confirmSignUpMutation = useMutation({
    mutationKey: ["auth", "confirm-sign-up"],
    mutationFn: confirmSignUp,
    onSuccess: () => {
      router.replace({ pathname: "/return-message", params: { mode } });
    },
    onError: () => toast.error("Invalid OTP. Please try again."),
  });

  const isVerifying =
    confirmSignInMutation.isPending || confirmSignUpMutation.isPending;

  const handleResendCode = (): void => {
    if (resendCooldown > 0 || resendMutation.isPending) return;
    timerRef.current?.resetTimer();
    startCooldown();
    resendMutation.mutate(String(email));
  };

  const handleVerify = () => {
    Keyboard.dismiss();
    if (mode === "signin") {
      confirmSignInMutation.mutate({
        email: String(email),
        session: String(session),
        confirmationCode: otp,
      });
      return;
    }

    if (mode === "signup") {
      confirmSignUpMutation.mutate({
        email: String(email),
        confirmationCode: otp,
      });
      return;
    }

    throw new Error("Invalid mode");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          className="flex-1 items-center px-8 justify-center"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <LoadingOverlay visible={isVerifying} label="Verifying..." />

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
            autoFocus={false}
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

          <View className="flex flex-col gap-4 w-full">
            {/* Verify Button */}
            <Button
              className="bg-button text-buttontext"
              disabled={
                otp.length !== 6 ||
                confirmSignInMutation.isPending ||
                confirmSignUpMutation.isPending
              }
              onPress={handleVerify}
            >
              <Text className="text-white font-bold">{VERIFY}</Text>
            </Button>

            {/* Cancel Button */}
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
