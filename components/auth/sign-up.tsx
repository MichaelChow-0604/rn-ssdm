import { Image, Pressable, Text, View } from "react-native";
import { useCallback, useMemo, useState } from "react";
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
  NEW_PASSWORD_REQUIREMENTS_1,
  NEW_PASSWORD_REQUIREMENTS_2,
  NEW_PASSWORD_REQUIREMENTS_3,
} from "~/constants/auth-placeholders";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

interface SignUpProps {
  setIsSignIn: (isSignIn: boolean) => void;
}

type SignUpFormFields = z.infer<typeof signUpSchema>;

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

function validatePasswordLength(password: string) {
  return password.length >= 8;
}
function validatePasswordUppercase(password: string) {
  return /[A-Z]/.test(password);
}
function validatePasswordSpecialChar(password: string) {
  return /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
}

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
      onCheckedChange={() => {}}
    />
    <Text className="text-passwordRequirements">{text}</Text>
  </View>
);

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
      <Label className="text-subtitle">{label}</Label>
      <View className="relative">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              className="bg-textfield border-0 text-black pr-12"
              placeholderClassName="text-placeholder"
              placeholder={placeholder}
              secureTextEntry={!isPasswordVisible}
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

export default function SignUp({ setIsSignIn }: SignUpProps) {
  const [checked, setChecked] = useState(false);
  const [showAcceptTerms, setShowAcceptTerms] = useState(false);
  const [openTNP, setOpenTNP] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormFields>({
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
    <View className="w-[80%]">
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
            control={control}
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
            control={control}
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
            control={control}
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
            <Text className="text-redtext text-sm">{errors.email.message}</Text>
          )}
        </View>

        {/* Password requirements (above the password field) */}
        <View className="flex flex-col gap-4 mt-2">
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
        </View>

        {/* Password */}
        <PasswordInput
          control={control}
          name="password"
          label="Password"
          placeholder={PASSWORD_PLACEHOLDER}
          error={errors.password?.message}
        />

        {/* Confirm Password */}
        <PasswordInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder={PASSWORD_PLACEHOLDER}
          error={errors.confirmPassword?.message}
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
    </View>
  );
}
