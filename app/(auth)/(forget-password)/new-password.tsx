import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { newPasswordSchema } from "~/schema/auth-schema";
import { useCallback, useMemo, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import {
  NEW_PASSWORD_DESCRIPTION,
  NEW_PASSWORD_PLACEHOLDER,
  NEW_PASSWORD_REQUIREMENTS_1,
  NEW_PASSWORD_REQUIREMENTS_2,
  NEW_PASSWORD_REQUIREMENTS_3,
} from "~/constants/auth-placeholders";

interface PasswordRequirementProps {
  isValid: boolean;
  text: string;
  id: string;
}

interface PasswordInputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
}

type NewPasswordFormFields = z.infer<typeof newPasswordSchema>;

// Password requirement validation functions
const validatePasswordLength = (password: string) => password.length >= 8;
const validatePasswordUppercase = (password: string) => /[A-Z]/.test(password);
const validatePasswordSpecialChar = (password: string) =>
  /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

// Memoized requirement component
const PasswordRequirement = ({
  isValid,
  text,
  id,
}: PasswordRequirementProps) => (
  <View className="flex flex-row gap-2">
    <Checkbox
      className={`native:rounded-full border-button ${
        isValid ? "bg-button" : "bg-transparent"
      }`}
      id={id}
      checked={isValid}
      onCheckedChange={() => {}} // Read only
    />
    <Text className="text-passwordRequirements">{text}</Text>
  </View>
);

// Password input with visibility toggle
const PasswordInput = ({
  control,
  name,
  label,
  placeholder,
  error,
}: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return (
    <View className="flex flex-col gap-1">
      <Label className="text-black font-semibold">{label}</Label>
      <View className="relative">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={placeholder}
              placeholderClassName="text-placeholder"
              className="border-[#E1E1E1] border-2 bg-white text-black pr-12"
              secureTextEntry={!isPasswordVisible}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <Pressable
          onPress={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isPasswordVisible ? (
            <Entypo name="eye" size={20} color="#888888" />
          ) : (
            <Entypo name="eye-with-line" size={20} color="#888888" />
          )}
        </Pressable>
      </View>
      {error && <Text className="text-redtext text-sm">{error}</Text>}
    </View>
  );
};

export default function NewPasswordPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPasswordFormFields>({
    resolver: zodResolver(newPasswordSchema),
  });

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
      router.replace("/return-message");
    },
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-start px-8">
        {/* Header */}
        <View className="flex flex-col gap-4 mt-16 mb-12">
          <Text className="text-2xl font-semibold">Set a new password</Text>
        </View>

        {/* New credentials requirements */}
        <View className="flex flex-col gap-4 mr-8">
          <Text className="text-xl font-semibold">New Credentials</Text>

          {/* Password requirements checkboxes */}
          <View className="flex flex-col gap-2">
            <PasswordRequirement
              isValid={validationResults.length}
              text={NEW_PASSWORD_REQUIREMENTS_1}
              id="at-least-8-characters"
            />
            <PasswordRequirement
              isValid={validationResults.uppercase}
              text={NEW_PASSWORD_REQUIREMENTS_2}
              id="at-least-1-uppercase"
            />
            <PasswordRequirement
              isValid={validationResults.specialChar}
              text={NEW_PASSWORD_REQUIREMENTS_3}
              id="at-least-1-special"
            />
          </View>

          <Text className="text-subtitle text-xl">
            {NEW_PASSWORD_DESCRIPTION}
          </Text>
        </View>

        {/* Input */}
        <View className="flex flex-col gap-4 pt-12 w-full">
          {/* Password */}
          <PasswordInput
            control={control}
            name="password"
            label="Password"
            placeholder={NEW_PASSWORD_PLACEHOLDER}
            error={errors.password?.message}
          />

          {/* Confirm Password */}
          <PasswordInput
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder={NEW_PASSWORD_PLACEHOLDER}
            error={errors.confirmPassword?.message}
          />
        </View>

        {/* Verify Button */}
        <View className="flex flex-col py-8 w-full">
          <Button
            className="bg-button text-buttontext"
            disabled={!isFormValid}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-lg font-bold">
              Update Password
            </Text>
          </Button>
        </View>

        {/* Cancel Button */}
        <View className="flex flex-col w-full">
          <Button
            className="bg-white border-button active:bg-slate-100"
            variant="outline"
            onPress={() => router.replace("/")}
          >
            <Text className="text-button font-bold">Cancel</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
