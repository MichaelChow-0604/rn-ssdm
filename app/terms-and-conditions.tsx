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
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const { set: setAccepted } = useLocalStorage<boolean>("accepted");

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // contentSize.height: the total height of the scrollable content, including padding/margin
    // layoutMeasurement.height: the height of the visible part of the scrollable content, not including the header and button area
    // contentOffset.y: how far you've scrolled from the very top of the content
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const epsilon = 12; // dp tolerance for bounce/rounding

    // If the user has scrolled to the bottom of the scrollable content, set isAtBottom to true
    if (
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height - epsilon
    ) {
      setIsAtBottom(true);
    }
  };

  const canAccept = isAtBottom || contentHeight <= containerHeight;

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
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsVerticalScrollIndicator
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(_, h) => setContentHeight(h)}
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
          </Text>
        </View>
      </ScrollView>

      <View className="w-full px-6 py-6 border-t border-gray-300">
        <Button
          className="bg-button"
          disabled={!canAccept}
          onPress={handleAccept}
        >
          <Text className="text-white font-bold">Accept</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
