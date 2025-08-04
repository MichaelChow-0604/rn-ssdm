import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cn } from "~/lib/utils";

interface BackButtonProps {
  className?: string;
}

export const BackButton = ({ className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className={cn("bg-[#ECECEC] rounded-full p-2", className)}
    >
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
  );
};
