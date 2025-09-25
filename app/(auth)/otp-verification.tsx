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
import { useAuth } from "~/context/auth-context";
import { useCooldown } from "~/hooks/use-cooldown";
import { ResendLink } from "~/components/auth/resend-link";
import { useTokenStore } from "~/store/use-token-store";
import {
  confirmSignIn,
  confirmSignUp,
  resendConfirmation,
} from "~/lib/http/endpoints/auth";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingOverlay } from "~/components/loading-overlay";
import { toast } from "sonner-native";
import { contactKeys } from "~/lib/http/keys/contact";
import { getContacts } from "~/lib/http/endpoints/contact";
import ReLogin from "~/components/pop-up/re-login";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import {
  ResendOTPResponse,
  SignInOTPResponse,
  SignUpOTPResponse,
} from "~/lib/http/response-type/auth";
import {
  ConfirmSignInPayload,
  ConfirmSignUpPayload,
} from "~/lib/http/request-type/auth";
import { documentKeys } from "~/lib/http/keys/document";
import { getDocuments } from "~/lib/http/endpoints/document";

export default function OTPVerificationPage() {
  const { email, session, mode } = useLocalSearchParams();
  const [currentSession, setCurrentSession] = useState(session);
  const [otp, setOtp] = useState("");
  const [expired, setExpired] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const timerRef = useRef<CountdownTimerRef>(null);
  const { secondsLeft: resendCooldown, start: startCooldown } = useCooldown(60);

  const [loginCount, setLoginCount] = useState(0);
  const [showReLogin, setShowReLogin] = useState(false);

  const { setIsAuthenticated } = useAuth();

  const resendMutation = useApiMutation<ResendOTPResponse, string>({
    mutationKey: ["auth", "resend-confirmation"],
    mutationFn: (email: string) => resendConfirmation(email),
    onSuccess: ({ session: newSession }) => {
      setCurrentSession(newSession);

      timerRef.current?.resetTimer();
      startCooldown();
      toast.success("New OTP sent to your email.");
    },
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const confirmSignInMutation = useApiMutation<
    SignInOTPResponse,
    ConfirmSignInPayload
  >({
    mutationKey: ["auth", "confirm-sign-in"],
    mutationFn: confirmSignIn,
    onSuccess: (data) => {
      // If session is provided, it means the OTP is invalid, will give user 3 times to try
      if (data.session) {
        setLoginCount((prev) => {
          const next = prev + 1;
          if (next < 3) toast.error("Invalid OTP. Please try again.");
          return next;
        });
        setCurrentSession(data.session);
      } else {
        // Store tokens in zustand for subsequent requests
        useTokenStore.getState().setTokens({
          email: String(email),
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          idToken: data.idToken,
        });

        console.log("ACCESS TOKEN", data.accessToken);
        console.log("ID TOKEN", data.idToken);

        // Warm contacts in the background (no await needed)
        queryClient.prefetchQuery({
          queryKey: contactKeys.list(),
          queryFn: getContacts,
          staleTime: 5 * 60 * 1000,
        });

        // Warm documents in the background (no await needed)
        queryClient.prefetchQuery({
          queryKey: documentKeys.list(),
          queryFn: getDocuments,
          staleTime: 5 * 60 * 1000,
        });

        setIsAuthenticated(true);
        router.replace({ pathname: "/return-message", params: { mode } });
      }
    },
    // No need to handle error, it will be handled by the onDismiss function
    onError: () => {},
  });

  const confirmSignUpMutation = useApiMutation<
    SignUpOTPResponse,
    ConfirmSignUpPayload
  >({
    mutationKey: ["auth", "confirm-sign-up"],
    mutationFn: confirmSignUp,
    onSuccess: () => {
      router.replace({ pathname: "/return-message", params: { mode } });
    },
    onError: ({ status }) => {
      switch (status) {
        case 400:
          toast.error("Invalid OTP. Please try again.");
          break;
        default:
          toast.error("Something went wrong. Please try again later.");
      }
    },
  });

  const isVerifying =
    confirmSignInMutation.isPending || confirmSignUpMutation.isPending;

  const showLoadingOverlay = isVerifying && !showReLogin;

  const handleResendCode = (): void => {
    if (resendCooldown > 0 || resendMutation.isPending) return;
    resendMutation.mutate(String(email));
  };

  const handleVerify = () => {
    Keyboard.dismiss();

    if (mode === "signin") {
      confirmSignInMutation.mutate({
        email: String(email),
        session: String(currentSession),
        confirmationCode: otp,
      });
      return;
    }

    if (mode === "signup") {
      confirmSignUpMutation.mutate({
        email: String(email),
        session: String(currentSession),
        confirmationCode: otp,
      });
      return;
    }

    throw new Error("Invalid mode");
  };

  const onDismiss = () => {
    // Invalid OTP 3 times, force user to re-login
    if (loginCount >= 3) {
      setShowReLogin(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          className="flex-1 items-center px-8 justify-center"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ReLogin visible={showReLogin} />
          <LoadingOverlay
            visible={showLoadingOverlay}
            label="Verifying..."
            onDismiss={onDismiss}
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
          />

          <View className="flex flex-col gap-4 w-full">
            {/* Verify Button */}
            <Button
              className="bg-button text-buttontext"
              disabled={
                otp.length !== 6 ||
                expired ||
                showReLogin ||
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
              isLoading={resendMutation.isPending}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
