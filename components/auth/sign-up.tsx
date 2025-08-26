import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import "~/global.css";
import { TermsAndPolicies } from "../pop-up/terms-and-policies";
import { signUpSchema } from "~/schema/auth-schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FormProvider } from "react-hook-form";
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
import { useRouter } from "expo-router";
import {
  validatePasswordLength,
  validatePasswordSpecialChar,
  validatePasswordUppercase,
} from "~/lib/password-validation";
import { PasswordInput } from "../password/password-input";
import { PasswordRequirements } from "../password/password-requirement";

interface SignUpProps {
  setIsSignIn: (isSignIn: boolean) => void;
}

type SignUpFormFields = z.infer<typeof signUpSchema>;

export default function SignUp({ setIsSignIn }: SignUpProps) {
  const [checked, setChecked] = useState(false);
  const [showAcceptTerms, setShowAcceptTerms] = useState(false);
  const [openTNP, setOpenTNP] = useState(false);
  const router = useRouter();

  const methods = useForm<SignUpFormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const watchedPassword = watch("password");

  const validationResults = useMemo(() => {
    if (!watchedPassword) {
      return {
        length: false,
        uppercase: false,
        specialChar: false,
      };
    }
    return {
      length: validatePasswordLength(watchedPassword),
      uppercase: validatePasswordUppercase(watchedPassword),
      specialChar: validatePasswordSpecialChar(watchedPassword),
    };
  }, [watchedPassword]);

  const onSubmit = (data: SignUpFormFields) => {
    if (checked) {
      router.push({
        pathname: "/otp-verification",
        params: { email: data.email, mode: "signup" },
      });
    } else {
      setShowAcceptTerms(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <ScrollView className="w-[80%]" showsVerticalScrollIndicator={false}>
        <TermsAndPolicies visible={openTNP} setOpen={setOpenTNP} />
        <AcceptAlert visible={showAcceptTerms} setOpen={setShowAcceptTerms} />

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
            <Controller
              name="firstName"
              control={methods.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="bg-textfield border-0 text-black"
                  placeholderClassName="text-placeholder"
                  placeholder={FIRST_NAME_PLACEHOLDER}
                />
              )}
            />
            {errors.firstName && (
              <Text className="text-redtext text-sm">
                {errors.firstName.message}
              </Text>
            )}
          </View>

          {/* Last Name */}
          <View className="flex-col gap-2">
            <Label className="text-subtitle">Last Name</Label>
            <Controller
              name="lastName"
              control={methods.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="bg-textfield border-0 text-black"
                  placeholderClassName="text-placeholder"
                  placeholder={LAST_NAME_PLACEHOLDER}
                />
              )}
            />
            {errors.lastName && (
              <Text className="text-redtext text-sm">
                {errors.lastName.message}
              </Text>
            )}
          </View>

          {/* Email */}
          <View className="flex-col gap-2">
            <Label className="text-subtitle">Email</Label>
            <Controller
              name="email"
              control={methods.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="bg-textfield border-0 text-black"
                  placeholderClassName="text-placeholder"
                  placeholder={EMAIL_PLACEHOLDER}
                />
              )}
            />
            {errors.email && (
              <Text className="text-redtext text-sm">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password requirements */}
          <View className="flex flex-col gap-4 mt-2">
            <PasswordRequirements
              length={validationResults.length}
              uppercase={validationResults.uppercase}
              specialChar={validationResults.specialChar}
            />
          </View>

          {/* Password */}
          <PasswordInput<SignUpFormFields>
            name="password"
            label="Password"
            placeholder={PASSWORD_PLACEHOLDER}
          />

          {/* Confirm Password */}
          <PasswordInput<SignUpFormFields>
            name="confirmPassword"
            label="Confirm Password"
            placeholder={PASSWORD_PLACEHOLDER}
          />
        </View>

        {/* Terms and Conditions */}
        <View className="flex-row justify-center mt-4 gap-2">
          <Checkbox
            checked={checked}
            onCheckedChange={() => setChecked(!checked)}
            className={`native:h-[16] native:w-[16] native:rounded-none border-subtitle ${
              checked ? "bg-black" : "bg-white"
            }`}
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
      </ScrollView>
    </FormProvider>
  );
}
