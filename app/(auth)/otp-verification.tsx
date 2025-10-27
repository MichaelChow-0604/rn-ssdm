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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  CANCEL,
  DIDNT_GET_CODE,
  RESEND,
  OTP_VERIFICATION_DESC,
  OTP_VERIFICATION_TITLE_2,
  VERIFY,
} from "~/constants/auth-placeholders";
import { ResendLink } from "~/components/auth/resend-link";
import { LoadingOverlay } from "~/components/loading-overlay";
import ReLogin from "~/components/pop-up/re-login";
import { useOtpVerification } from "~/hooks/auth/use-otp-verification";
import { useOtpResend } from "~/hooks/auth/use-otp-resend";
import { usePushNotification } from "~/hooks/use-push-notification";

export default function OTPVerificationPage() {
  const { email, session, mode } = useLocalSearchParams<{
    email: string;
    session: string;
    mode: "signin" | "signup";
  }>();

  const { expoPushToken } = usePushNotification();

  const [otp, setOtp] = useState("");
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<CountdownTimerRef>(null);
  const router = useRouter();

  const { verify, isVerifying, showReLogin, onDismissOverlay, setSession } =
    useOtpVerification({
      email: String(email),
      session: String(session),
      mode: mode as "signin" | "signup",
      pushToken: expoPushToken,
    });

  const { resend, cooldownSeconds, isResending } = useOtpResend(
    { email: String(email), isLogin: mode === "signin" },
    (newSession) => {
      setSession(newSession);
      timerRef.current?.resetTimer();
      setExpired(false);
    }
  );

  const showLoadingOverlay = isVerifying && !showReLogin;
  const verifyDisabled =
    otp.length !== 6 || expired || showReLogin || isVerifying;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          className="flex-1 items-center px-8 justify-center"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
        >
          <ReLogin visible={showReLogin} />
          <LoadingOverlay
            visible={showLoadingOverlay}
            label="Verifying..."
            onDismiss={onDismissOverlay}
          />

          {/* Header */}
          <MaterialCommunityIcons
            name="shield-account"
            size={100}
            color="#438BF7"
          />
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
            onExpire={() => setExpired(true)}
            onReset={() => setExpired(false)}
            className="mt-1 mb-4"
            persistKey={`otp_${email}`}
          />

          <View className="flex flex-col gap-4 w-full">
            {/* Verify Button */}
            <Button
              className="bg-button text-buttontext"
              disabled={verifyDisabled}
              onPress={() => verify(otp)}
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
              cooldownSeconds={cooldownSeconds}
              onPress={resend}
              isLoading={isResending}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
