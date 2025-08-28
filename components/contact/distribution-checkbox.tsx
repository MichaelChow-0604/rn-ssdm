import { View, Text } from "react-native";
import { Checkbox } from "~/components/ui/checkbox";
import { AntDesign } from "@expo/vector-icons";

interface DistributionCheckboxProps {
  isWhatsappChecked: boolean;
  setIsWhatsappChecked: (value: boolean) => void;
  isSMSChecked: boolean;
  setIsSMSChecked: (value: boolean) => void;
  disabled?: boolean;
}

export function DistributionCheckbox({
  isWhatsappChecked,
  setIsWhatsappChecked,
  isSMSChecked,
  setIsSMSChecked,
  disabled,
}: DistributionCheckboxProps) {
  return (
    <View className="flex-row gap-4 items-center justify-start">
      <AntDesign name="notification" size={24} color="#438BF7" />

      <View className="flex-col gap-2">
        {/* Email */}
        <View className="flex-row gap-2 items-center justify-start">
          <Checkbox
            checked={true}
            disabled={true}
            onCheckedChange={() => {}}
            className="native:h-[16] native:w-[16] native:rounded-sm border-subtitle bg-subtitle"
          />
          <Text className="text-black font-semibold text-lg">
            Email (Necessary)
          </Text>
        </View>

        {/* Whatsapp */}
        <View className="flex-row gap-2 items-center justify-start">
          <Checkbox
            checked={isWhatsappChecked}
            disabled={disabled}
            onCheckedChange={setIsWhatsappChecked}
            className={`native:h-[16] native:w-[16] native:rounded-sm border-subtitle ${
              isWhatsappChecked
                ? "bg-button border-button"
                : "bg-white border-gray-200"
            }`}
          />
          <Text className="text-black font-semibold text-lg">Whatsapp</Text>
        </View>

        {/* SMS */}
        <View className="flex-row gap-2 items-center justify-start">
          <Checkbox
            checked={isSMSChecked}
            disabled={disabled}
            onCheckedChange={setIsSMSChecked}
            className={`native:h-[16] native:w-[16] native:rounded-sm border-subtitle ${
              isSMSChecked
                ? "bg-button border-button"
                : "bg-white border-gray-200"
            }`}
          />
          <Text className="text-black font-semibold text-lg">SMS</Text>
        </View>
      </View>
    </View>
  );
}
