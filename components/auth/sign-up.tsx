import { Image, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import "~/global.css";
import { TermsAndPolicies } from "../pop-up/terms-and-policies";
import { signUpSchema } from "~/schema/auth-schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import AcceptAlert from "../pop-up/accept-alert";
import {
  EMAIL_PLACEHOLDER,
  FIRST_NAME_PLACEHOLDER,
  HAVE_ACCOUNT,
  LAST_NAME_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
  SIGN_IN,
  SIGN_UP,
  SIGN_UP_DESCRIPTION,
} from "~/constants/auth-placeholders";

interface SignUpProps {
  setIsSignIn: (isSignIn: boolean) => void;
}

type SignUpFormFields = z.infer<typeof signUpSchema>;

export default function SignUp({ setIsSignIn }: SignUpProps) {
  const [checked, setChecked] = useState(false);
  const [showAcceptTerms, setShowAcceptTerms] = useState(false);
  const [openTNP, setOpenTNP] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormFields) => {
    if (checked) {
      console.log(data);
    } else {
      setShowAcceptTerms(true);
    }
  };

  return (
    <View className="w-[80%]">
      <TermsAndPolicies open={openTNP} setOpen={setOpenTNP} />
      <AcceptAlert open={showAcceptTerms} setOpen={setShowAcceptTerms} />

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
          {/* First Name input validation */}
          <Controller
            name="firstName"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="bg-textfield border-0 placeholder:text-placeholder"
                placeholder={FIRST_NAME_PLACEHOLDER}
              />
            )}
          />
          {/* First Name validation error */}
          {errors.firstName && (
            <Text className="text-redtext text-sm">
              {errors.firstName.message}
            </Text>
          )}
        </View>

        {/* Last Name */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Last Name</Label>
          {/* Last Name input validation */}
          <Controller
            name="lastName"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="bg-textfield border-0 placeholder:text-placeholder"
                placeholder={LAST_NAME_PLACEHOLDER}
              />
            )}
          />
          {/* Last Name validation error */}
          {errors.lastName && (
            <Text className="text-redtext text-sm">
              {errors.lastName.message}
            </Text>
          )}
        </View>

        {/* Email */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Email</Label>
          {/* Email input validation */}
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="bg-textfield border-0 placeholder:text-placeholder"
                placeholder={EMAIL_PLACEHOLDER}
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
          {/* Password input validation */}
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
                placeholder={PASSWORD_PLACEHOLDER}
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

        {/* Confirm Password */}
        <View className="flex-col gap-2">
          <Label className="text-subtitle">Confirm Password</Label>
          {/* Confirm Password input validation */}
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="bg-textfield border-0 placeholder:text-placeholder"
                placeholder={PASSWORD_PLACEHOLDER}
              />
            )}
          />
          {/* Confirm Password validation error */}
          {errors.confirmPassword && (
            <Text className="text-redtext text-sm">
              {errors.confirmPassword.message}
            </Text>
          )}
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
          {SIGN_UP_DESCRIPTION}{" "}
          <Text className="text-buttontext" onPress={() => setOpenTNP(true)}>
            terms & policy.
          </Text>
        </Text>
      </View>

      {/* Sign up Button */}
      <Button
        className="bg-button mt-4 rounded-xl"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-semibold">{SIGN_UP}</Text>
      </Button>

      {/* Sign up switch */}
      <View className="flex-row justify-center py-8 gap-2">
        <Text className="text-subtitle text-lg">{HAVE_ACCOUNT}</Text>
        <Pressable
          className="flex flex-row items-center"
          onPress={() => setIsSignIn(true)}
        >
          <Text className="text-buttontext text-lg font-bold">{SIGN_IN}</Text>
        </Pressable>
      </View>
    </View>
  );
}
