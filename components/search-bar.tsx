import { View } from "react-native";
import { Input } from "./ui/input";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({ className, placeholder }: SearchBarProps) {
  return (
    <View
      className={`h-16 border-solid border border-gray-300 rounded-full pl-6 pr-8 flex justify-center w-full flex-row items-center gap-2 ${className}`}
    >
      <Input
        className="w-full h-full border-0 rounded-full bg-transparent text-black"
        placeholder={placeholder}
      />
      <FontAwesome6 name="magnifying-glass" size={20} color="#6f6f6f" />
    </View>
  );
}
