import { toast } from "sonner-native";
import { useCooldown } from "~/hooks/use-cooldown";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { resendConfirmation } from "~/lib/http/endpoints/auth";
import { ResendOTPResponse } from "~/lib/http/response-type/auth";
import { ResendConfirmationPayload } from "~/lib/http/request-type/auth";

interface Params {
  email: string;
  isLogin: boolean;
}

export function useOtpResend(
  { email, isLogin }: Params,
  onSession: (s: string) => void
) {
  const { secondsLeft, start } = useCooldown(60);

  const resendMutation = useApiMutation<
    ResendOTPResponse,
    ResendConfirmationPayload
  >({
    mutationKey: ["auth", "resend-confirmation"],
    mutationFn: resendConfirmation,
    onSuccess: ({ session }) => {
      onSession(session);
      start();
      toast.success("New OTP sent to your email.");
    },
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  function resend() {
    if (secondsLeft > 0 || resendMutation.isPending) return;
    resendMutation.mutate({ email, isLogin });
  }

  return {
    resend,
    cooldownSeconds: secondsLeft,
    isResending: resendMutation.isPending,
  };
}
