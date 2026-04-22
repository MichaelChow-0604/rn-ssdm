import { useState } from "react";
import { Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { confirmForgotPassword } from "~/lib/http/endpoints/auth";
import { ConfirmForgotPasswordPayload } from "~/lib/http/request-type/auth";
import { ForgotPasswordOTPResponse } from "~/lib/http/response-type/auth";

interface Params {
  email: string;
  session: string;
}

interface Return {
  verify: (otp: string) => void;
  isVerifying: boolean;
  showReForget: boolean;
  onDismissOverlay: () => void;
  setSession: (s: string) => void;
}

export function useForgotPasswordOTP({ email, session }: Params): Return {
  const [currentSession, setCurrentSession] = useState(session);
  const [otpCount, setOtpCount] = useState(0);
  const [showReForget, setShowReForget] = useState(false);

  const router = useRouter();

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
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const isVerifying = confirmForgotPasswordMutation.isPending;

  function onDismissOverlay() {
    if (otpCount >= 3) setShowReForget(true);
  }

  function verify(otp: string) {
    Keyboard.dismiss();
    confirmForgotPasswordMutation.mutate({
      email: String(email),
      session: String(currentSession),
      confirmationCode: otp,
    });
  }

  return {
    verify,
    isVerifying,
    showReForget,
    onDismissOverlay,
    setSession: setCurrentSession,
  };
}
