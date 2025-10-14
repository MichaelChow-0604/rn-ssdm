import { useState } from "react";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { useAuth } from "~/context/auth-context";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { confirmSignIn, confirmSignUp } from "~/lib/http/endpoints/auth";
import {
  ConfirmSignInPayload,
  ConfirmSignUpPayload,
} from "~/lib/http/request-type/auth";
import {
  SignInOTPResponse,
  SignUpOTPResponse,
} from "~/lib/http/response-type/auth";
import { useTokenStore } from "~/store/use-token-store";
import { contactKeys } from "~/lib/http/keys/contact";
import { documentKeys } from "~/lib/http/keys/document";
import { getContacts } from "~/lib/http/endpoints/contact";
import { getDocuments } from "~/lib/http/endpoints/document";
import { getProfile } from "~/lib/http/endpoints/profile";
import { Keyboard } from "react-native";

interface Params {
  email: string;
  session: string;
  mode: "signin" | "signup";
}

interface Return {
  verify: (otp: string) => void;
  isVerifying: boolean;
  showReLogin: boolean;
  onDismissOverlay: () => void;
  setSession: (s: string) => void;
}

export function useOtpVerification({ email, session, mode }: Params): Return {
  const [currentSession, setCurrentSession] = useState(session);
  const [loginCount, setLoginCount] = useState(0);
  const [showReLogin, setShowReLogin] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { setIsAuthenticated } = useAuth();

  const confirmSignInMutation = useApiMutation<
    SignInOTPResponse,
    ConfirmSignInPayload
  >({
    mutationKey: ["auth", "confirm-sign-in"],
    mutationFn: confirmSignIn,
    onSuccess: (data) => {
      if (data.session) {
        setLoginCount((prev) => {
          const next = prev + 1;
          if (next < 3) toast.error("Invalid OTP. Please try again.");
          return next;
        });
        setCurrentSession(data.session);
        return;
      }

      useTokenStore.getState().setTokens({
        email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        idToken: data.idToken,
      });

      queryClient.prefetchQuery({
        queryKey: contactKeys.list(),
        queryFn: getContacts,
      });
      queryClient.prefetchQuery({
        queryKey: documentKeys.list(),
        queryFn: getDocuments,
      });
      queryClient.prefetchQuery({
        queryKey: ["profile", "get"],
        queryFn: getProfile,
      });

      setIsAuthenticated(true);
      router.replace({ pathname: "/return-message", params: { mode } });
    },
    onError: () => {},
  });

  const confirmSignUpMutation = useApiMutation<
    SignUpOTPResponse,
    ConfirmSignUpPayload
  >({
    mutationKey: ["auth", "confirm-sign-up"],
    mutationFn: confirmSignUp,
    onSuccess: () =>
      router.replace({ pathname: "/return-message", params: { mode } }),
    onError: ({ status }) => {
      if (status === 400) {
        toast.error("Invalid OTP. Please try again.");
        return;
      }
      toast.error("Something went wrong. Please try again later.");
    },
  });

  const isVerifying =
    confirmSignInMutation.isPending || confirmSignUpMutation.isPending;

  function verify(otp: string) {
    Keyboard.dismiss();

    if (mode === "signin") {
      confirmSignInMutation.mutate({
        email,
        session: String(currentSession),
        confirmationCode: otp,
      });
      return;
    }
    if (mode === "signup") {
      confirmSignUpMutation.mutate({
        email,
        session: String(currentSession),
        confirmationCode: otp,
      });
      return;
    }
    console.error("Invalid mode");
  }

  function onDismissOverlay() {
    if (loginCount >= 3) setShowReLogin(true);
  }

  return {
    verify,
    isVerifying,
    showReLogin,
    onDismissOverlay,
    setSession: setCurrentSession,
  };
}
