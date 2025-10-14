import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { OtpInput } from "react-native-otp-entry";
import {
  DIDNT_GET_CODE,
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
import { useOtpResend } from "~/hooks/use-otp-resend";
import { ResendLink } from "~/components/auth/resend-link";
import { LoadingOverlay } from "~/components/loading-overlay";
import ReLogin from "~/components/pop-up/re-login";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { ForgotPasswordOTPResponse } from "~/lib/http/response-type/auth";
import { ConfirmForgotPasswordPayload } from "~/lib/http/request-type/auth";
import { confirmForgotPassword } from "~/lib/http/endpoints/auth";
import { toast } from "sonner-native";

export default function OTPVerificationForgetPage() {
  const { email, session } = useLocalSearchParams<{
    email: string;
    session: string;
  }>();
  const [currentSession, setCurrentSession] = useState(session);
  const [otpCount, setOtpCount] = useState(0);
  const [showReForget, setShowReForget] = useState(false);
  const router = useRouter();

  const timerRef = useRef<CountdownTimerRef>(null);

  const [otp, setOtp] = useState("");
  const [expired, setExpired] = useState(false);

  const { resend, cooldownSeconds, isResending } = useOtpResend(
    String(email),
    (newSession) => {
      setCurrentSession(newSession);
      timerRef.current?.resetTimer();
      setExpired(false);
    }
  );

  const confirmForgotPasswordMutation = useApiMutation<
    ForgotPasswordOTPResponse,
    ConfirmForgotPasswordPayload
  >({
    mutationKey: ["auth", "confirm-forgot-password"],
    mutationFn: confirmForgotPassword,
    onSuccess: (data) => {
      if (data.session) {
        setOtpCount((prev) => {
          const next = prev + 1;
          if (next < 3) toast.error("Invalid OTP. Please try again.");
          return next;
        });
        setCurrentSession(data.session);
        return;
      }

      router.replace({
        pathname: "/(auth)/(forget-password)/new-password",
        params: { email },
      });
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
  });

  const isVerifying = confirmForgotPasswordMutation.isPending;

  function onDismissOverlay() {
    if (otpCount >= 3) setShowReForget(true);
  }

  function verify(otp: string) {
    confirmForgotPasswordMutation.mutate({
      email: String(email),
      session: String(currentSession),
      confirmationCode: otp,
    });
  }

  const verifyDisabled =
    otp.length !== 6 || expired || showReForget || isVerifying;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-start px-8">
        <BackButton className="my-12" />
        <ReLogin visible={showReForget} />
        <LoadingOverlay
          visible={isVerifying}
          label="Verifying..."
          onDismiss={onDismissOverlay}
        />

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
          numberOfDigits={6}
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
          onExpire={() => setExpired(true)}
          onReset={() => setExpired(false)}
          className="mt-1 mb-4"
        />

        {/* Verify Button */}
        <View className="flex flex-col gap-4 w-full">
          <Button
            className="bg-button text-buttontext"
            disabled={verifyDisabled}
            onPress={() => verify(otp)}
          >
            <Text className="text-white font-bold">{VERIFY}</Text>
          </Button>

          {/* Resend */}
          <View className="flex-row justify-center items-center gap-2 mt-4">
            <Text className="text-subtitle text-center text-lg">
              {DIDNT_GET_CODE}
            </Text>

            <ResendLink
              label={RESEND}
              cooldownSeconds={cooldownSeconds}
              onPress={resend}
              isLoading={isResending}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
