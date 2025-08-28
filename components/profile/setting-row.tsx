import { Text, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  labelClassName?: string;
}

export function SettingRow({
  icon,
  label,
  onPress,
  right,
  labelClassName,
}: SettingRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="flex items-center justify-center w-[20%]">{icon}</View>
      <Text
        className={`font-semibold text-gray-600 flex-1 ${labelClassName ?? ""}`}
      >
        {label}
      </Text>
      {right ?? <Entypo name="chevron-small-right" size={24} color="#4b5563" />}
    </TouchableOpacity>
  );
}
