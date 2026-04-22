import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Separator } from "~/components/ui/separator";
import { TEMP_LONG_TEXT } from "~/lib/constants";

export default function ProfileDisclaimer() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 py-4">
        <BackButton />
        <Text className="text-2xl font-bold">Disclaimer</Text>
      </View>

      <Separator className="mt-6 bg-gray-300" />

      {/* Content */}
      <ScrollView className="flex-1 px-6" contentContainerClassName="py-6">
        <Text>
          {TEMP_LONG_TEXT}
          {TEMP_LONG_TEXT}
          {TEMP_LONG_TEXT}
          {TEMP_LONG_TEXT}
          {TEMP_LONG_TEXT}
          {TEMP_LONG_TEXT}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
