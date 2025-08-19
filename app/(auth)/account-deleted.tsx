import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { RETURN_SUCCESS } from "~/constants/auth-placeholders";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/lib/auth-context";

export default function AccountDeleted() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    setIsAuthenticated(false);
  }, []);

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

        <Text className="text-3xl font-bold my-4">{RETURN_SUCCESS}</Text>
        <Text className="text-lg text-center">
          Your account has been deleted.
        </Text>

        <Button
          className="bg-button text-buttontext my-8 w-full"
          onPress={() => router.replace("/auth")}
        >
          <Text className="text-white font-bold">BACK TO LOGIN</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
