import { toast } from "sonner-native";
import { useCooldown } from "~/hooks/use-cooldown";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { resendConfirmation } from "~/lib/http/endpoints/auth";
import { ResendOTPResponse } from "~/lib/http/response-type/auth";

export function useOtpResend(email: string, onSession: (s: string) => void) {
  const { secondsLeft, start } = useCooldown(60);

  const resendMutation = useApiMutation<ResendOTPResponse, string>({
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
    resendMutation.mutate(String(email));
  }

  return {
    resend,
    cooldownSeconds: secondsLeft,
    isResending: resendMutation.isPending,
  };
}
