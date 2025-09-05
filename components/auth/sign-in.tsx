import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import "~/global.css";
import {
  forgetPasswordValidationSchema,
  signInSchema,
} from "~/schema/auth-schema";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  DONT_HAVE_ACCOUNT,
  EMAIL_PLACEHOLDER,
  FORGET_PASSWORD,
  PASSWORD_PLACEHOLDER,
  SIGN_IN,
  SIGN_UP,
} from "~/constants/auth-placeholders";
import { api } from "~/lib/axios";
import { beautifyResponse } from "~/lib/utils";

interface SignInProps {
  // For toggling the state in the parent AuthPage component
  setIsSignIn: (isSignIn: boolean) => void;
}

type SignInFormFields = z.infer<typeof signInSchema>;

export default function SignIn({ setIsSignIn }: SignInProps) {
  const router = useRouter();

  // Sign in validation form
  const {
    control: signInControl,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
    watch,
    clearErrors: clearSignInErrors,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
  });

  // Forget password validation form
  const {
    formState: { errors: forgetPasswordErrors },
    trigger: triggerForgetPassword,
    setValue,
    clearErrors: clearForgetPasswordErrors,
    reset: resetForgetPassword,
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgetPasswordValidationSchema),
    mode: "onSubmit",
  });

  const watchedEmail = watch("email");

  const onSignInSubmit = async (formData: SignInFormFields) => {
    try {
      const { data, status } = await api.post("/api/v1/tokens", formData);

      if (status === 200) {
        console.log("SIGN IN SUCCESSFULLY", beautifyResponse(data));
        router.push({
          pathname: "/(auth)/otp-verification",
          params: { email: data.email, mode: "signin" },
        });
      }
    } catch (error) {
      console.log("ERRORRRRRRRRRRRRRRRRRR", error);
    }
  };

  const handleSignIn = () => {
    // Clear forget password errors when sign-in is submitted
    clearForgetPasswordErrors();
    resetForgetPassword();
    handleSignInSubmit(onSignInSubmit)();
  };

  const handleForgetPassword = async () => {
    // Set the email value in the forget password form
    setValue("email", watchedEmail);

    // Validate email field using the custom validation schema
    const isEmailValid = await triggerForgetPassword("email", {
      shouldFocus: false,
    });

    if (isEmailValid) {
      // Navigate to forget password flow
      router.push({
        pathname: "/(auth)/(forget-password)/otp-verification-forget",
        params: {
          email: watchedEmail,
        },
      });
    }
  };

  // Clear all errors when screen comes into focus (when navigating back)
  useFocusEffect(
    useCallback(() => {
      clearSignInErrors();
      clearForgetPasswordErrors();
    }, [clearSignInErrors, clearForgetPasswordErrors])
  );

  return (
    <View className="w-[80%]">
      {/* Header */}
      <View className="items-center justify-center pt-20 pb-12 gap-2 w-full">
        <Image
          source={require("~/assets/images/app_icon.png")}
          className="w-16 h-16"
        />
        <Text className="text-2xl font-normal">Sign in</Text>
      </View>

      {/* Inputs */}
      <View className="flex-col gap-4">
        {/* Email */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Email</Label>
          {/* Email input with validation */}
          <Controller
            name="email"
            control={signInControl}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                autoCorrect={false}
                placeholder={EMAIL_PLACEHOLDER}
                placeholderClassName="text-placeholder"
                className="bg-textfield border-0 text-black"
              />
            )}
          />
          {/* Email validation error */}
          {/* Show only the most recent error - prioritize forget password error */}
          {forgetPasswordErrors.email ? (
            <Text className="text-redtext text-sm">
              {forgetPasswordErrors.email.message}
            </Text>
          ) : signInErrors.email ? (
            <Text className="text-redtext text-sm">
              {signInErrors.email.message}
            </Text>
          ) : null}
        </View>

        {/* Password */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Password</Label>
          {/* Password input with validation */}
          <Controller
            name="password"
            control={signInControl}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholderClassName="text-placeholder"
                className="bg-textfield border-0 text-black"
                placeholder={PASSWORD_PLACEHOLDER}
                secureTextEntry
              />
            )}
          />
          {/* Only show password error if there's no forget password error */}
          {!forgetPasswordErrors.email && signInErrors.password && (
            <Text className="text-redtext text-sm">
              {signInErrors.password.message}
            </Text>
          )}
        </View>
      </View>

      {/* Forget Password */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleForgetPassword}
        className="mt-1 items-end"
      >
        <Text className="text-redtext">{FORGET_PASSWORD}</Text>
      </TouchableOpacity>

      {/* Sign in Button */}
      <Button className="bg-button mt-4 rounded-xl" onPress={handleSignIn}>
        <Text className="text-white font-semibold">{SIGN_IN}</Text>
      </Button>

      {/* Sign up switch */}
      <View className="flex-row justify-center mt-8 gap-2">
        <Text className="text-subtitle text-lg">{DONT_HAVE_ACCOUNT}</Text>
        <Pressable
          className="flex flex-row items-center"
          onPress={() => setIsSignIn(false)}
        >
          <Text className="text-buttontext text-lg font-bold">{SIGN_UP}</Text>
        </Pressable>
      </View>
    </View>
  );
}
