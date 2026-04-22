import { useRouter } from "expo-router";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner-native";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { resetPassword } from "~/lib/http/endpoints/auth";
import type { ResetPasswordResponse } from "~/lib/http/response-type/auth";
import { newPasswordSchema } from "~/schema/auth-schema";
import { usePasswordValidation } from "~/hooks/use-password-validation";
import { ResetPasswordPayload } from "~/lib/http/request-type/auth";

type NewPasswordFormFields = z.infer<typeof newPasswordSchema>;

interface UseNewPasswordFormParams {
  email: string;
}

interface UseNewPasswordFormReturn {
  form: UseFormReturn<NewPasswordFormFields>;
  isResettingPassword: boolean;
  validationResults: ReturnType<typeof usePasswordValidation>;
  onSubmit: () => void;
  onCancel: () => void;
}

export function useNewPasswordForm({
  email,
}: UseNewPasswordFormParams): UseNewPasswordFormReturn {
  const router = useRouter();

  const form = useForm<NewPasswordFormFields>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const watchedPassword = useWatch({
    control: form.control,
    name: "password",
    defaultValue: "",
  });
  const validationResults = usePasswordValidation(watchedPassword);

  const resetPasswordMutation = useApiMutation<
    ResetPasswordResponse,
    ResetPasswordPayload
  >({
    mutationKey: ["auth", "sign-up"],
    mutationFn: resetPassword,
    onSuccess: () => router.replace("/return-message-forget"),
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const isResettingPassword = resetPasswordMutation.isPending;

  const onSubmit = form.handleSubmit((data) => {
    resetPasswordMutation.mutate({
      email,
      confirm_password: data.confirmPassword,
      password: data.password,
    });
  });

  function onCancel() {
    router.replace("/");
  }

  return {
    form,
    isResettingPassword,
    validationResults,
    onSubmit,
    onCancel,
  };
}
