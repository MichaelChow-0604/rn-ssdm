import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import "~/global.css";

interface SignInProps {
  setIsSignIn: (isSignIn: boolean) => void;
}

export default function SignIn({ setIsSignIn }: SignInProps) {
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
          <Input
            className="bg-textfield border-0 placeholder:text-placeholder"
            placeholder="eg: jon.smith@email.com"
          />
        </View>

        {/* Password */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Password</Label>
          <Input
            className="bg-textfield border-0 placeholder:text-placeholder"
            placeholder="**********"
          />
        </View>
      </View>

      {/* Forget Password */}
      <Link href="/(auth)/(forget-password)" className="text-right mt-1">
        <Text className="text-redtext">Forget Password?</Text>
      </Link>

      {/* Sign in Button */}
      <Button className="bg-button mt-4 rounded-xl">
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
