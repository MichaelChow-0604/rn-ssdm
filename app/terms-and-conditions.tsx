import { router } from "expo-router";
import { useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useLocalStorage } from "~/hooks/use-local-storage";
import { TEMP_LONG_TEXT } from "~/lib/constants";

export default function TermsAndConditions() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { set: setAccepted } = useLocalStorage<boolean>("accepted");

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

    if (contentOffset.y + layoutMeasurement.height >= contentSize.height) {
      setIsAtBottom(true);
    }
  };

  const handleAccept = async () => {
    await setAccepted(true);
    router.replace("/(auth)/auth");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start bg-white">
      <Text className="text-3xl font-bold">Terms and Conditions</Text>
      <Separator className="mt-6 bg-gray-300" />

      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="gap-8 py-6"
        onScroll={handleScroll}
        showsVerticalScrollIndicator
      >
        <Text className="text-center text-red-500 text-xl font-semibold">
          Please scroll to read through the content before accepting
        </Text>

        <View className="flex-col gap-2">
          <Text className="text-2xl font-bold">Terms of use</Text>
          <Text>
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
          </Text>
        </View>

        <View className="flex-col gap-2">
          <Text className="text-2xl font-bold">Disclaimer</Text>
          <Text>
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
          </Text>
        </View>

        <View className="flex-col gap-2">
          <Text className="text-2xl font-bold">Privacy Policy</Text>
          <Text>
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
            {TEMP_LONG_TEXT}
          </Text>
        </View>
      </ScrollView>

      <View className="w-full px-6 pt-6 border-t border-gray-300">
        <Button
          className="bg-button"
          disabled={!isAtBottom}
          onPress={handleAccept}
        >
          <Text className="text-white font-bold">Accept</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
