import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import {
  DONT_HAVE_ACCOUNT,
  EMAIL_PLACEHOLDER,
  FORGET_PASSWORD,
  PASSWORD_PLACEHOLDER,
  SIGN_IN,
  SIGN_UP,
} from "~/constants/auth-placeholders";
import { forgotPassword, signIn } from "~/lib/http/endpoints/auth";
import { toast } from "sonner-native";
import {
  ForgotPasswordResponse,
  SignInResponse,
} from "~/lib/http/response-type/auth";
import { SignInPayload } from "~/lib/http/request-type/auth";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import * as Notifications from "expo-notifications";

interface SignInProps {
  // For toggling the state in the parent AuthPage component
  setIsSignIn: (isSignIn: boolean) => void;
}

type SignInFormFields = z.infer<typeof signInSchema>;

export default function SignIn({ setIsSignIn }: SignInProps) {
  const router = useRouter();

  const signInMutation = useApiMutation<SignInResponse, SignInPayload>({
    mutationKey: ["auth", "sign-in"],
    mutationFn: signIn,
    onSuccess: ({ email, session }) => {
      router.replace({
        pathname: "/(auth)/otp-verification",
        params: { email, session, mode: "signin" },
      });
    },
    onError: ({ status }) => {
      switch (status) {
        case 400:
          toast.error("Invalid credentials. User not found.");
          break;
        default:
          toast.error("Something went wrong. Please try again later.");
      }
    },
  });

  const isSigningIn = signInMutation.isPending || signInMutation.isSuccess;

  // Sign in validation form
  const {
    control: signInControl,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
    getValues,
    setError,
    clearErrors: clearSignInErrors,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
  });

  const onSignInSubmit = (formData: SignInFormFields): void => {
    Keyboard.dismiss();
    signInMutation.mutate(formData);
  };

  const handleSignIn = async () => {
    Keyboard.dismiss();
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Enable Notifications",
        "Please enable notifications permission to continue.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: async () => await Linking.openSettings(),
          },
        ]
      );
      return;
    }

    clearSignInErrors();
    handleSignInSubmit(onSignInSubmit)();
  };

  const forgotPasswordMutation = useApiMutation<ForgotPasswordResponse, string>(
    {
      mutationKey: ["auth", "forgot-password"],
      mutationFn: forgotPassword,
      onSuccess: ({ email, session }) => {
        router.push({
          pathname: "/(auth)/(forget-password)/otp-verification-forget",
          params: { email, session },
        });
      },
      onError: () =>
        toast.error("Something went wrong. Please try again later."),
    }
  );

  const isForgettingPassword = forgotPasswordMutation.isPending;

  const handleForgetPassword = async () => {
    Keyboard.dismiss();

    // Only email error should be visible in forget-password flow
    clearSignInErrors(["password", "email"]);

    const email = (getValues("email") || "").trim();

    if (!email) {
      setError("email", { message: "Please enter the email first" });
      return;
    }

    const result = forgetPasswordValidationSchema.safeParse({ email });
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid email address";
      setError("email", { type: "manual", message: msg });
      return;
    }

    // TODO: Call API to send OTP
    forgotPasswordMutation.mutate(email);
    return;
  };

  // Clear all errors when screen comes into focus (when navigating back)
  useFocusEffect(() => clearSignInErrors());

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
                autoCapitalize="none"
                placeholder={EMAIL_PLACEHOLDER}
                placeholderClassName="text-placeholder"
                className="bg-textfield border-0 text-black"
              />
            )}
          />
          {/* Email validation error */}
          {signInErrors.email ? (
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
                autoCapitalize="none"
                placeholderClassName="text-placeholder"
                className="bg-textfield border-0 text-black"
                placeholder={PASSWORD_PLACEHOLDER}
                secureTextEntry
              />
            )}
          />
          {/* Only show password error if there's no forget password error */}
          {signInErrors.password && (
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
        className="mt-2 self-end"
        disabled={isForgettingPassword}
      >
        {isForgettingPassword ? (
          <ActivityIndicator size="small" color="#438BF7" />
        ) : (
          <Text className="text-redtext">{FORGET_PASSWORD}</Text>
        )}
      </TouchableOpacity>

      {/* Sign in Button */}
      <Button
        className="bg-button mt-4 rounded-xl"
        onPress={handleSignIn}
        disabled={isSigningIn || isForgettingPassword}
      >
        {isSigningIn ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className="text-white font-semibold">{SIGN_IN}</Text>
        )}
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
