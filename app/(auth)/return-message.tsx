import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  RETURN_MESSAGE_DESC,
  RETURN_MESSAGE_TITLE,
} from "~/constants/auth-placeholders";

export default function ReturnMessagePage() {
  const router = useRouter();

  // Auto-navigate after 2 second
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/(home)/documents");
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        {/* Successful icon */}
        <View className="w-24 h-24 bg-[#EFF4FF] border-button border-2 rounded-full relative">
          <Feather
            name="check"
            size={32}
            color="#438bf7"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </View>

        <Text className="text-3xl font-bold my-4">{RETURN_MESSAGE_TITLE}</Text>
        <Text className="text-lg text-center">{RETURN_MESSAGE_DESC}</Text>
      </View>
    </SafeAreaView>
  );
}
