import { Text, View } from "react-native";
import { Checkbox } from "~/components/ui/checkbox";
import {
  NEW_PASSWORD_REQUIREMENTS_1,
  NEW_PASSWORD_REQUIREMENTS_2,
  NEW_PASSWORD_REQUIREMENTS_3,
} from "~/constants/auth-placeholders";

interface PasswordRequirementsProps {
  length: boolean;
  uppercase: boolean;
  specialChar: boolean;
  idPrefix?: string;
}

export function PasswordRequirements({
  length,
  uppercase,
  specialChar,
  idPrefix = "pwd-req",
}: PasswordRequirementsProps) {
  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-row gap-2 items-start">
        <Checkbox
          className={`native:rounded-full border-button ${
            length ? "bg-button" : "bg-transparent"
          }`}
          id={`${idPrefix}-length`}
          checked={length}
          onCheckedChange={() => {}}
        />
        <View className="flex-1">
          <Text className="text-passwordRequirements shrink">
            {NEW_PASSWORD_REQUIREMENTS_1}
          </Text>
        </View>
      </View>

      <View className="flex flex-row gap-2 items-start">
        <Checkbox
          className={`native:rounded-full border-button ${
            uppercase ? "bg-button" : "bg-transparent"
          }`}
          id={`${idPrefix}-uppercase`}
          checked={uppercase}
          onCheckedChange={() => {}}
        />
        <View className="flex-1">
          <Text className="text-passwordRequirements shrink">
            {NEW_PASSWORD_REQUIREMENTS_2}
          </Text>
        </View>
      </View>

      <View className="flex flex-row gap-2 items-start">
        <Checkbox
          className={`native:rounded-full border-button ${
            specialChar ? "bg-button" : "bg-transparent"
          }`}
          id={`${idPrefix}-special`}
          checked={specialChar}
          onCheckedChange={() => {}}
        />
        <View className="flex-1">
          <Text className="text-passwordRequirements shrink">
            {NEW_PASSWORD_REQUIREMENTS_3}
          </Text>
        </View>
      </View>
    </View>
  );
}
