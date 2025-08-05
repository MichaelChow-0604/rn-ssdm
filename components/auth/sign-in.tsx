import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import "~/global.css";
import { signInSchema } from "~/schema/auth-schema";

interface SignInProps {
  setIsSignIn: (isSignIn: boolean) => void;
}

type SignInFormFields = z.infer<typeof signInSchema>;

export default function SignIn({ setIsSignIn }: SignInProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormFields) => {
    console.log(data);
  };

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
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="eg: jon.smith@email.com"
                className="bg-textfield border-0 placeholder:text-placeholder"
              />
            )}
          />
          {/* Email validation error */}
          {errors.email && (
            <Text className="text-redtext text-sm">{errors.email.message}</Text>
          )}
        </View>

        {/* Password */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Password</Label>
          {/* Password input with validation */}
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="bg-textfield border-0 placeholder:text-placeholder"
                placeholder="**********"
              />
            )}
          />
          {/* Password validation error */}
          {errors.password && (
            <Text className="text-redtext text-sm">
              {errors.password.message}
            </Text>
          )}
        </View>
      </View>

      {/* Forget Password */}
      <Link href="/(auth)/(forget-password)" className="text-right mt-1">
        <Text className="text-redtext">Forget Password?</Text>
      </Link>

      {/* Sign in Button */}
      <Button
        className="bg-button mt-4 rounded-xl"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-semibold">SIGN IN</Text>
      </Button>

      {/* Sign up switch */}
      <View className="flex-row justify-center mt-8 gap-2">
        <Text className="text-subtitle text-lg">Don't have an account?</Text>
        <Pressable
          className="flex flex-row items-center"
          onPress={() => setIsSignIn(false)}
        >
          <Text className="text-buttontext text-lg font-bold">SIGN UP</Text>
        </Pressable>
      </View>
    </View>
  );
}
