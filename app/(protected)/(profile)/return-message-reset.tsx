import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { Button } from "~/components/ui/button";
import {
  RETURN_MESSAGE_FORGET_DESC_1,
  RETURN_SUCCESS,
  SIGN_IN,
} from "~/constants/auth-placeholders";
import { useAuth } from "~/lib/auth-context";

export default function ReturnMessageResetPage() {
  const { setIsAuthenticated } = useAuth();

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

        <Text className="text-2xl font-bold my-4">{RETURN_SUCCESS}</Text>
        <Text className="text-lg text-center">
          {RETURN_MESSAGE_FORGET_DESC_1}
        </Text>

        <Button
          className="w-full mt-8 bg-button rounded-xl"
          onPress={() => setIsAuthenticated(false)}
        >
          <Text className="text-white font-bold">{SIGN_IN}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
