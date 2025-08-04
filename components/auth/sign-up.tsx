import { Image, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import "~/global.css";
import { TermsAndPolicies } from "../pop-up/terms-and-policies";

interface SignUpProps {
  setIsSignIn: (isSignIn: boolean) => void;
}

export default function SignUp({ setIsSignIn }: SignUpProps) {
  const [checked, setChecked] = useState(false);
  const [openTNP, setOpenTNP] = useState(false);

  return (
    <View className="w-[80%]">
      <TermsAndPolicies open={openTNP} setOpen={setOpenTNP} />
      {/* Header */}
      <View className="items-center justify-center pt-12 pb-12 gap-2 w-full">
        <Image
          source={require("~/assets/images/app_icon.png")}
          className="w-16 h-16"
        />
        <Text className="text-2xl font-normal">Create account</Text>
      </View>

      {/* Inputs */}
      <View className="flex-col gap-4">
        {/* First Name */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">First Name</Label>
          <Input
            className="bg-textfield border-0 placeholder:text-placeholder"
            placeholder="eg: Jon"
          />
        </View>

        {/* Last Name */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Last Name</Label>
          <Input
            className="bg-textfield border-0 placeholder:text-placeholder"
            placeholder="eg: Smith"
          />
        </View>

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

        {/* Confirm Password */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Confirm Password</Label>
          <Input
            className="bg-textfield border-0 placeholder:text-placeholder"
            placeholder="**********"
          />
        </View>
      </View>

      {/* Terms and Conditions */}
      <View className="flex-row justify-center mt-4 gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={() => setChecked(!checked)}
          className="native:h-[16] native:w-[16] native:rounded-none"
        />
        <Text className="text-subtitle text-sm">
          I understood the{" "}
          <Text className="text-buttontext" onPress={() => setOpenTNP(true)}>
            terms & policies
          </Text>
        </Text>
      </View>

      {/* Sign up Button */}
      <Button className="bg-button mt-4 rounded-xl">
        <Text className="text-white font-semibold">SIGN UP</Text>
      </Button>

      {/* Sign up switch */}
      <View className="flex-row justify-center py-8 gap-2">
        <Text className="text-subtitle text-lg">Have an account?</Text>
        <Pressable
          className="flex flex-row items-center"
          onPress={() => setIsSignIn(true)}
        >
          <Text className="text-buttontext text-lg">SIGN IN</Text>
        </Pressable>
      </View>
    </View>
  );
}
