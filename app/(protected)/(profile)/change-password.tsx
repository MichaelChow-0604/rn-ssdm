import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { changePasswordSchema } from "~/schema/auth-schema";
import {
  NEW_PASSWORD_DESCRIPTION,
  NEW_PASSWORD_PLACEHOLDER,
  CANCEL,
  UPDATE_PASSWORD,
  NEW_CREDENTIALS,
  NEW_PASSWORD_CONFIRM_PLACEHOLDER,
} from "~/constants/auth-placeholders";
import { BackButton } from "~/components/back-button";
import { PasswordInput } from "~/components/password/password-input";
import { PasswordRequirements } from "~/components/password/password-requirement";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { ChangePasswordResponse } from "~/lib/http/response-type/auth";
import { ChangePasswordPayload } from "~/lib/http/request-type/auth";
import { changePassword } from "~/lib/http/endpoints/auth";
import { toast } from "sonner-native";
import { usePasswordValidation } from "~/hooks/use-password-validation";
import { useRateLimit } from "~/hooks/use-rate-limit";

type ChangePasswordFormFields = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const router = useRouter();

  const { isLocked, remainingTime, triggerLockout, clearLockout } =
    useRateLimit("change-password");

  const changePasswordMutation = useApiMutation<
    ChangePasswordResponse,
    ChangePasswordPayload
  >({
    mutationKey: ["auth", "sign-up"],
    mutationFn: changePassword,
    onSuccess: () => {
      clearLockout();
      router.replace("/return-message-reset");
    },
    onError: ({ status }) => {
      switch (status) {
        case 400:
          toast.error("Old password does not match.");
          break;
        case 429:
          triggerLockout();
          toast.error(
            "You have reached the maximum number of attempts. Please try again in 15 minutes."
          );
          break;
        default:
          toast.error("Something went wrong. Please try again later.");
      }
    },
  });

  const isResettingPassword = changePasswordMutation.isPending;

  const methods = useForm<ChangePasswordFormFields>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  const watchedPassword = useWatch({
    control: methods.control,
    name: "password",
    defaultValue: "",
  });
  const validationResults = usePasswordValidation(watchedPassword);

  const onSubmit = (data: ChangePasswordFormFields) => {
    if (isLocked) {
      toast.info(`Please wait ${remainingTime} seconds before trying again.`);
      return;
    }

    changePasswordMutation.mutate({
      old_password: data.oldPassword,
      confirm_password: data.confirmPassword,
      password: data.password,
    });
  };

  return (
    <FormProvider {...methods}>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          style={{ flexGrow: 1 }}
          behavior={Platform.select({ ios: "padding", android: "height" })}
        >
          {/* Header */}
          <View className="flex-row items-center gap-2 px-4 pt-4 pb-8">
            <BackButton />
            <Text className="text-2xl font-bold">Change Password</Text>
          </View>

          <ScrollView
            className="bg-white"
            contentContainerClassName="items-start px-8"
          >
            {/* New credentials requirements */}
            <View className="flex flex-col gap-4 mr-8">
              <Text className="text-xl font-semibold">{NEW_CREDENTIALS}</Text>

              {/* Password requirements checkboxes */}
              <PasswordRequirements
                length={validationResults.length}
                uppercase={validationResults.uppercase}
                specialChar={validationResults.specialChar}
              />

              <Text className="text-subtitle text-lg font-semibold">
                {NEW_PASSWORD_DESCRIPTION}
              </Text>
            </View>

            {/* Input */}
            <View className="flex flex-col gap-4 pt-8 w-full">
              {/* Old Password */}
              <PasswordInput<ChangePasswordFormFields>
                name="oldPassword"
                label="Old Password"
                placeholder="Enter your old password"
              />

              {/* Password */}
              <PasswordInput<ChangePasswordFormFields>
                name="password"
                label="Password"
                placeholder={NEW_PASSWORD_PLACEHOLDER}
              />

              {/* Confirm Password */}
              <PasswordInput<ChangePasswordFormFields>
                name="confirmPassword"
                label="Confirm Password"
                placeholder={NEW_PASSWORD_CONFIRM_PLACEHOLDER}
              />
            </View>

            {/* Verify Button */}
            <View className="flex flex-col pt-8 pb-4 w-full">
              <Button
                className="bg-button text-buttontext"
                disabled={isResettingPassword}
                onPress={handleSubmit(onSubmit)}
              >
                {isResettingPassword ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-lg font-bold">
                    {UPDATE_PASSWORD}
                  </Text>
                )}
              </Button>
            </View>

            {/* Cancel Button */}
            <View className="flex flex-col w-full pb-8">
              <Button
                className="bg-white border-button active:bg-slate-100"
                variant="outline"
                onPress={() => router.back()}
              >
                <Text className="text-button font-bold">{CANCEL}</Text>
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </FormProvider>
  );
}
