import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Entypo from "@expo/vector-icons/Entypo";

interface PasswordInputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
}

export function PasswordInput<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
}: PasswordInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({ name, control });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return (
    <View className="flex flex-col gap-1">
      <Label className="text-subtitle">{label}</Label>
      <View className="relative">
        <Input
          onChangeText={onChange}
          onBlur={onBlur}
          value={(value as string) ?? ""}
          className="pr-12 bg-textfield border-0 text-black"
          placeholderClassName="text-placeholder"
          placeholder={placeholder}
          secureTextEntry={!isPasswordVisible}
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
      {error?.message ? (
        <Text className="text-redtext text-sm">{String(error.message)}</Text>
      ) : null}
    </View>
  );
}
