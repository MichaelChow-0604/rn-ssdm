import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { forgetPasswordSchema } from "~/schema/auth-schema";

type ForgetPasswordFormFields = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPasswordPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgetPasswordSchema),
  });

  // Check if email is filled
  const emailValue = watch("email");
  const isEmailFilled = emailValue.trim().length > 0;

  const onSubmit = (data: ForgetPasswordFormFields) => {
    console.log(data);
    router.push({
      pathname: "/otp-verification",
      params: {
        email: data.email,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-start px-8">
        <BackButton className="my-12" />

        {/* Header */}
        <View className="flex flex-col gap-4">
          <Text className="text-2xl font-semibold">Forgot Password</Text>
          <Text className="font-semibold text-subtitle">
            Please enter your email to reset the password
          </Text>
        </View>

        {/* Input */}
        <View className="flex flex-col gap-2 pt-12 w-full">
          <Label className="text-black font-semibold">Your Email</Label>
          {/* Email input validation */}
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter your email"
                className="border-[#E1E1E1] border-2 bg-white placeholder:text-placeholder"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          {/* Email validation error */}
          {errors.email && (
            <Text className="text-redtext text-sm">{errors.email.message}</Text>
          )}
        </View>

        {/* Button */}
        <View className="flex flex-col gap-4 pt-8 w-full">
          <Button
            className="bg-button text-buttontext"
            disabled={!isEmailFilled}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-lg font-bold">Reset Password</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
