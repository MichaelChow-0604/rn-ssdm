import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { changePasswordSchema } from "~/schema/auth-schema";
import { useCallback, useMemo, useState } from "react";
import {
  NEW_PASSWORD_DESCRIPTION,
  NEW_PASSWORD_PLACEHOLDER,
  CANCEL,
  UPDATE_PASSWORD,
  NEW_CREDENTIALS,
  NEW_PASSWORD_CONFIRM_PLACEHOLDER,
} from "~/constants/auth-placeholders";
import { BackButton } from "~/components/back-button";
import { IncorrectPassword } from "~/components/pop-up/incorrect-password";
import {
  validatePasswordLength,
  validatePasswordSpecialChar,
  validatePasswordUppercase,
} from "~/lib/password-validation";
import { PasswordInput } from "~/components/password/password-input";
import { PasswordRequirements } from "~/components/password/password-requirement";

type ChangePasswordFormFields = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const methods = useForm<ChangePasswordFormFields>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, watch } = methods;

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");
  const watchedOldPassword = watch("oldPassword");

  const tempCheck = useCallback(() => {
    if (watchedOldPassword === "12345678") {
      router.replace("/return-message-reset");
    } else {
      setOpen(true);
    }
  }, [watchedOldPassword, router]);

  // Memoized validation results
  const validationResults = useMemo(() => {
    if (!watchedPassword) {
      return {
        length: false,
        uppercase: false,
        specialChar: false,
        allValid: false,
      };
    }

    const length = validatePasswordLength(watchedPassword);
    const uppercase = validatePasswordUppercase(watchedPassword);
    const specialChar = validatePasswordSpecialChar(watchedPassword);
    const allValid = length && uppercase && specialChar;

    return { length, uppercase, specialChar, allValid };
  }, [watchedPassword]);

  // Memoized password match check
  const doPasswordsMatch = useMemo(() => {
    return (
      watchedPassword &&
      watchedConfirmPassword &&
      watchedPassword === watchedConfirmPassword
    );
  }, [watchedPassword, watchedConfirmPassword]);

  // Memoized form validity
  const isFormValid = useMemo(() => {
    return (
      validationResults.allValid &&
      doPasswordsMatch &&
      watchedOldPassword.trim().length > 0
    );
  }, [validationResults.allValid, doPasswordsMatch, watchedOldPassword]);

  // Memoized submit handler
  const onSubmit = useCallback(
    (data: ChangePasswordFormFields) => {
      console.log("Form data:", data);
      tempCheck();
    },
    [tempCheck]
  );

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
                disabled={!isFormValid}
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-white text-lg font-bold">
                  {UPDATE_PASSWORD}
                </Text>
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

        <IncorrectPassword visible={open} setOpen={setOpen} />
      </SafeAreaView>
    </FormProvider>
  );
}
