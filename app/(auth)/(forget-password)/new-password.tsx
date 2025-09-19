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
import { newPasswordSchema } from "~/schema/auth-schema";
import { useCallback, useMemo } from "react";
import {
  NEW_PASSWORD_DESCRIPTION,
  NEW_PASSWORD_PLACEHOLDER,
  CANCEL,
  UPDATE_PASSWORD,
  NEW_PASSWORD_TITLE,
  NEW_CREDENTIALS,
  NEW_PASSWORD_CONFIRM_PLACEHOLDER,
} from "~/constants/auth-placeholders";
import {
  validatePasswordLength,
  validatePasswordSpecialChar,
  validatePasswordUppercase,
} from "~/lib/password-validation";
import { PasswordInput } from "~/components/password/password-input";
import { PasswordRequirements } from "~/components/password/password-requirement";

type NewPasswordFormFields = z.infer<typeof newPasswordSchema>;

export default function NewPasswordPage() {
  const router = useRouter();

  const methods = useForm<NewPasswordFormFields>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, watch } = methods;

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

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
    return validationResults.allValid && doPasswordsMatch;
  }, [validationResults.allValid, doPasswordsMatch]);

  // Memoized submit handler
  const onSubmit = useCallback(
    (data: NewPasswordFormFields) => {
      console.log("Form data:", data);
      router.replace("/return-message-forget");
    },
    [router]
  );

  return (
    <FormProvider {...methods}>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          style={{ flexGrow: 1 }}
          behavior={Platform.select({ ios: "padding", android: "height" })}
        >
          <ScrollView
            className="bg-white"
            contentContainerClassName="items-start px-8"
          >
            {/* Header */}
            <View className="flex flex-col gap-4 mt-16 mb-12">
              <Text className="text-2xl font-bold">{NEW_PASSWORD_TITLE}</Text>
            </View>

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
              {/* Password */}
              <PasswordInput<NewPasswordFormFields>
                name="password"
                label="Password"
                placeholder={NEW_PASSWORD_PLACEHOLDER}
              />

              {/* Confirm Password */}
              <PasswordInput<NewPasswordFormFields>
                name="confirmPassword"
                label="Confirm Password"
                placeholder={NEW_PASSWORD_CONFIRM_PLACEHOLDER}
              />
            </View>

            {/* Button container */}
            <View className="flex flex-col py-8 w-full gap-4">
              {/* Update Button */}
              <Button
                className="bg-button text-buttontext"
                disabled={!isFormValid}
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-white text-lg font-bold">
                  {UPDATE_PASSWORD}
                </Text>
              </Button>

              {/* Cancel Button */}
              <Button
                className="bg-white border-button active:bg-slate-100"
                variant="outline"
                onPress={() => router.replace("/")}
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
